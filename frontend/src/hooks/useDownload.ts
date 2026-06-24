import { useState, useCallback } from 'react'
import { buildDownloadUrl } from '../services/api'
import type { Format, VideoInfo, HistoryItem } from '../types'

type DownloadState = 'idle' | 'downloading' | 'done' | 'error'

export function useDownload(onComplete: (item: HistoryItem) => void) {
  const [state, setState] = useState<DownloadState>('idle')
  const [error, setError] = useState<string | null>(null)

  const download = useCallback(
    async (info: VideoInfo, format: Format, originalUrl: string) => {
      setState('downloading')
      setError(null)
      try {
        const a = document.createElement('a')
        a.href = buildDownloadUrl(originalUrl, format.format_id)
        a.download = `${info.title}.${format.ext}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        const historyItem: HistoryItem = {
          id: crypto.randomUUID(),
          title: info.title,
          thumbnail: info.thumbnail,
          quality: format.quality,
          format: format.ext,
          format_id: format.format_id,
          fileSize: format.filesize ?? 0,
          downloadDate: new Date().toISOString(),
          originalUrl,
        }
        onComplete(historyItem)
        setState('done')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Download failed')
        setState('error')
      }
    },
    [onComplete],
  )

  const reset = useCallback(() => {
    setState('idle')
    setError(null)
  }, [])

  return { state, error, download, reset }
}
