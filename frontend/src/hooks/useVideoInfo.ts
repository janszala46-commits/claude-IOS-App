import { useState, useCallback } from 'react'
import { fetchVideoInfo } from '../services/api'
import type { VideoInfo, DownloadStatus } from '../types'

export function useVideoInfo() {
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [status, setStatus] = useState<DownloadStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (url: string) => {
    setStatus('fetching-info')
    setError(null)
    setInfo(null)
    try {
      const data = await fetchVideoInfo(url)
      setInfo(data)
      setStatus('idle')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    setInfo(null)
    setStatus('idle')
    setError(null)
  }, [])

  return { info, status, error, analyze, reset }
}
