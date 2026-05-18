import { motion } from 'framer-motion'
import { FiGlobe, FiSearch } from 'react-icons/fi'
import { WELCOME_CITIES } from '../utils/constants'
import { getWelcomeScene } from '../utils/imageLibrary'

export default function WelcomeScreen({ onSearch }) {
  const welcomeScene = getWelcomeScene()

  return (
    <main className="welcome-screen glass">
      <img className="welcome-photo" src={welcomeScene.url} alt={welcomeScene.alt} loading="eager" />
      <div className="welcome-overlay" aria-hidden="true" />
      <motion.div
        className="welcome-mark"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      >
        <FiGlobe />
      </motion.div>
      <div className="welcome-copy">
        <span className="eyebrow">Real-time global weather</span>
        <h2>Search a city to open its live forecast, country profile, and trend chart.</h2>
        <p>
          WeatherSphere blends OpenWeatherMap, REST Countries, local search history, and optional
          Unsplash imagery into a focused dashboard built for quick decisions.
        </p>
      </div>
      <div className="quick-cities" aria-label="Quick city searches">
        {WELCOME_CITIES.map((city) => (
          <motion.button
            className="quick-city"
            type="button"
            key={city}
            onClick={() => onSearch(city)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiSearch />
            <span>{city}</span>
          </motion.button>
        ))}
      </div>
    </main>
  )
}
