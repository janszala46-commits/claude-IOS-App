import { useState, useCallback } from 'react'
import type { HistoryItem } from '../types'

const STORAGE_KEY = 'vidsave_history'

function readStorage(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as HistoryItem[]
  } catch {
    return []
  }
}

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>(readStorage)

  const add = useCallback((item: HistoryItem) => {
    setItems(prev => {
      const next = [item, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setItems([])
  }, [])

  return { items, add, remove, clear }
}
