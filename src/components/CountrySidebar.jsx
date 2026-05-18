import { FiDollarSign, FiFlag, FiGlobe, FiMap, FiUsers } from 'react-icons/fi'
import { formatNumber } from '../utils/helpers'

function getCurrencies(currencies = {}) {
  return Object.entries(currencies).map(([code, currency]) => {
    const symbol = currency.symbol ? ` ${currency.symbol}` : ''
    return `${currency.name}${symbol} (${code})`
  })
}

function getLanguages(languages = {}) {
  return Object.values(languages)
}

export default function CountrySidebar({ data, weatherCountryCode }) {
  if (!data) {
    return (
      <section className="country-card glass">
        <div className="section-heading">
          <span className="eyebrow">Country profile</span>
          <h3>Global Context</h3>
        </div>
        <p className="empty-copy">Country intelligence appears after a successful city search.</p>
      </section>
    )
  }

  const currencies = getCurrencies(data.currencies)
  const languages = getLanguages(data.languages)

  return (
    <section className="country-card glass">
      <div className="country-flag-wrap">
        {data.flags?.svg && <img className="country-flag" src={data.flags.svg} alt={data.flags.alt || `${data.name.common} flag`} />}
      </div>
      <div className="section-heading">
        <span className="eyebrow">Country profile</span>
        <h3>{data.name.common}</h3>
      </div>

      <div className="country-facts">
        <div className="country-fact">
          <FiFlag />
          <span>ISO Code</span>
          <strong>{weatherCountryCode || data.cca2}</strong>
        </div>
        <div className="country-fact">
          <FiMap />
          <span>Capital</span>
          <strong>{data.capital?.[0] || 'N/A'}</strong>
        </div>
        <div className="country-fact">
          <FiUsers />
          <span>Population</span>
          <strong>{formatNumber(data.population)}</strong>
        </div>
        <div className="country-fact">
          <FiGlobe />
          <span>Region</span>
          <strong>{data.subregion || data.region || 'N/A'}</strong>
        </div>
      </div>

      <div className="info-block">
        <span className="info-block-title">
          <FiDollarSign />
          Currencies
        </span>
        <p>{currencies.length ? currencies.join(', ') : 'N/A'}</p>
      </div>
      <div className="info-block">
        <span className="info-block-title">
          <FiGlobe />
          Languages
        </span>
        <p>{languages.length ? languages.join(', ') : 'N/A'}</p>
      </div>
    </section>
  )
}
