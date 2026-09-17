import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'
import ChapterShell from '../components/ChapterShell'
import Polaroid from '../components/Polaroid'
import PandaCharacter from '../components/PandaCharacter'
import RunnerFigure from '../components/RunnerFigure'
import { JUNGLE } from '../data/jungleTrail'
import { fadeUp, staggerParent } from '../animations/variants'

type Phase = 'idle' | 'running' | 'crash'

export default function Ch4JungleTrail() {
  const { chapter, sfx, markCompleted } = useExperience()
  const [phase, setPhase] = useState<Phase>('idle')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (phase !== 'running') return
    let timer = 0
    let i = 0
    setIdx(0)
    const tick = () => {
      i += 1
      if (i >= JUNGLE.script.length) {
        setPhase('crash')
        return
      }
      setIdx(i)
      timer = window.setTimeout(tick, Math.max(720, 1500 - i * 130))
    }
    timer = window.setTimeout(tick, 1500)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'crash') return
    sfx('crash')
    markCompleted('jungle')
  }, [phase, sfx, markCompleted])

  const total = JUNGLE.script.length
  const progress = phase === 'crash' ? 74 : 6 + ((idx + 1) / (total + 1)) * 66
  const current = JUNGLE.script[Math.min(idx, total - 1)]
  const crashed = phase === 'crash'

  return (
    <ChapterShell
      chapter={chapter}
      subtitle="Four of us, one park, and one extremely bad idea. Mine."
    >
      <motion.div variants={staggerParent(0.1)} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-1.5">
          {JUNGLE.cast.map((who) => (
            <span
              key={who}
              className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-[0.72rem] font-medium text-ink-soft"
            >
              {who}
            </span>
          ))}
        </motion.div>

        {JUNGLE.media === 'photos' ? (
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
            {JUNGLE.photos.map((src, i) => (
              <Polaroid
                key={src}
                src={src}
                caption={JUNGLE.photoCaptions[i] ?? '[ADD MEMORY]'}
                tilt={i % 2 === 0 ? -2.5 : 2}
              />
            ))}
          </motion.div>
        ) : null}

        <motion.div variants={fadeUp}>
          <div
            className={`relative h-36 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-b from-sage/30 via-cream-100 to-cream-200 sm:h-44 ${
              crashed ? 'shaking' : ''
            }`}
          >
            {[8, 26, 62, 84, 46].map((left) => (
              <span
                key={left}
                aria-hidden="true"
                className="absolute bottom-0 text-[1.8rem] opacity-45"
                style={{ left: `${left}%` }}
              >
                🌳
              </span>
            ))}

            <motion.div
              className="absolute bottom-5 z-10"
              animate={{
                left: `${progress}%`,
                y: crashed ? 16 : 0,
                rotate: crashed ? -18 : 0,
              }}
              transition={{ duration: crashed ? 0.4 : 0.7, ease: 'easeInOut' }}
              aria-hidden="true"
              style={{ translateX: '-50%' }}
            >
              <RunnerFigure who="me" size={36} running={!crashed} />
            </motion.div>
            <motion.div
              className="absolute bottom-5 z-10"
              animate={{
                left: `${Math.max(2, progress - 8)}%`,
                y: crashed ? 24 : 0,
                rotate: crashed ? -42 : 0,
              }}
              transition={{ duration: crashed ? 0.4 : 0.75, ease: 'easeInOut' }}
              aria-hidden="true"
              style={{ translateX: '-50%' }}
            >
              <RunnerFigure who="riddhi" size={33} running={!crashed} />
            </motion.div>

            {crashed ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-8 left-[76%] text-[2rem]"
                aria-hidden="true"
              >
                💥
              </motion.span>
            ) : null}

            <div className="absolute inset-x-3 top-3 flex justify-center">
              <AnimatePresence mode="wait">
                {!crashed && current ? (
                  <motion.p
                    key={`${idx}-${current.line}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={`rounded-2xl px-3.5 py-2 text-[0.82rem] font-semibold shadow-soft ${
                      current.who === 'me' ? 'bg-ink text-cream-50' : 'bg-white text-ink'
                    }`}
                  >
                    <span className="mr-1.5 text-[0.62rem] uppercase tracking-wider opacity-60">
                      {current.who === 'me' ? 'Me' : 'Riddhi'}
                    </span>
                    {current.line}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            {crashed ? (
              <motion.p
                initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -4 }}
                className="display absolute inset-0 grid place-items-center text-[2.4rem] font-bold text-rose-deep sm:text-[3rem]"
                style={{ WebkitTextStroke: '2px #2E2622' }}
              >
                {JUNGLE.crashWord}
              </motion.p>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {phase === 'idle' ? (
              <button
                type="button"
                onClick={() => {
                  sfx('whoosh')
                  setPhase('running')
                }}
                className="tap inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[0.85rem] font-semibold text-cream-50"
              >
                <Play size={14} /> Play the memory
              </button>
            ) : null}

            {!crashed && phase === 'running' ? (
              <p className="text-[0.72rem] text-ink-soft/70">
                {progress > 45 ? 'This is the part where she told me to wait.' : 'It gets faster.'}
              </p>
            ) : null}

            {crashed ? (
              <button
                type="button"
                onClick={() => {
                  sfx('tap')
                  setPhase('idle')
                }}
                className="tap inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2.5 text-[0.78rem] font-semibold text-ink-soft"
              >
                <RotateCcw size={13} /> Watch it again
              </button>
            ) : null}
          </div>
        </motion.div>

        <AnimatePresence>
          {crashed ? (
            <motion.div
              key="verdict"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-5"
            >
              <div className="overflow-hidden rounded-card border border-white/60 bg-white/70 shadow-soft">
                {JUNGLE.verdict.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.25 }}
                    className="flex items-baseline justify-between gap-4 border-b border-cream-200 px-4 py-3 last:border-b-0"
                  >
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                      {row.label}
                    </span>
                    <span className="text-right text-[0.9rem] font-medium text-ink">
                      {row.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <PandaCharacter size={92} mood="annoyed" />
                <p className="hand text-xl text-rose-deep sm:text-2xl">{JUNGLE.sorryLine}</p>
                <p className="max-w-md text-[0.85rem] leading-relaxed text-ink-soft">
                  {JUNGLE.outro}
                </p>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </ChapterShell>
  )
}