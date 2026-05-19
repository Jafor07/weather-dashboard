import { useCallback, useState } from 'react'
import { fetchCountryByCode } from '../services/countryApi'
import {
  fetchCurrentWeather,
  fetchForecast,
  hasWeatherKey,
} from '../services/weatherApi'
import { fetchCityPhoto } from '../services/photoApi'
import { saveSearchCity } from '../services/storage'
import { parseCityQuery } from '../utils/queryParser'

function getFriendlyError(error) {
  if (!navigator.onLine) {
    return 'You appear to be offline. Check your internet connection and try again.'
  }

  const status = error?.response?.status
  if (status === 401) {
    return 'OpenWeatherMap rejected the API key. Add a valid VITE_OWM_KEY to your .env file.'
  }
  if (status === 404) {
    return 'No weather station matched this city. Check the spelling or try another location.'
  }
  if (status === 429) {
    return 'The weather API rate limit was reached. Please wait a moment and try again.'
  }

  return 'WeatherSphere could not load fresh data right now. Please try again.'
}

export function useWeather() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [countryData, setCountryData] = useState(null)
  const [cityPhoto, setCityPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = useCallback(async (city) => {
    const parsedQuery = parseCityQuery(city)
    if (!parsedQuery.city) {
      setError('Enter a city name to explore its weather.')
      return false
    }

    if (!hasWeatherKey()) {
      setError('Add VITE_OWM_KEY to your .env file to search live weather data.')
      return false
    }

    setLoading(true)
    setError('')
    setCityPhoto(null)

    try {
      const [current, forecast] = await Promise.all([
        fetchCurrentWeather(parsedQuery.apiQuery),
        fetchForecast(parsedQuery.apiQuery),
      ])

      const [country, photo] = await Promise.all([
        fetchCountryByCode(current.sys?.country),
        fetchCityPhoto(current.name || parsedQuery.city, current.sys?.country),
      ])

      setWeatherData(current)
      setForecastData(forecast)
      setCountryData(country)
      setCityPhoto(photo)
      saveSearchCity(current.name || parsedQuery.city, current.sys?.country)
      return true
    } catch (requestError) {
      setError(getFriendlyError(requestError))
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    weatherData,
    forecastData,
    countryData,
    cityPhoto,
    loading,
    error,
    fetchWeather,
  }
}
