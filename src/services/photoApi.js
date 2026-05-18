import axios from 'axios'

const IMAGE_PARAMS = 'auto=format&fit=crop&w=1800&q=88'
const APP_SOURCE = 'WeatherSphere'

const unsplash = axios.create({
  baseURL: 'https://api.unsplash.com',
  timeout: 12000,
})

const photoCache = new Map()

const CITY_HINTS = [
  'architecture',
  'bridge',
  'building',
  'city',
  'downtown',
  'landmark',
  'old town',
  'skyline',
  'square',
  'street',
  'tower',
  'urban',
]

const LANDSCAPE_NOISE = [
  'alpine',
  'beach',
  'canyon',
  'desert',
  'forest',
  'lake',
  'landscape',
  'mountain',
  'nature',
  'ocean',
  'road',
  'rocks',
  'sea',
  'trail',
  'valley',
  'waterfall',
  'wild',
]

function getUnsplashKey() {
  return import.meta.env.VITE_UNSPLASH_KEY?.trim()
}

export function hasUnsplashKey() {
  return Boolean(getUnsplashKey())
}

function getCountryName(countryCode) {
  if (!countryCode) return ''

  const displayNames = typeof Intl !== 'undefined' && Intl.DisplayNames
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null

  return displayNames?.of(countryCode.toUpperCase()) || countryCode
}

function normalizeText(value = '') {
  return value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getCityTokens(city) {
  return normalizeText(city)
    .split(/[\s-]+/)
    .filter((token) => token.length > 2 && token !== 'new' && token !== 'city')
}

function buildQueries(city, countryName) {
  const cityLabel = [city, countryName].filter(Boolean).join(' ')

  return [
    `${cityLabel} city landmark skyline`,
    `${cityLabel} downtown architecture`,
    `${cityLabel} street`,
  ]
}

function getPhotoText(photo) {
  const tagTitles = Array.isArray(photo.tags) ? photo.tags.map((tag) => tag.title) : []

  return normalizeText([
    photo.description,
    photo.alt_description,
    photo.location?.title,
    photo.location?.name,
    ...tagTitles,
  ].filter(Boolean).join(' '))
}

function scorePhoto(photo, city, countryName) {
  const text = getPhotoText(photo)
  const normalizedCity = normalizeText(city)
  const normalizedCountry = normalizeText(countryName)
  const cityTokens = getCityTokens(city)
  let score = 0

  if (normalizedCity && text.includes(normalizedCity)) score += 32
  if (normalizedCountry && text.includes(normalizedCountry)) score += 12

  cityTokens.forEach((token) => {
    if (text.includes(token)) score += 8
  })

  CITY_HINTS.forEach((hint) => {
    if (text.includes(hint)) score += 5
  })

  LANDSCAPE_NOISE.forEach((term) => {
    if (text.includes(term)) score -= normalizedCity && text.includes(normalizedCity) ? 2 : 8
  })

  if (photo.width > photo.height) score += 5
  if (photo.likes) score += Math.min(Number(photo.likes) / 100, 8)

  return score
}

function appendImageParams(url) {
  if (!url) return ''
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${IMAGE_PARAMS}`
}

function appendReferral(url) {
  if (!url) return 'https://unsplash.com/?utm_source=WeatherSphere&utm_medium=referral'
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}utm_source=${APP_SOURCE}&utm_medium=referral`
}

function formatPhoto(photo, city, countryName) {
  return {
    id: photo.id,
    url: appendImageParams(photo.urls?.raw) || photo.urls?.regular || photo.urls?.full,
    alt: photo.alt_description || `${city}${countryName ? `, ${countryName}` : ''} city view`,
    author: photo.user?.name || 'Unsplash creator',
    authorUrl: appendReferral(photo.user?.links?.html),
    source: 'unsplash',
  }
}

function pickBestPhoto(photos, city, countryName) {
  return photos
    .filter((photo) => photo.urls?.raw || photo.urls?.regular || photo.urls?.full)
    .map((photo) => ({
      photo,
      score: scorePhoto(photo, city, countryName),
    }))
    .sort((first, second) => second.score - first.score)[0]?.photo || null
}

async function searchPhotos(query) {
  const response = await unsplash.get('/search/photos', {
    params: {
      query,
      orientation: 'landscape',
      content_filter: 'high',
      order_by: 'relevant',
      per_page: 12,
      client_id: getUnsplashKey(),
    },
  })

  return Array.isArray(response.data?.results) ? response.data.results : []
}

export async function fetchCityPhoto(city, countryCode) {
  const normalizedCity = normalizeText(city)
  if (!hasUnsplashKey() || !normalizedCity) return null

  const countryName = getCountryName(countryCode)
  const cacheKey = `${normalizedCity}:${normalizeText(countryName)}`
  if (photoCache.has(cacheKey)) return photoCache.get(cacheKey)

  try {
    for (const query of buildQueries(city, countryName)) {
      const photos = await searchPhotos(query)
      const bestPhoto = pickBestPhoto(photos, city, countryName)

      if (bestPhoto) {
        const formattedPhoto = formatPhoto(bestPhoto, city, countryName)
        photoCache.set(cacheKey, formattedPhoto)
        return formattedPhoto
      }
    }
  } catch {
    photoCache.set(cacheKey, null)
    return null
  }

  photoCache.set(cacheKey, null)
  return null
}
