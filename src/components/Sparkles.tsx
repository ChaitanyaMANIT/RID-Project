import { useMemo } from 'react'
import type { CSSProperties } from 'react'

interface SparklesProps {
  count?: number
  reduced?: boolean
  /** Constrain to a container instead of the whole viewport. */
  contained?: boolean
  className?: string
}

/** Soft twinkling dust. Purely decorative — hidden from assistive tech. */
export default function Sparkles({
  count = 22,
  reduced = false,
  contained = false,
  className = '',
}: SparklesProps) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        key: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 1.8 + Math.random() * 2.6,
        delay: Math.random() * 3,
      })),
    [count],
  )

  if (reduced) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${contained ? 'absolute' : 'fixed'} inset-0 overflow-hidden ${className}`}
    >
      {dots.map((d) => (
        <span
          key={d.key}
          className="sparkle absolute rounded-full"
          style={
            {
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              background: 'radial-gradient(circle, #fffaf0 0%, #e8c27e 65%, rgba(232,194,126,0) 100%)',
              '--twinkle-duration': `${d.duration}s`,
              '--twinkle-delay': `${d.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}