import { motion } from 'framer-motion'
import { FiMoon, FiSun } from 'react-icons/fi'
import { WiDayCloudy } from 'react-icons/wi'

export default function Header({ theme, toggleTheme }) {
  const ThemeIcon = theme === 'dark' ? FiSun : FiMoon

  return (
    <header className="app-header">
      <motion.div
        className="brand"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <span className="brand-mark" aria-hidden="true">
          <WiDayCloudy />
        </span>
        <div className="brand-copy">
          <h1>WeatherSphere</h1>
        </div>
      </motion.div>

      <motion.button
        className="theme-toggle"
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <ThemeIcon />
      </motion.button>
    </header>
  )
}
