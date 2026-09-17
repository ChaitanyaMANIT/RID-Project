import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * localStorage-backed state. Safe in private mode, safe with corrupt data,
 * safe when the key changes — it just falls back to the initial value.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void, () => void] {
  const initialRef = useRef(initial)

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialRef.current
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return initialRef.current
      return JSON.parse(raw) as T
    } catch {
      return initialRef.current
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* Storage full or blocked. Nothing here is critical. */
    }
  }, [key, value])

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
    setValue(initialRef.current)
  }, [key])

  return [value, setValue, reset]
}