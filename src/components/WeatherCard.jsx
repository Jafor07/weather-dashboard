import { motion } from 'framer-motion'
import { FiClock, FiMapPin, FiSunrise, FiSunset } from 'react-icons/fi'
import { capitalizeWords, convertTemp, formatTemp, formatTempUnit, formatTime, tempUnitLabel } from '../utils/helpers'
import { getWeatherScene } from '../utils/imageLibrary'
import { WeatherIcon } from '../utils/weatherIcons'

function getTemperatureBadge(temp) {
  if (temp < 0) return { label: 'Freezing', tone: 'freezing' }
  if (temp <= 10) return { label: 'Cold', tone: 'cold' }
  if (temp <= 20) return { label: 'Cool', tone: 'cool' }
  if (temp <= 28) return { label: 'Warm', tone: 'warm' }
  if (temp <= 35) return { label: 'Hot', tone: 'hot' }
  return { label: 'Scorching', tone: 'scorching' }
}

function getFeelsDifference(data, unit) {
  const actual = convertTemp(data.main.temp, unit)
  const feels = convertTemp(data.main.feels_like, unit)
  if (actual === null || feels === null) return ''

  const diff = Math.round(feels - actual)
  if (diff > 0) return `${Math.abs(diff)}\u00b0 hotter than actual`
  if (diff < 0) return `${Math.abs(diff)}\u00b0 cooler than actual`
  return 'Feels like actual'
}

export default function WeatherCard({ data, cityPhoto = null, unit = 'c', onUnitChange }) {
  if (!data) return null

  const condition = data.weather?.[0]
  const isDay = data.dt > data.sys.sunrise && data.dt < data.sys.sunset
  const timezone = data.timezone || 0
  const heroPhoto = cityPhoto || getWeatherScene(condition?.id, isDay, data.name)
  const temperatureComfort = getTemperatureBadge(data.main.temp)
  const feelsDifference = getFeelsDifference(data, unit)

  return (
    <motion.section
      className="weather-card hero-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {heroPhoto?.url && (
        <img className="city-photo" src={heroPhoto.url} alt={heroPhoto.alt} loading="eager" />
      )}
      <div className="hero-card-overlay" aria-hidden="true" />

      <div className="weather-card-content">
        <div className="weather-card-top">
          <div>
            <span className="eyebrow">Current conditions</span>
            <h2>{data.name}</h2>
            <p className="location-line">
              <FiMapPin />
              <span>{data.sys.country}</span>
            </p>
          </div>
          <span className="condition-pill">{capitalizeWords(condition?.description || 'Clear')}</span>
        </div>

        <div className="weather-reading">
          <WeatherIcon conditionId={condition?.id} isDay={isDay} className="weather-icon-large" />
          <div className="temperature-stack">
            <div className="temperature-main">
              <span className="temperature-value">{formatTemp(data.main.temp, unit)}</span>
              <span className="temperature-unit">{tempUnitLabel(unit)}</span>
              <span className={`feels-badge temp-comfort-badge feels-badge-${temperatureComfort.tone}`}>
                {temperatureComfort.label}
              </span>
            </div>
            <span className="feels-like">
              Feels like {formatTempUnit(data.main.feels_like, unit)}
              {feelsDifference && <span className="feels-diff-badge">{feelsDifference}</span>}
            </span>
            {onUnitChange && (
              <div className="unit-toggle" aria-label="Temperature unit">
                <button
                  className={unit === 'c' ? 'active' : ''}
                  type="button"
                  onClick={() => onUnitChange('c')}
                  aria-pressed={unit === 'c'}
                >
                  {tempUnitLabel('c')}
                </button>
                <button
                  className={unit === 'f' ? 'active' : ''}
                  type="button"
                  onClick={() => onUnitChange('f')}
                  aria-pressed={unit === 'f'}
                >
                  {tempUnitLabel('f')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="sun-row">
          <span>
            <FiSunrise />
            Sunrise {formatTime(data.sys.sunrise, timezone)}
          </span>
          <span>
            <FiSunset />
            Sunset {formatTime(data.sys.sunset, timezone)}
          </span>
          <span>
            <FiClock />
            Local {formatTime(data.dt, timezone)}
          </span>
        </div>

      </div>
    </motion.section>
  )
}
