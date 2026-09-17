import { motion } from 'framer-motion'
import { fadeUp } from '../animations/variants'

/** Anything shaped like `[WRITE LETTER]` is treated as still-to-be-written. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value === 'string' && /^\[[^\]]+\]$/.test(value.trim())
}

interface PlaceholderProps {
  /** The token itself, e.g. `[WRITE LETTER]`. */
  label: string
  /** A human note underneath, e.g. "Chaitanya is still writing this one." */
  note?: string
  className?: string
  tone?: 'light' | 'night'
}

/**
 * The graceful stand-in for content that has not been written yet.
 *
 * It is deliberately pretty: if Riddhi opens this before every word is filled
 * in, this reads as an intentional "still to come" card rather than a bug.
 */
export default function Placeholder({ label, note, className = '', tone = 'light' }: PlaceholderProps) {
  const night = tone === 'night'
  return (
    <motion.div
      variants={fadeUp}
      className={`relative overflow-hidden rounded-card border-2 border-dashed px-5 py-6 text-center ${
        night ? 'border-gold/45 bg-white/5 text-cream-50' : 'border-rose/45 bg-white/55 text-ink'
      } ${className}`}
    >
      <span className={`block text-xs font-semibold tracking-[0.22em] ${night ? 'text-gold' : 'text-rose-deep'}`}>
        {label}
      </span>
      {note ? (
        <span className="hand mt-2 block text-lg leading-snug opacity-80">{note}</span>
      ) : null}
    </motion.div>
  )
}