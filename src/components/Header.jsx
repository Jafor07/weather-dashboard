import { AnimatePresence, motion } from 'framer-motion'
import { FiMoon, FiSun } from 'react-icons/fi'
import { HiArrowLeft } from 'react-icons/hi'
import { WiDayCloudy } from 'react-icons/wi'

const homeButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.375rem 1rem',
  color: '#2dd4bf',
  background: 'transparent',
  border: '1px solid #2dd4bf',
  borderRadius: '9999px',
  boxShadow: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1.25,
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'background-color 200ms ease, color 200ms ease',
}

export default function Header({ theme, toggleTheme, view, setView, setActiveCity }) {
  const ThemeIcon = theme === 'dark' ? FiSun : FiMoon
  const isDashboard = view === 'dashboard'

  const goHome = () => {
    setView('home')
    setActiveCity('')
  }

  const handleBrandKeyDown = (event) => {
    if (!isDashboard || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    goHome()
  }

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
        <motion.div
          className="brand"
          role={isDashboard ? 'button' : undefined}
          tabIndex={isDashboard ? 0 : undefined}
          onClick={isDashboard ? goHome : undefined}
          onKeyDown={handleBrandKeyDown}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ cursor: isDashboard ? 'pointer' : 'default' }}
        >
          <span className="brand-mark" aria-hidden="true">
            <WiDayCloudy />
          </span>
          <div className="brand-copy">
            <h1>WeatherSphere</h1>
          </div>
        </motion.div>

        <AnimatePresence>
          {isDashboard && (
            <motion.button
              key="home-button"
              type="button"
              onClick={goHome}
              style={homeButtonStyle}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              whileHover={{ backgroundColor: '#2dd4bf', color: '#111827' }}
              whileTap={{ scale: 0.97 }}
            >
              <HiArrowLeft aria-hidden="true" />
              <span>Home</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

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
