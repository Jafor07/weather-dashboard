import axios from 'axios'

const restCountries = axios.create({
  baseURL: 'https://restcountries.com/v3.1',
  timeout: 12000,
})

export async function fetchCountryByCode(countryCode) {
  if (!countryCode) return null

  const displayNames = typeof Intl !== 'undefined' && Intl.DisplayNames
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null
  const countryName = displayNames?.of(countryCode.toUpperCase()) || countryCode

  const response = await restCountries.get(`/name/${encodeURIComponent(countryName)}`, {
    params: {
      fields: 'name,flags,capital,population,currencies,languages,region,subregion,cca2',
    },
  })

  const countries = Array.isArray(response.data) ? response.data : []
  return countries.find((country) => country.cca2 === countryCode.toUpperCase()) || countries[0] || null
}
