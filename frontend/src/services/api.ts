import type { VideoInfo } from '../types'

// In the native iOS app VITE_API_BASE_URL must point to the deployed backend.
// In web/dev mode it stays empty and the Vite proxy handles /api/*.
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const res = await fetch(`${API_BASE}/api/info`, {
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
  return `${API_BASE}/api/download?url=${encodeURIComponent(url)}&format_id=${encodeURIComponent(format_id)}`
}

export async function fetchStreamUrl(url: string, format_id: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/stream`, {
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
