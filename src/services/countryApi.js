import axios from 'axios'

const restCountries = axios.create({
  baseURL: 'https://restcountries.com/v3.1',
  timeout: 12000,
})

function buildCountryFallback(countryCode) {
  const safeCode = String(countryCode || '').trim().toUpperCase()
  const displayNames = typeof Intl !== 'undefined' && Intl.DisplayNames
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null
  const countryName = displayNames?.of(safeCode) || safeCode || 'Country'

  return {
    cca2: safeCode,
    name: { common: countryName },
    flags: { svg: '', alt: `${countryName} flag` },
    capital: ['N/A'],
    population: 0,
    currencies: {},
    languages: {},
    region: 'N/A',
    subregion: 'N/A',
  }
}

export async function fetchCountryByCode(countryCode) {
  if (!countryCode) return null

  const safeCode = String(countryCode).trim().toUpperCase()
  const displayNames = typeof Intl !== 'undefined' && Intl.DisplayNames
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null
  const countryName = displayNames?.of(safeCode) || safeCode

  try {
    const response = await restCountries.get(`/name/${encodeURIComponent(countryName)}`, {
      params: {
        fields: 'name,flags,capital,population,currencies,languages,region,subregion,cca2',
      },
    })

    const countries = Array.isArray(response.data) ? response.data : []
    return countries.find((country) => country.cca2 === safeCode) || countries[0] || buildCountryFallback(safeCode)
  } catch {
    return buildCountryFallback(safeCode)
  }
}
