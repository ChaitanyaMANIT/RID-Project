import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { OVERTHINKING_END } from '../data/riddhi'
import PandaCharacter from './PandaCharacter'

interface ThoughtBubblesProps {
  active: boolean
  onDone: () => void
  reduced: boolean
}

/**
 * The overthinking tile, taken seriously for about four seconds.
 *
 * Thought bubbles multiply across the whole screen, then a panda turns up and
 * tells her to breathe. Quick, funny, and never actually distressing.
 */
export default function ThoughtBubbles({ active, onDone, reduced }: ThoughtBubblesProps) {
  const [count, setCount] = useState(reduced ? 14 : 8)
  const [settled, setSettled] = useState(false)

  const thoughts = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        key: i,
        left: 4 + Math.random() * 84,
        top: 6 + Math.random() * 82,
        size: 0.75 + Math.random() * 0.7,
        delay: Math.random() * 1.6,
        text: [
          'what did that mean',
          'did I say it weirdly',
          'they went offline',
          'was it my fault',
          'ok but actually',
          'what if',
          'one more time',
          'am I overthinking?',
          'yes',
        ][i % 9],
      })),
    [],
  )

  useEffect(() => {
    if (!active) {
      setCount(reduced ? 14 : 8)
      setSettled(false)
      return
    }
    if (reduced) {
      setSettled(true)
      return
    }
    let n = 8
    const grow = window.setInterval(() => {
      n = Math.min(thoughts.length, n + 7)
      setCount(n)
      if (n >= thoughts.length) window.clearInterval(grow)
    }, 320)
    const calm = window.setTimeout(() => setSettled(true), 3000)
    return () => {
      window.clearInterval(grow)
      window.clearTimeout(calm)
    }
  }, [active, reduced, thoughts.length])

  useEffect(() => {
    if (!active || !settled) return
    const t = window.setTimeout(onDone, 4200)
    return () => window.clearTimeout(t)
  }, [active, settled, onDone])

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[75] overflow-hidden bg-cream-50/92 backdrop-blur-md"
          role="dialog"
          aria-label="Thought bubbles"
        >
          {thoughts.slice(0, count).map((t) => (
            <motion.span
              key={t.key}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: settled ? 0.34 : 0.9, scale: t.size }}
              transition={{ delay: t.delay * 0.4, type: 'spring', stiffness: 260, damping: 20 }}
              className="absolute rounded-2xl rounded-bl-sm bg-white px-2.5 py-1.5 text-[0.68rem] font-medium text-ink-soft shadow-soft"
              style={{ left: `${t.left}%`, top: `${t.top}%` }}
            >
              {t.text}
            </motion.span>
          ))}

          <AnimatePresence>
            {settled ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute inset-0 grid place-items-center px-6"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <PandaCharacter size={110} mood="sleepy" floating />
                  <p className="display text-2xl text-ink sm:text-3xl">{OVERTHINKING_END}</p>
                  <button
                    type="button"
                    onClick={onDone}
                    className="tap rounded-full bg-ink px-5 py-3 text-[0.82rem] font-semibold text-cream-50"
                  >
                    Better.
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}