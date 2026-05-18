import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import {
  buildChartPath,
  buildChartPoints,
  formatTempUnit,
  getHourlyForecast,
} from '../utils/helpers'

const CHART_WIDTH = 720
const CHART_HEIGHT = 250
const CHART_PADDING = 34
const TOOLTIP_WIDTH = 122
const TOOLTIP_HEIGHT = 52

export default function TemperatureChart({ data, unit = 'c' }) {
  const [activePoint, setActivePoint] = useState(null)
  const hourly = useMemo(() => getHourlyForecast(data), [data])
  const path = useMemo(
    () => buildChartPath(hourly, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING),
    [hourly],
  )
  const points = useMemo(
    () => buildChartPoints(hourly, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING),
    [hourly],
  )
  const areaPath = useMemo(() => {
    if (!path || !points.length) return ''
    const first = points[0]
    const last = points[points.length - 1]
    const baseline = CHART_HEIGHT - CHART_PADDING
    return `${path} L ${last.x.toFixed(2)} ${baseline} L ${first.x.toFixed(2)} ${baseline} Z`
  }, [path, points])
  const insight = useMemo(() => {
    if (!hourly.length) return ''
    const warmest = hourly.reduce((max, item) => (item.temp > max.temp ? item : max), hourly[0])
    const coolest = hourly.reduce((min, item) => (item.temp < min.temp ? item : min), hourly[0])
    return `Peak temperature: ${formatTempUnit(warmest.temp, unit)} at ${warmest.label}. Lowest: ${formatTempUnit(coolest.temp, unit)} at ${coolest.label}.`
  }, [hourly, unit])

  const tooltip = activePoint
    ? {
        x: Math.min(Math.max(activePoint.x - TOOLTIP_WIDTH / 2, CHART_PADDING), CHART_WIDTH - CHART_PADDING - TOOLTIP_WIDTH),
        y: Math.max(activePoint.y - TOOLTIP_HEIGHT - 18, 12),
      }
    : null

  if (!hourly.length) return null

  return (
    <section className="chart-card glass">
      <div className="section-heading">
        <span className="eyebrow">Hourly outlook</span>
        <h3>Temperature Trend</h3>
        <p className="chart-insight">{insight}</p>
      </div>
      <div className="chart-wrap">
        <svg className="chart-svg" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="img" aria-label="Temperature Trend for upcoming hours">
          <defs>
            <linearGradient id="temperature-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(20, 184, 166, 0.35)" />
              <stop offset="100%" stopColor="rgba(20, 184, 166, 0)" />
            </linearGradient>
          </defs>
          <path className="chart-grid-line" d={`M ${CHART_PADDING} ${CHART_HEIGHT - CHART_PADDING} H ${CHART_WIDTH - CHART_PADDING}`} />
          <path className="chart-grid-line chart-grid-line-mid" d={`M ${CHART_PADDING} ${CHART_HEIGHT / 2} H ${CHART_WIDTH - CHART_PADDING}`} />
          {areaPath && <path className="temperature-area" d={areaPath} />}
          <motion.path
            className="temperature-line"
            d={path}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          {points.map((point) => (
            <g
              className="chart-point"
              key={`${point.time}-${point.label}`}
              tabIndex="0"
              role="button"
              aria-label={`${point.label}, ${formatTempUnit(point.temp, unit)}`}
              onMouseEnter={() => setActivePoint(point)}
              onMouseLeave={() => setActivePoint(null)}
              onFocus={() => setActivePoint(point)}
              onBlur={() => setActivePoint(null)}
            >
              <circle className="temperature-point" cx={point.x} cy={point.y} r="5" />
              <circle className="temperature-hit-area" cx={point.x} cy={point.y} r="16" />
              <text className="chart-temp-label" x={point.x} y={point.y - 14}>
                {formatTempUnit(point.temp, unit)}
              </text>
              <text className="chart-time-label" x={point.x} y={CHART_HEIGHT - 10}>
                {point.label}
              </text>
            </g>
          ))}
          {activePoint && tooltip && (
            <g className="chart-tooltip-svg" pointerEvents="none" transform={`translate(${tooltip.x} ${tooltip.y})`}>
              <rect width={TOOLTIP_WIDTH} height={TOOLTIP_HEIGHT} rx="13" />
              <text x="14" y="21" className="chart-tooltip-time">
                {activePoint.label}
              </text>
              <text x="14" y="40" className="chart-tooltip-temp">
                {formatTempUnit(activePoint.temp, unit)}
              </text>
            </g>
          )}
        </svg>
      </div>
    </section>
  )
}
