import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'

const CONFETTI_COLORS = [
  '#e8927c',
  '#f6b58a',
  '#e8c27e',
  '#ab99d6',
  '#afc2a4',
  '#ffd9c0',
  '#d06a52',
]

interface ConfettiProps {
  /** Change this to fire a fresh burst with the same component mounted. */
  fireKey: number
  count?: number
  reduced?: boolean
  durationMs?: number
}

/**
 * One-shot confetti burst. Pieces animate out on a CSS keyframe and the whole
 * layer unmounts itself, so nothing keeps ticking in the background.
 */
export default function Confetti({
  fireKey,
  count = 90,
  reduced = false,
  durationMs = 4200,
}: ConfettiProps) {
  const [live, setLive] = useState(false)

  useEffect(() => {
    setLive(true)
    const t = window.setTimeout(() => setLive(false), durationMs)
    return () => window.clearTimeout(t)
  }, [fireKey, durationMs])

  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        key: i,
        left: Math.random() * 100,
        width: 5 + Math.random() * 7,
        height: 8 + Math.random() * 12,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? '#e8927c',
        duration: 2.1 + Math.random() * 2.2,
        delay: Math.random() * 0.9,
        drift: `${Math.round((Math.random() - 0.5) * 320)}px`,
        spin: `${Math.round(360 + Math.random() * 900)}deg`,
        round: Math.random() > 0.7,
      })),
    [count, fireKey],
  )

  if (reduced || !live) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 60 }}>
      {pieces.map((p) => (
        <span
          key={p.key}
          className="confetti-piece absolute top-0"
          style={
            {
              left: `${p.left}%`,
              width: p.width,
              height: p.height,
              background: p.color,
              borderRadius: p.round ? '999px' : '2px',
              '--fall-duration': `${p.duration}s`,
              '--fall-delay': `${p.delay}s`,
              '--drift': p.drift,
              '--spin': p.spin,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}