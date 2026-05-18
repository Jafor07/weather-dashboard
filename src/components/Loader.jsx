import { motion } from 'framer-motion'

export default function Loader({ message = 'Fetching weather data...' }) {
  return (
    <motion.div className="loader-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="loader-skeleton" aria-hidden="true">
        <div className="skeleton-card skeleton-hero" />
        <div className="skeleton-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="skeleton-card skeleton-mini" key={index} />
          ))}
        </div>
        <div className="skeleton-row">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="skeleton-card skeleton-forecast" key={index} />
          ))}
        </div>
      </div>
      <p className="loader-text" role="status" aria-live="polite">{message}</p>
    </motion.div>
  )
}
