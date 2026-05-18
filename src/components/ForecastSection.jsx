import { motion } from 'framer-motion'
import { FiDroplet, FiWind } from 'react-icons/fi'
import { aggregateDailyForecast, capitalizeWords, formatDate, formatTempUnit } from '../utils/helpers'
import { WeatherIcon } from '../utils/weatherIcons'

export default function ForecastSection({ data, unit = 'c' }) {
  const days = aggregateDailyForecast(data)

  if (!days.length) return null

  return (
    <section className="forecast-section glass">
      <div className="section-heading">
        <span className="eyebrow">Five-day forecast</span>
        <h3>Daily Forecast</h3>
      </div>
      <div className="forecast-grid">
        {days.map((day, index) => {
          return (
            <motion.article
              className="forecast-card"
              key={day.date}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <span className="forecast-day">{formatDate(`${day.date}T12:00:00`)}</span>
              <WeatherIcon conditionId={day.weather?.id} isDay className="forecast-icon" />
              <strong>{formatTempUnit(day.max, unit)}</strong>
              <span className="forecast-low">{formatTempUnit(day.min, unit)} low</span>
              <p>{capitalizeWords(day.weather?.description || 'Mixed conditions')}</p>
              <div className="forecast-meta">
                <span>
                  <FiDroplet />
                  {day.avgHumidity}%
                </span>
                <span>
                  <FiWind />
                  {day.maxWind.toFixed(1)} m/s
                </span>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
