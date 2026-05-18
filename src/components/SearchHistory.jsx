import { useEffect, useState } from 'react'
import { FiClock, FiSearch, FiTrash2 } from 'react-icons/fi'
import { clearSearchHistory, getSearchHistory } from '../services/storage'
import { formatDate } from '../utils/helpers'

export default function SearchHistory({ onSelect, refreshTrigger }) {
  const [history, setHistory] = useState(() => getSearchHistory())

  useEffect(() => {
    const id = window.setTimeout(() => setHistory(getSearchHistory()), 0)
    return () => window.clearTimeout(id)
  }, [refreshTrigger])

  const clearAll = () => {
    setHistory(clearSearchHistory())
  }

  return (
    <section className="history-card glass">
      <div className="history-header">
        <div className="section-heading compact">
          <span className="eyebrow">Saved Locations</span>
          <h3>Recent Searches</h3>
        </div>
        {history.length > 0 && (
          <button className="icon-btn" type="button" onClick={clearAll} aria-label="Clear search history">
            <FiTrash2 />
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="empty-copy">Your last 10 successful searches will stay here on this device.</p>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <button
              className="history-item"
              type="button"
              key={`${entry.city}-${entry.searchedAt}`}
              onClick={() => onSelect(entry.city)}
            >
              <FiSearch />
              <span>{entry.city}</span>
              <small>
                <FiClock />
                {formatDate(entry.searchedAt, { weekday: undefined })}
              </small>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
