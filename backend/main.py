import os
import uuid
import asyncio
import shutil
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import yt_dlp

TMP_DIR = Path("tmp_downloads")


@asynccontextmanager
async def lifespan(app: FastAPI):
    TMP_DIR.mkdir(exist_ok=True)
    yield
    shutil.rmtree(TMP_DIR, ignore_errors=True)
    TMP_DIR.mkdir(exist_ok=True)


app = FastAPI(title="VidSave API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class InfoRequest(BaseModel):
    url: str


class StreamRequest(BaseModel):
    url: str
    format_id: str


def _extract_info(url: str) -> dict:
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        return ydl.extract_info(url, download=False)


def _normalize_formats(formats: list) -> list:
    seen: set[str] = set()
    result = []
    for f in reversed(formats):
        if f.get("vcodec") == "none":
            continue
        if not f.get("url"):
            continue
        height = f.get("height")
        label = f"{height}p" if height else f.get("format_note") or f["format_id"]
        if label in seen:
            continue
        seen.add(label)
        result.append({
            "format_id": f["format_id"],
            "quality": label,
            "ext": f.get("ext", "mp4"),
            "filesize": f.get("filesize") or f.get("filesize_approx"),
        })
    return result


def _download_file(url: str, ydl_opts: dict) -> None:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])


async def _file_iterator(path: Path, chunk_size: int = 65536):
    with open(path, "rb") as f:
        while chunk := f.read(chunk_size):
            yield chunk


@app.post("/api/info")
async def get_info(req: InfoRequest):
    loop = asyncio.get_event_loop()
    try:
        info = await loop.run_in_executor(None, _extract_info, req.url)
    except yt_dlp.utils.DownloadError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    formats = _normalize_formats(info.get("formats", []))
    return {
        "title": info.get("title", "Unknown"),
        "thumbnail": info.get("thumbnail", ""),
        "duration": info.get("duration", 0),
        "formats": formats,
    }


@app.get("/api/download")
async def download_video(
    background_tasks: BackgroundTasks,
    url: str = Query(...),
    format_id: str = Query(...),
):
    file_id = uuid.uuid4().hex
    out_template = str(TMP_DIR / f"{file_id}.%(ext)s")

    ydl_opts = {
        "format": format_id,
        "outtmpl": out_template,
        "quiet": True,
        "no_warnings": True,
    }

    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(None, _download_file, url, ydl_opts)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {e}")

    matches = list(TMP_DIR.glob(f"{file_id}.*"))
    if not matches:
        raise HTTPException(status_code=500, detail="Downloaded file not found")

    filepath = matches[0]
    ext = filepath.suffix.lstrip(".")
    media_type = "video/mp4" if ext == "mp4" else "application/octet-stream"
    file_size = filepath.stat().st_size

    safe_title = file_id
    filename = f"vidsave_{safe_title}.{ext}"

    background_tasks.add_task(filepath.unlink, missing_ok=True)

    return StreamingResponse(
        _file_iterator(filepath),
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(file_size),
        },
    )


@app.post("/api/stream")
async def get_stream_url(req: StreamRequest):
    loop = asyncio.get_event_loop()
    try:
        info = await loop.run_in_executor(None, _extract_info, req.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    for f in info.get("formats", []):
        if f["format_id"] == req.format_id:
            stream_url = f.get("url")
            if stream_url:
                return {"stream_url": stream_url}

    raise HTTPException(status_code=404, detail="Format not found or no direct URL available")


@app.get("/health")
async def health():
    return {"status": "ok"}
