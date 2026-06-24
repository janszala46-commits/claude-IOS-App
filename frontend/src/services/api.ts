import type { VideoInfo } from '../types'

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const res = await fetch('/api/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error((detail as { detail?: string }).detail ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export function buildDownloadUrl(url: string, format_id: string): string {
  return `/api/download?url=${encodeURIComponent(url)}&format_id=${encodeURIComponent(format_id)}`
}

export async function fetchStreamUrl(url: string, format_id: string): Promise<string> {
  const res = await fetch('/api/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, format_id }),
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error((detail as { detail?: string }).detail ?? `HTTP ${res.status}`)
  }
  const data = await res.json()
  return (data as { stream_url: string }).stream_url
}
