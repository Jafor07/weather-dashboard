import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import WeatherDetails from './components/WeatherDetails'
import ForecastSection from './components/ForecastSection'
import TemperatureChart from './components/TemperatureChart'
import CountrySidebar from './components/CountrySidebar'
import WeatherAdvice from './components/WeatherAdvice'
import SearchHistory from './components/SearchHistory'
import Loader from './components/Loader'
import ErrorMessage from './components/ErrorMessage'
import WelcomeScreen from './components/WelcomeScreen'
import { useWeather } from './hooks/useWeather'
import { useTheme } from './hooks/useTheme'
import { conditionBgClass } from './utils/helpers'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const {
    weatherData,
    forecastData,
    countryData,
    cityPhoto,
    loading,
    error,
    fetchWeather,
  } = useWeather()

  const [historyTick, setHistoryTick] = useState(0)
  const [lastCity, setLastCity] = useState('')
  const [activeCity, setActiveCity] = useState('')
  const [view, setView] = useState('home')
  const [unit, setUnit] = useState('c')

  const handleSearch = async (city) => {
    setLastCity(city)
    const success = await fetchWeather(city)
    if (success) {
      setActiveCity(city)
      setView('dashboard')
      setHistoryTick((tick) => tick + 1)
    }
  }

  const hasData = Boolean(weatherData) && !loading
  const isDashboard = view === 'dashboard' && hasData
  const isDay = weatherData
    ? weatherData.dt > weatherData.sys.sunrise && weatherData.dt < weatherData.sys.sunset
    : true
  const bgClass = isDashboard ? conditionBgClass(weatherData?.weather?.[0]?.id, isDay) : 'weather-bg-clear'

  return (
    <div className="app-wrapper">
      <div className={`weather-bg ${bgClass}`} aria-hidden="true" />
      <div className="app-content">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          view={view}
          setView={setView}
          setActiveCity={setActiveCity}
        />
        <SearchBar key={view === 'home' ? 'home' : activeCity || 'dashboard'} onSearch={handleSearch} loading={loading} />

        <AnimatePresence mode="wait">
          {loading && <Loader key="loader" />}

          {!loading && error && (
            <ErrorMessage
              key="error"
              message={error}
              onRetry={() => lastCity && handleSearch(lastCity)}
              onSuggest={handleSearch}
            />
          )}

          {!loading && !error && (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isDashboard ? (
                <div className="dashboard-grid">
                  <main className="dashboard-main">
                    <WeatherCard data={weatherData} cityPhoto={cityPhoto} unit={unit} onUnitChange={setUnit} />
                    <WeatherDetails data={weatherData} forecastData={forecastData} unit={unit} />
                    <TemperatureChart data={forecastData} unit={unit} />
                    <ForecastSection data={forecastData} unit={unit} />
                  </main>
                  <aside className="sidebar">
                    <CountrySidebar data={countryData} weatherCountryCode={weatherData.sys.country} />
                    <WeatherAdvice data={weatherData} unit={unit} />
                    <SearchHistory onSelect={handleSearch} refreshTrigger={historyTick} />
                  </aside>
                </div>
              ) : (
                <div className="dashboard-grid">
                  <WelcomeScreen onSearch={handleSearch} />
                  <aside className="sidebar">
                    <SearchHistory onSelect={handleSearch} refreshTrigger={historyTick} />
                  </aside>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
