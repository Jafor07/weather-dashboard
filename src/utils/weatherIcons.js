import { createElement } from 'react'
import {
  WiCloudy,
  WiDayCloudy,
  WiDaySunny,
  WiDust,
  WiFog,
  WiNightAltCloudy,
  WiNightClear,
  WiRain,
  WiSnow,
  WiSprinkle,
  WiThunderstorm,
} from 'react-icons/wi'

export function getWeatherIconComponent(conditionId, isDay = true) {
  if (!conditionId) return isDay ? WiDaySunny : WiNightClear
  if (conditionId >= 200 && conditionId < 300) return WiThunderstorm
  if (conditionId >= 300 && conditionId < 500) return WiSprinkle
  if (conditionId >= 500 && conditionId < 600) return WiRain
  if (conditionId >= 600 && conditionId < 700) return WiSnow
  if (conditionId >= 700 && conditionId < 800) return conditionId === 731 || conditionId === 761 ? WiDust : WiFog
  if (conditionId === 800) return isDay ? WiDaySunny : WiNightClear
  if (conditionId === 801) return isDay ? WiDayCloudy : WiNightAltCloudy
  return WiCloudy
}

export function WeatherIcon({ conditionId, isDay = true, className }) {
  const Icon = getWeatherIconComponent(conditionId, isDay)
  return createElement(Icon, { className, 'aria-hidden': 'true' })
}
