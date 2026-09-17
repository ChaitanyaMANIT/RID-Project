import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../context/ExperienceContext'
import type { EggId } from '../context/ExperienceContext'
import { VOICE } from '../data/cast'
import Confetti from './Confetti'
import PandaCharacter from './PandaCharacter'

const DURATION: Record<EggId, number> = {
  suno: 3600,
  'pit-jaoge': 3200,
  'bas-karo': 2600,
  'dont-click': 2800,
  bhalu: 6400,
  'confetti-22': 4400,
  secret: 2800,
}

/**
 * Every easter egg lands here, so they all share one visual language and one
 * dismissal rule. The rest of the site never has to know how to draw them.
 */
export default function EasterEggLayer() {
  const { egg, clearEgg, reducedMotion } = useExperience()
  const [phase, setPhase] = useState<'warn' | 'hit'>('hit')

  const id = egg?.id
  const nonce = egg?.nonce ?? 0

  // Two-beat eggs: the warning lands first, then the punchline.
  useEffect(() => {
    if (id !== 'pit-jaoge') {
      setPhase('hit')
      return
    }
    setPhase('warn')
    const t = window.setTimeout(() => setPhase('hit'), 950)
    return () => window.clearTimeout(t)
  }, [id, nonce])

  // The whole page shakes for "PIT JAOGE."
  useEffect(() => {
    if (id !== 'pit-jaoge') return
    const root = document.documentElement
    const t = window.setTimeout(() => {
      root.classList.add('shaking')
      window.setTimeout(() => root.classList.remove('shaking'), 700)
    }, 950)
    return () => {
      window.clearTimeout(t)
      root.classList.remove('shaking')
    }
  }, [id, nonce])

  useEffect(() => {
    if (!id) return
    const t = window.setTimeout(() => clearEgg(), DURATION[id])
    return () => window.clearTimeout(t)
  }, [id, nonce, clearEgg])

  const pandaRain = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        key: i,
        left: Math.random() * 92,
        size: 34 + Math.random() * 30,
        duration: 5 + Math.random() * 3.6,
        delay: Math.random() * 1.8,
        drift: `${Math.round((Math.random() - 0.5) * 220)}px`,
        spin: `${Math.round((Math.random() - 0.5) * 240)}deg`,
      })),
    [nonce],
  )

  return (
    <>
      <AnimatePresence>
        {id === 'suno' ? (
          <motion.div
            key={`suno-${nonce}`}
            className="pointer-events-none fixed inset-0 z-[70] grid place-items-center bg-night/80 px-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="suno-zoom display text-center text-[13vw] leading-none text-cream-50 sm:text-[9vw]">
              {VOICE.sunoLong}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {id === 'pit-jaoge' ? (
          <motion.div
            key={`pit-${nonce}`}
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed inset-0 z-[70] grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {phase === 'warn' ? (
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-2xl border border-gold/60 bg-night/92 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.24em] text-gold shadow-lift"
              >
                {VOICE.warningBanner}
              </motion.p>
            ) : (
              <motion.p
                initial={{ scale: 0.7, opacity: 0, rotate: -6 }}
                animate={{ scale: 1, opacity: 1, rotate: -4 }}
                className="display text-center text-[17vw] font-bold leading-none text-rose-deep sm:text-[11vw]"
                style={{ WebkitTextStroke: '2px #2E2622' }}
              >
                {VOICE.pitJaoge}
              </motion.p>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {id === 'bhalu' ? (
          <motion.div
            key={`bhalu-${nonce}`}
            className="pointer-events-none fixed inset-0 z-[68] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {pandaRain.map((p) => (
              <span
                key={p.key}
                className="petal absolute top-0"
                style={
                  {
                    left: `${p.left}%`,
                    '--fall-duration': `${p.duration}s`,
                    '--fall-delay': `${p.delay}s`,
                    '--drift': p.drift,
                    '--spin': p.spin,
                  } as CSSProperties
                }
              >
                <PandaCharacter size={p.size} mood="happy" interactive={false} label="" />
              </span>
            ))}
            <div className="absolute inset-x-0 bottom-8 text-center">
              <span className="hand rounded-full bg-night/80 px-4 py-2 text-xl text-cream-50">
                bhalu mode unlocked 🐼
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {id === 'confetti-22' ? (
        <Confetti key={`c22-${nonce}`} fireKey={nonce} reduced={reducedMotion} />
      ) : null}

      <AnimatePresence>
        {id === 'bas-karo' || id === 'dont-click' || id === 'secret' ? (
          <motion.div
            key={`${id}-${nonce}`}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="pointer-events-none fixed left-1/2 top-5 z-[70] w-[min(22rem,88vw)] -translate-x-1/2 rounded-2xl border border-white/25 bg-night/94 px-4 py-3 text-center shadow-lift"
          >
            <p className="display text-lg leading-snug text-cream-50">
              {egg?.text ?? 'Bas karo.'}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

interface SecretTriggerProps {
  children: ReactNode
  className?: string
  /** Screen reader label. Deliberately deadpan. */
  label?: string
  onFire: () => void
}

/**
 * A wrapper for "click something suspicious". It looks slightly too interesting
 * on purpose — and never explains itself.
 */
export function SecretTrigger({
  children,
  className = '',
  label = 'Nothing to see here',
  onFire,
}: SecretTriggerProps) {
  const { sfx } = useExperience()
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        sfx('whoosh')
        onFire()
      }}
      className={`tap relative cursor-pointer rounded-full transition ${className}`}
    >
      {children}
    </button>
  )
}