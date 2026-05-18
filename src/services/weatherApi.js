import axios from 'axios'

const openWeather = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 12000,
})

function getWeatherKey() {
  return import.meta.env.VITE_OWM_KEY
}

export function hasWeatherKey() {
  return Boolean(getWeatherKey())
}

export async function fetchCurrentWeather(city) {
  const response = await openWeather.get('/weather', {
    params: {
      q: city,
      appid: getWeatherKey(),
      units: 'metric',
    },
  })

  return response.data
}

export async function fetchForecast(city) {
  const response = await openWeather.get('/forecast', {
    params: {
      q: city,
      appid: getWeatherKey(),
      units: 'metric',
      cnt: 40,
    },
  })

  return response.data
}
