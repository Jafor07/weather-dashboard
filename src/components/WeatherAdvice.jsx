import { FiDroplet, FiSun, FiThermometer } from 'react-icons/fi'
import { formatTime, formatTempUnit } from '../utils/helpers'

function getClothingTip(temp, humidity, conditionId) {
  if (conditionId >= 200 && conditionId < 300) return 'Storms are nearby. Stay indoors if possible and avoid exposed roads or open areas.'
  if (conditionId >= 300 && conditionId < 400) return 'Light rain is likely. Keep a compact umbrella and choose shoes with grip.'
  if (conditionId >= 500 && conditionId < 600) return 'Rain is expected. Carry an umbrella; roads and walkways may be slippery.'
  if (conditionId >= 600 && conditionId < 700) return 'Snowy conditions need warm layers, covered shoes, and slower travel.'
  if (conditionId >= 700 && conditionId < 800) return 'Visibility may be reduced. Drive carefully and allow extra travel time.'
  if (conditionId === 800 && temp >= 30) return 'Clear and hot. Stay hydrated, use sunscreen, and avoid long direct sun exposure.'
  if (conditionId === 800) return 'Clear skies today. Sunglasses help, but conditions are suitable for outdoor plans.'
  if (conditionId > 800 && humidity >= 70) return 'Cloud cover is trapping moisture. Wear breathable clothes and keep water nearby.'
  if (conditionId > 800) return 'Cloudy conditions should stay manageable. A light layer is enough if the breeze picks up.'
  if (temp >= 30 && humidity >= 70) return 'Expect hot, humid conditions. Wear breathable clothes and hydrate often.'
  if (temp >= 32) return 'Wear light breathable clothes and avoid long direct sun exposure.'
  if (temp >= 26 && humidity >= 70) return 'Carry light clothes. Humidity is high, so stay hydrated.'
  if (temp <= 16) return 'Add a warm layer before heading out.'
  return 'Comfortable outdoor conditions. A light layer should be enough.'
}

function getComfortScore(temp, humidity, windSpeed) {
  const heatPenalty = Math.min(Math.abs(temp - 26) * 2.2, 34)
  const humidityPenalty = Math.max(humidity - 55, 0) * 0.45
  const humidHeatPenalty = humidity > 70 ? 15 : humidity > 60 ? 8 : 0
  const windPenalty = Math.max(windSpeed - 5, 0) * 2
  return Math.max(35, Math.min(98, Math.round(96 - heatPenalty - humidityPenalty - humidHeatPenalty - windPenalty)))
}

function getComfortProfile(temp, humidity, windSpeed) {
  const score = getComfortScore(temp, humidity, windSpeed)

  if (temp >= 32 || humidity >= 82) {
    return { label: 'High Humidity', score: Math.min(score, 64), tone: 'warning' }
  }
  if (temp >= 30 && humidity >= 70) {
    return { label: 'Hot', score: Math.min(score, 62), tone: 'hot' }
  }
  if (temp >= 28 || humidity >= 70) {
    return { label: 'Warm', score: Math.min(score, 72), tone: 'warm' }
  }
  if (windSpeed >= 9) {
    return { label: 'Breezy', score: Math.min(score, 72), tone: 'cool' }
  }
  if (temp >= 20 && temp <= 27 && humidity <= 60) {
    return { label: 'Comfortable', score: Math.max(score, 80), tone: 'good' }
  }

  return { label: 'Moderate', score: Math.min(Math.max(score, 58), 76), tone: 'moderate' }
}

function formatComfortScoreUnits(score) {
  const celsiusEquivalent = Math.floor(((score - 32) * 5) / 9)
  return `${score}\u00b0F / ${celsiusEquivalent}\u00b0C`
}

export default function WeatherAdvice({ data, unit = 'c' }) {
  if (!data) return null

  const conditionId = data.weather?.[0]?.id
  const temp = Math.round(data.main.temp)
  const humidity = data.main.humidity
  const windSpeed = data.wind.speed
  const timezone = data.timezone || 0
  const advice = getClothingTip(temp, humidity, conditionId)
  const comfort = getComfortProfile(temp, humidity, windSpeed)
  const comfortUnits = formatComfortScoreUnits(comfort.score)
  const comfortExplanation = 'Comfort Index combines temperature, humidity, and wind into an outdoor comfort score. Higher means easier to stay outside.'

  return (
    <section className="advice-card glass">
      <div className="advice-heading">
        <div className="section-heading compact">
          <span className="eyebrow">Today&apos;s advice</span>
          <h3>{comfort.label}</h3>
        </div>
        <span
          className={`comfort-badge comfort-badge-${comfort.tone}`}
          aria-label={`Comfort Index ${comfort.score} out of 100. ${comfortExplanation}`}
          title={comfortExplanation}
        >
          <small>Comfort Index</small>
          <strong>{comfort.score}</strong>
          <span className="comfort-units">{comfortUnits}</span>
        </span>
      </div>

      <p className="advice-copy">{advice}</p>

      <div className="advice-list">
        <div className="advice-item advice-item-accent">
          <FiThermometer />
          <span>Feels like</span>
          <strong>{formatTempUnit(data.main.feels_like, unit)}</strong>
        </div>
        <div className="advice-item">
          <FiDroplet />
          <span>Humidity</span>
          <strong>{humidity}%</strong>
        </div>
        <div className="sun-mini">
          <span>
            <FiSun />
            Sunrise {formatTime(data.sys.sunrise, timezone)}
          </span>
          <span>Sunset {formatTime(data.sys.sunset, timezone)}</span>
        </div>
      </div>
    </section>
  )
}
