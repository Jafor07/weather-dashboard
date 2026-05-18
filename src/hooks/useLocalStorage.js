import { useCallback, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    setStoredValue((current) => {
      const nextValue = typeof value === 'function' ? value(current) : value
      try {
        localStorage.setItem(key, JSON.stringify(nextValue))
      } catch {
        return nextValue
      }
      return nextValue
    })
  }, [key])

  return [storedValue, setValue]
}
