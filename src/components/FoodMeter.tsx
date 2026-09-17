import { motion } from 'framer-motion'
import { Utensils } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'

/**
 * The running food joke. It fills as she plays the arcade games, and it is the
 * only "statistic" the whole site keeps — because food is genuinely her thing.
 */
export default function FoodMeter({ compact = false }: { compact?: boolean }) {
  const { foodMeter, reducedMotion } = useExperience()

  const full = foodMeter >= 100
  const caption = full
    ? 'Panda fed. Riddhi would approve.'
    : foodMeter >= 60
      ? 'Almost. She is watching the meter. She always watches the meter.'
      : foodMeter >= 25
        ? 'Snacks are being taken seriously.'
        : 'Play something and start feeding the panda.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-card border border-white/60 bg-white/60 p-3.5 backdrop-blur-sm ${
        compact ? '' : 'sm:p-4'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          <Utensils size={12} /> Food meter
        </span>
        <span className="text-[0.72rem] font-semibold text-ink">{foodMeter}%</span>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-cream-200">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #f6b58a 0%, #e8927c 55%, #d06a52 100%)',
          }}
          animate={{ width: `${foodMeter}%` }}
          transition={
            reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 20 }
          }
        />
      </div>

      <p className="mt-2 text-[0.75rem] leading-snug text-ink-soft">{caption}</p>
    </motion.div>
  )
}