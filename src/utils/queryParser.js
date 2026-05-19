const COUNTRY_ALIASES = {
  AE: 'AE',
  UAE: 'AE',
  BANGLADESH: 'BD',
  BD: 'BD',
  FR: 'FR',
  FRANCE: 'FR',
  GB: 'GB',
  UK: 'GB',
  'UNITED KINGDOM': 'GB',
  IN: 'IN',
  INDIA: 'IN',
  JP: 'JP',
  JAPAN: 'JP',
  US: 'US',
  USA: 'US',
  'UNITED STATES': 'US',
}

function normalizeSpacing(value = '') {
  return value.trim().replace(/\s+/g, ' ')
}

function capitalizeCity(value = '') {
  return normalizeSpacing(value)
    .toLowerCase()
    .replace(/(^|[\s-])([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`)
}

export function normalizeCountryInput(country = '') {
  const normalized = normalizeSpacing(country)
    .replace(/\./g, '')
    .toUpperCase()

  if (!normalized) return ''
  if (COUNTRY_ALIASES[normalized]) return COUNTRY_ALIASES[normalized]
  if (/^[A-Z]{2}$/.test(normalized)) return normalized
  return ''
}

export function parseCityQuery(input = '') {
  const normalized = normalizeSpacing(input)
  const [rawCity = '', ...countryParts] = normalized.split(',')
  const city = capitalizeCity(rawCity)
  const countryCode = normalizeCountryInput(countryParts.join(','))
  const apiQuery = countryCode ? `${city},${countryCode}` : city
  const displayQuery = countryCode ? `${city}, ${countryCode}` : city

  return {
    city,
    countryCode,
    apiQuery,
    displayQuery,
  }
}
