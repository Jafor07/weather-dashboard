import { FiCloud, FiDroplet, FiEye, FiNavigation, FiThermometer, FiWind } from 'react-icons/fi'
import { WiBarometer, WiHumidity } from 'react-icons/wi'
import {
  calculateDewPoint,
  formatTempUnit,
  getTodayForecastRange,
  metersToKm,
  windDirection,
} from '../utils/helpers'
import StatCard from './StatCard'

function WindDirectionDetail({ degrees }) {
  return (
    <span className="wind-compass">
      <FiNavigation style={{ transform: `rotate(${degrees ?? 0}deg)` }} />
      {windDirection(degrees)}
    </span>
  )
}

export default function WeatherDetails({ data, forecastData, unit = 'c' }) {
  if (!data) return null

  const todayRange = getTodayForecastRange(forecastData)

  const stats = [
    {
      label: 'Humidity',
      value: `${data.main.humidity}%`,
      detail: 'Air moisture',
      icon: WiHumidity,
    },
    {
      label: 'Wind',
      value: `${data.wind.speed.toFixed(1)} m/s`,
      detail: <WindDirectionDetail degrees={data.wind.deg} />,
      icon: FiWind,
    },
    {
      label: 'Pressure',
      value: `${data.main.pressure} hPa`,
      detail: 'Sea-level adjusted',
      icon: WiBarometer,
    },
    {
      label: 'Visibility',
      value: metersToKm(data.visibility),
      detail: 'Horizontal range',
      icon: FiEye,
    },
    {
      label: 'Clouds',
      value: `${data.clouds?.all ?? 0}%`,
      detail: 'Sky coverage',
      icon: FiCloud,
    },
    {
      label: 'Dew point',
      value: formatTempUnit(calculateDewPoint(data.main.temp, data.main.humidity), unit),
      detail: 'Comfort signal',
      icon: FiDroplet,
    },
    {
      label: 'Gust',
      value: data.wind.gust ? `${data.wind.gust.toFixed(1)} m/s` : 'Calm',
      detail: 'Peak wind speed',
      icon: FiNavigation,
    },
    {
      label: 'Range',
      value: todayRange ? `${formatTempUnit(todayRange.low, unit)} / ${formatTempUnit(todayRange.high, unit)}` : 'N/A',
      detail: 'Forecast low and high',
      icon: FiThermometer,
    },
  ]

  return (
    <section className="details-section glass">
      <div className="section-heading">
        <span className="eyebrow">Atmospheric detail</span>
        <h3>8-Stat Weather Grid</h3>
      </div>
      <div className="details-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  )
}
