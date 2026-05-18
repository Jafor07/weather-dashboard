import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { FiMapPin, FiSearch, FiX } from 'react-icons/fi'
import { POPULAR_CITIES } from '../utils/constants'

function formatCityQuery(value) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/(^|[\s-])([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`)
}

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const suggestions = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return POPULAR_CITIES.slice(0, 5)
    return POPULAR_CITIES
      .filter((item) => `${item.city} ${item.country}`.toLowerCase().includes(needle))
      .slice(0, 6)
  }, [query])

  const submitSearch = (event) => {
    event.preventDefault()
    const city = formatCityQuery(query)
    if (city) {
      setQuery(city)
      setFocused(false)
      onSearch(city)
    }
  }

  const selectSuggestion = (city) => {
    setQuery(city)
    setFocused(false)
    onSearch(city)
  }

  return (
    <section className="search-shell" aria-label="City weather search">
      <form className="search-form glass" onSubmit={submitSearch}>
        <FiSearch className="search-leading-icon" aria-hidden="true" />
        <input
          className="search-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search any city..."
          aria-label="Search city"
          aria-expanded={focused && suggestions.length > 0}
          autoComplete="off"
        />
        {query && (
          <button className="clear-query-btn" type="button" onClick={() => setQuery('')} aria-label="Clear search">
            <FiX />
          </button>
        )}
        <motion.button
          className="search-submit"
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
        >
          <FiSearch />
          <span>{loading ? 'Searching' : 'Search'}</span>
        </motion.button>
      </form>

      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            className="suggestions glass"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {suggestions.map((item) => (
              <button
                className="suggestion-item"
                type="button"
                key={`${item.city}-${item.country}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(item.city)}
              >
                <FiMapPin />
                <span>{item.city}</span>
                <small>{item.country}</small>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
