import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PANDA_TAP_LINES } from '../data/cast'
import { useExperience } from '../context/ExperienceContext'

export type PandaMood = 'idle' | 'happy' | 'sleepy' | 'annoyed' | 'done' | 'shy' | 'cheering'

interface PandaCharacterProps {
  size?: number
  mood?: PandaMood
  className?: string
  /** Wires the "tap the panda" easter egg. */
  interactive?: boolean
  /** Gentle idle bobbing, for hero positions. */
  floating?: boolean
  label?: string
}

/**
 * The recurring character. Hand-drawn in SVG rather than an emoji or clip-art
 * so it looks identical on every device, blinks, and reacts — and so nothing
 * in this project is borrowed artwork.
 *
 * Tap it enough times and it changes permanently for the session.
 */
export default function PandaCharacter({
  size = 120,
  mood = 'idle',
  className = '',
  interactive = true,
  floating = false,
  label = 'Panda',
}: PandaCharacterProps) {
  const { tapPanda, fireEgg, sfx, pandaTaps, reducedMotion } = useExperience()
  const [line, setLine] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  // Enough taps and it puts on sunglasses and stays that way.
  const annoyedForever = interactive && pandaTaps >= 5
  const effectiveMood: PandaMood = mood === 'done' ? 'done' : annoyedForever ? 'done' : mood

  const handleTap = () => {
    if (!interactive) return
    sfx('tap')
    const count = tapPanda()
    const idx = Math.min(count - 1, PANDA_TAP_LINES.length - 1)
    const message = PANDA_TAP_LINES[idx] ?? '...'
    setLine(message)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setLine(null), 2600)
    if (count >= 5) fireEgg('bas-karo', message)
    // Keep going and the whole screen fills with pandas. Her request, sort of.
    if (count === 9 || (count > 9 && count % 12 === 0)) fireEgg('bhalu')
  }

  const anim =
    effectiveMood === 'happy' || effectiveMood === 'cheering'
      ? { y: [0, -12, 0], rotate: [0, 2.5, -2.5, 0] }
      : effectiveMood === 'sleepy'
        ? { y: [0, 3, 0], scale: [1, 1.018, 1] }
        : effectiveMood === 'annoyed' || effectiveMood === 'done'
          ? { rotate: [0, -2.4, 2.4, 0] }
          : effectiveMood === 'shy'
            ? { y: [0, 3, 0], rotate: [0, 1.6, -1.6, 0] }
            : { y: [0, -4, 0] }

  const eyesClosed = effectiveMood === 'sleepy' || effectiveMood === 'done'
  const blushOpacity = effectiveMood === 'shy' ? 0.85 : effectiveMood === 'happy' ? 0.6 : 0.42

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        role={interactive ? 'button' : 'img'}
        aria-label={label}
        tabIndex={interactive ? 0 : -1}
        onClick={handleTap}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleTap()
          }
        }}
        className={`${interactive ? 'cursor-pointer' : ''} ${floating && !reducedMotion ? 'float-soft' : ''}`}
        style={{ touchAction: 'manipulation', overflow: 'visible' }}
        animate={reducedMotion ? undefined : anim}
        transition={{
          duration: effectiveMood === 'sleepy' ? 5.2 : 3.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileTap={interactive ? { scale: 0.92 } : undefined}
      >
        {/* ears */}
        <circle cx="46" cy="54" r="27" fill="#2E2622" />
        <circle cx="154" cy="54" r="27" fill="#2E2622" />

        {/* head */}
        <circle cx="100" cy="108" r="68" fill="#FFFDF8" stroke="#2E2622" strokeWidth="5" />

        {/* eye patches */}
        <ellipse cx="74" cy="100" rx="23" ry="27" fill="#2E2622" transform="rotate(-16 74 100)" />
        <ellipse cx="126" cy="100" rx="23" ry="27" fill="#2E2622" transform="rotate(16 126 100)" />

        {!eyesClosed ? (
          <motion.g
            style={{ transformOrigin: '100px 99px', transformBox: 'view-box' }}
            animate={reducedMotion ? undefined : { scaleY: [1, 1, 0.08, 1] }}
            transition={{
              duration: 0.42,
              repeat: Infinity,
              repeatDelay: 3.6,
              times: [0, 0.72, 0.86, 1],
            }}
          >
            <circle cx="79" cy="98" r="9" fill="#FFFDF8" />
            <circle cx="121" cy="98" r="9" fill="#FFFDF8" />
            <circle cx="80" cy="99" r="4" fill="#2E2622" />
            <circle cx="122" cy="99" r="4" fill="#2E2622" />
          </motion.g>
        ) : effectiveMood === 'done' ? (
          <>
            {/* sunglasses. Because enough is enough. */}
            <rect x="46" y="84" width="48" height="30" rx="13" fill="#2E2622" />
            <rect x="106" y="84" width="48" height="30" rx="13" fill="#2E2622" />
            <rect x="92" y="93" width="16" height="6" rx="3" fill="#2E2622" />
            <path d="M54 90 h12" stroke="#FFFDF8" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
            <path d="M114 90 h12" stroke="#FFFDF8" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
          </>
        ) : (
          <>
            <path
              d="M70 100 q9 8 18 0"
              stroke="#FFFDF8"
              strokeWidth="3.4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M112 100 q9 8 18 0"
              stroke="#FFFDF8"
              strokeWidth="3.4"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}

        {effectiveMood === 'annoyed' ? (
          <>
            <path d="M58 76 l24 -7" stroke="#2E2622" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M142 76 l-24 -7" stroke="#2E2622" strokeWidth="5.5" strokeLinecap="round" />
          </>
        ) : null}

        {/* nose + mouth */}
        <ellipse cx="100" cy="128" rx="9.5" ry="7" fill="#2E2622" />
        <path d="M100 135 q-12 13 -22 3" stroke="#2E2622" strokeWidth="4.2" fill="none" strokeLinecap="round" />
        <path d="M100 135 q12 13 22 3" stroke="#2E2622" strokeWidth="4.2" fill="none" strokeLinecap="round" />

        {/* blush */}
        <ellipse cx="50" cy="134" rx="14" ry="8.5" fill="#F7B0A4" opacity={blushOpacity} />
        <ellipse cx="150" cy="134" rx="14" ry="8.5" fill="#F7B0A4" opacity={blushOpacity} />

        {effectiveMood === 'cheering' ? (
          <>
            <path d="M168 40 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6 z" fill="#E8C27E" opacity="0.95" />
            <path d="M30 52 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" fill="#E8C27E" opacity="0.8" />
          </>
        ) : null}
      </motion.svg>

      <AnimatePresence>
        {line ? (
          <motion.div
            key={`${line}-${pandaTaps}`}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.94 }}
            transition={{ duration: 0.28 }}
            className="pointer-events-none absolute -top-2 left-1/2 w-max max-w-[15rem] -translate-x-1/2 -translate-y-full rounded-2xl rounded-bl-sm bg-ink px-3.5 py-2 text-center text-[0.78rem] font-medium leading-snug text-cream-50 shadow-soft"
          >
            {line}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}