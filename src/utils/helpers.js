export function convertTemp(value, unit = 'c') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null
  const celsius = Number(value)
  return unit === 'f' ? (celsius * 9) / 5 + 32 : celsius
}

export function tempUnitLabel(unit = 'c') {
  return unit === 'f' ? '\u00b0F' : '\u00b0C'
}

export function formatTemp(value, unit = 'c') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  return Math.round(convertTemp(value, unit))
}

export function formatTempUnit(value, unit = 'c') {
  const temp = formatTemp(value, unit)
  return temp === '--' ? temp : `${temp}${tempUnitLabel(unit)}`
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  return new Intl.NumberFormat('en-US', { notation: Number(value) > 999999 ? 'compact' : 'standard' }).format(value)
}

export function formatDate(value, options = {}) {
  if (!value) return '--'
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(value))
}

function formatAsciiHour(unixSeconds, timezoneOffset = 0, includeMinutes = false) {
  const localTime = new Date((unixSeconds + timezoneOffset) * 1000)
  const hour24 = localTime.getUTCHours()
  const hour12 = hour24 % 12 || 12
  const period = hour24 < 12 ? 'AM' : 'PM'

  if (!includeMinutes) return `${hour12} ${period}`

  const minutes = String(localTime.getUTCMinutes()).padStart(2, '0')
  return `${hour12}:${minutes} ${period}`
}

export function formatTime(unixSeconds, timezoneOffset = 0) {
  if (!unixSeconds) return '--'
  return formatAsciiHour(unixSeconds, timezoneOffset, true)
}

export function capitalizeWords(text = '') {
  return text
    .split(' ')
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

export function metersToKm(value) {
  if (!value && value !== 0) return '--'
  return `${(Number(value) / 1000).toFixed(1)} km`
}

export function windDirection(degrees) {
  if (degrees === null || degrees === undefined) return '--'
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(Number(degrees) / 45) % 8]
}

export function calculateDewPoint(temp, humidity) {
  if (temp === null || temp === undefined || humidity === null || humidity === undefined) return '--'
  const a = 17.27
  const b = 237.7
  const alpha = ((a * Number(temp)) / (b + Number(temp))) + Math.log(Number(humidity) / 100)
  return Math.round((b * alpha) / (a - alpha))
}

export function conditionBgClass(conditionId, isDay = true) {
  if (!conditionId) return isDay ? 'weather-bg-clear' : 'weather-bg-night'
  if (!isDay) return 'weather-bg-night'
  if (conditionId >= 200 && conditionId < 300) return 'weather-bg-storm'
  if (conditionId >= 300 && conditionId < 600) return 'weather-bg-rain'
  if (conditionId >= 600 && conditionId < 700) return 'weather-bg-snow'
  if (conditionId >= 700 && conditionId < 800) return 'weather-bg-fog'
  if (conditionId === 800) return 'weather-bg-clear'
  return 'weather-bg-clouds'
}

function getLocalDateKey(unixSeconds, timezoneOffset = 0) {
  return new Date((unixSeconds + timezoneOffset) * 1000).toISOString().slice(0, 10)
}

const MAX_ROW_TEMP_SPREAD = 12

function getBrowserDateKey(unixSeconds) {
  return new Date(unixSeconds * 1000).toDateString()
}

function getBoundedForecastTemp(item, key) {
  const temp = Number(item?.main?.temp)
  const bound = Number(item?.main?.[key])

  if (Number.isNaN(bound)) return Number.isNaN(temp) ? null : temp
  if (!Number.isNaN(temp) && Math.abs(bound - temp) > MAX_ROW_TEMP_SPREAD) return temp
  return bound
}

function getForecastRange(items = []) {
  const lows = items
    .map((item) => getBoundedForecastTemp(item, 'temp_min'))
    .filter((temp) => temp !== null)
  const highs = items
    .map((item) => getBoundedForecastTemp(item, 'temp_max'))
    .filter((temp) => temp !== null)

  if (!lows.length || !highs.length) return null

  const low = Math.min(...lows)
  const high = Math.max(...highs)

  return {
    low: Math.min(low, high),
    high: Math.max(low, high),
  }
}

export function aggregateDailyForecast(forecastData) {
  const list = forecastData?.list || []
  const timezoneOffset = forecastData?.city?.timezone || 0
  const grouped = list.reduce((days, item) => {
    const key = item.dt ? getLocalDateKey(item.dt, timezoneOffset) : item.dt_txt?.slice(0, 10)
    if (!days[key]) days[key] = []
    days[key].push(item)
    return days
  }, {})

  return Object.entries(grouped)
    .slice(0, 5)
    .map(([date, items]) => {
      const range = getForecastRange(items)
      const humidities = items.map((item) => item.main.humidity)
      const winds = items.map((item) => item.wind.speed)
      const featured = items.find((item) => item.dt_txt?.includes('12:00:00')) || items[Math.floor(items.length / 2)] || items[0]

      return {
        date,
        min: range?.low,
        max: range?.high,
        avgHumidity: Math.round(humidities.reduce((sum, value) => sum + value, 0) / humidities.length),
        maxWind: Math.max(...winds),
        weather: featured.weather?.[0],
      }
    })
}

export function getTodayForecastRange(forecastData) {
  const list = forecastData?.list || []
  if (!list.length) return null

  const todayKey = new Date().toDateString()
  const todayItems = list.filter((item) => getBrowserDateKey(item.dt) === todayKey)

  if (todayItems.length) return getForecastRange(todayItems)

  const firstForecastKey = getBrowserDateKey(list[0].dt)
  const firstForecastDay = list.filter((item) => getBrowserDateKey(item.dt) === firstForecastKey)

  return getForecastRange(firstForecastDay)
}

export function getHourlyForecast(forecastData, count = 8) {
  const timezoneOffset = forecastData?.city?.timezone || 0

  return (forecastData?.list || []).slice(0, count).map((item) => ({
    time: item.dt_txt,
    temp: item.main.temp,
    label: formatAsciiHour(item.dt, timezoneOffset),
  }))
}

export function buildChartPath(points, width, height, padding) {
  if (points.length < 2) return ''
  const temps = points.map((point) => point.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const span = max - min || 1
  const step = (width - padding * 2) / (points.length - 1)

  return points
    .map((point, index) => {
      const x = padding + index * step
      const y = height - padding - ((point.temp - min) / span) * (height - padding * 2)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

export function buildChartPoints(points, width, height, padding) {
  if (!points.length) return []
  const temps = points.map((point) => point.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const span = max - min || 1
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0

  return points.map((point, index) => ({
    ...point,
    x: padding + index * step,
    y: height - padding - ((point.temp - min) / span) * (height - padding * 2),
  }))
}
