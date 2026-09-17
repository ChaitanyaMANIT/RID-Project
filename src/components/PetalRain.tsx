import { useMemo } from 'react'
import type { CSSProperties } from 'react'

const PETAL_COLORS = ['#f6b58a', '#e8927c', '#ffd9c0', '#e6dff5', '#f7c9d3', '#ffe9d6']

interface PetalRainProps {
  /** How many petals. Phones get fewer — see `reduced` below. */
  count?: number
  reduced?: boolean
  className?: string
}

/**
 * DOM petals on a CSS keyframe. Cheaper than a canvas for this volume and it
 * never blocks touches. Off entirely when the reader prefers less motion.
 */
export default function PetalRain({ count = 26, reduced = false, className = '' }: PetalRainProps) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 9 + Math.random() * 13
        return {
          key: i,
          left: Math.random() * 100,
          size,
          color: PETAL_COLORS[i % PETAL_COLORS.length] ?? '#ffd9c0',
          duration: 9 + Math.random() * 9,
          delay: -Math.random() * 14,
          drift: `${Math.round((Math.random() - 0.5) * 180)}px`,
          spin: `${Math.round(200 + Math.random() * 420)}deg`,
          opacity: 0.35 + Math.random() * 0.45,
        }
      }),
    [count],
  )

  if (reduced) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 5 }}
    >
      {petals.map((p) => (
        <span
          key={p.key}
          className="petal absolute top-0"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.35,
              '--fall-duration': `${p.duration}s`,
              '--fall-delay': `${p.delay}s`,
              '--drift': p.drift,
              '--spin': p.spin,
              '--petal-opacity': p.opacity,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 20 28" width="100%" height="100%">
            <path
              d="M10 0C15 6 20 12 20 18c0 5.5-4.5 10-10 10S0 23.5 0 18C0 12 5 6 10 0Z"
              fill={p.color}
              opacity={0.9}
            />
          </svg>
        </span>
      ))}
    </div>
  )
}