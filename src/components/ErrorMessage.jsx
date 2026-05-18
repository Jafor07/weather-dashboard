import { motion } from 'framer-motion'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

const CITY_SUGGESTIONS = ['Dhaka', 'London', 'Tokyo', 'Dubai']

export default function ErrorMessage({ message, onRetry, onSuggest }) {
  const isCityNotFound = message?.includes('No weather station matched this city')

  return (
    <motion.div
      className="error-container glass"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
    >
      <div className="error-icon">
        <FiAlertTriangle />
      </div>
      <div className="error-title">{isCityNotFound ? 'City Not Found' : 'Something went wrong'}</div>
      <p className="error-msg">{message}</p>
      {isCityNotFound && onSuggest && (
        <div className="error-suggestions" aria-label="Suggested cities">
          <span>Suggestions:</span>
          {CITY_SUGGESTIONS.map((city) => (
            <button type="button" key={city} onClick={() => onSuggest(city)}>
              {city}
            </button>
          ))}
        </div>
      )}
      {onRetry && (
        <motion.button className="retry-btn" type="button" onClick={onRetry} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <FiRefreshCw />
          Try again
        </motion.button>
      )}
    </motion.div>
  )
}
