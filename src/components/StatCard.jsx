import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <motion.article className="stat-card" whileHover={{ y: -3 }}>
      <span className="stat-icon" aria-hidden="true">
        <Icon />
      </span>
      <div className="stat-body">
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </motion.article>
  )
}
