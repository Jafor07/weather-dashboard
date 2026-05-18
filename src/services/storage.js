import { STORAGE_KEYS } from '../utils/constants'

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return false
  }

  return true
}

export function getSearchHistory() {
  return readStorage(STORAGE_KEYS.history, [])
}

export function saveSearchCity(city, countryCode) {
  if (!city) return []
  const normalized = city.trim()
  const nextEntry = {
    city: normalized,
    countryCode: countryCode || '',
    searchedAt: new Date().toISOString(),
  }

  const nextHistory = [
    nextEntry,
    ...getSearchHistory().filter((entry) => entry.city.toLowerCase() !== normalized.toLowerCase()),
  ].slice(0, 10)

  writeStorage(STORAGE_KEYS.history, nextHistory)
  return nextHistory
}

export function clearSearchHistory() {
  writeStorage(STORAGE_KEYS.history, [])
  return []
}
