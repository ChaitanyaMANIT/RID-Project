import { motion } from 'framer-motion'

interface RunnerFigureProps {
  who: 'me' | 'riddhi'
  /** Height in px; width follows the 40:52 drawing ratio. */
  size?: number
  running?: boolean
  className?: string
}

/**
 * A hand-drawn runner who faces RIGHT.
 *
 * This replaces the `🏃` / `🏃‍♀️` emoji, which face LEFT on Windows and Android
 * (but not on every platform), so the characters appeared to run backwards.
 * Drawn in code, the direction is guaranteed to be the same everywhere — and it
 * matches the panda's visual language.
 */
export default function RunnerFigure({
  who,
  size = 34,
  running = true,
  className = '',
}: RunnerFigureProps) {
  const shirt = who === 'me' ? '#2E2622' : '#D06A52'
  const trousers = who === 'me' ? '#7A6A63' : '#6F8B64'
  const skin = '#F3C7A6'

  const hip = 20
  const hipY = 30
  const shoulderY = 20

  const swing = (from: number, to: number, origin: string) => ({
    animate: running ? { rotate: [from, to, from] } : { rotate: 0 },
    transition: {
      duration: 0.34,
      repeat: running ? Infinity : 0,
      ease: 'easeInOut' as const,
    },
    style: { transformOrigin: origin, transformBox: 'view-box' as const },
  })

  const legOrigin = `${hip}px ${hipY}px`

  return (
    <svg
      viewBox="0 0 40 52"
      width={size}
      height={(size * 52) / 40}
      className={className}
      aria-hidden="true"
    >
      {/* ---- back limbs ---- */}
      <motion.g {...swing(22, -24, legOrigin)}>
        <line
          x1={hip}
          y1={hipY}
          x2={hip + 1}
          y2={47}
          stroke={trousers}
          strokeWidth="4.4"
          strokeLinecap="round"
        />
      </motion.g>
      <motion.g {...swing(-26, 22, `${hip + 1}px ${shoulderY}px`)}>
        <line
          x1={hip + 1}
          y1={shoulderY}
          x2={hip + 6}
          y2={28}
          stroke={shirt}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </motion.g>

      {/* ---- torso, leaning forward (right) ---- */}
      <path
        d={`M${hip - 1} 31 L${hip + 2} 18`}
        stroke={shirt}
        strokeWidth="9.5"
        strokeLinecap="round"
      />

      {/* ---- front limbs ---- */}
      <motion.g {...swing(-24, 22, legOrigin)}>
        <line
          x1={hip}
          y1={hipY}
          x2={hip + 3}
          y2={47}
          stroke={trousers}
          strokeWidth="4.4"
          strokeLinecap="round"
        />
      </motion.g>
      <motion.g {...swing(24, -24, `${hip + 2}px ${shoulderY}px`)}>
        <line
          x1={hip + 2}
          y1={shoulderY}
          x2={hip - 1}
          y2={29}
          stroke={shirt}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </motion.g>

      {/* ---- hair behind the head ---- */}
      {who === 'riddhi' ? (
        <>
          <circle cx="24" cy="11.5" r="7.4" fill="#2E2622" />
          <path
            d="M17.8 12 c-0.8 5 -1.8 8 -3.4 10.2 c2.6 1.2 5.2 -2.4 5.9 -8.2 Z"
            fill="#2E2622"
          />
        </>
      ) : null}

      {/* ---- head ---- */}
      <circle cx="25.4" cy="11.8" r="6.2" fill={skin} />

      {/* ---- hair / fringe in front ---- */}
      {who === 'riddhi' ? (
        <path d="M19.4 9.4 q6 -4.4 11.8 0.2 q-6 -1.8 -11.8 -0.2 Z" fill="#2E2622" />
      ) : (
        <path d="M19.6 9.6 a6.4 6.4 0 0 1 12.2 -0.4 q-6 -2.6 -12.2 0.4 Z" fill="#2E2622" />
      )}

      {/* ---- eye, looking the way she is going ---- */}
      <circle cx="28.6" cy="11.2" r="1.05" fill="#2E2622" />

      {/* ---- the panda she keeps with her ---- */}
      {who === 'riddhi' ? (
        <circle cx="14.2" cy="26.5" r="3.1" fill="#FFFDF8" stroke="#2E2622" strokeWidth="1.1" />
      ) : null}
    </svg>
  )
}
