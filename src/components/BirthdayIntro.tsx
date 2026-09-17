import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Music } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'
import PetalRain from './PetalRain'
import Sparkles from './Sparkles'
import Confetti from './Confetti'
import PandaCharacter from './PandaCharacter'
import RevealText from './RevealText'
import Typewriter from './Typewriter'
import HeroPhotoCard from './HeroPhotoCard'
import { RIDDHI } from '../data/riddhi'

/**
 * The prologue. Nothing is revealed until she chooses to open it.
 *
 * This is also the only place in the whole experience that can legally start
 * audio, because it is a real user gesture — which is exactly why the cover
 * has a button instead of autoplaying.
 */
export default function BirthdayIntro() {
  const { stage } = useExperience()

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 'cover' ? <CoverPhase key="cover" /> : <RevealPhase key="reveal" />}
      </AnimatePresence>
    </div>
  )
}

function CoverPhase() {
  const { beginReveal, unlock, reducedMotion, sfx, music } = useExperience()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 1400)
    return () => window.clearTimeout(t)
  }, [])

  const open = (resume: boolean) => {
    unlock()
    sfx('sparkle')
    music.play('birthday')
    beginReveal(resume)
  }

  return (
    <motion.section
      key="cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative grid min-h-[100dvh] w-full place-items-center px-6"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 8%, #33261f 0%, #1b1613 55%, #100d0b 100%)',
      }}
    >
      <Sparkles count={18} reduced={reducedMotion} />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-gold/70"
        >
          {RIDDHI.name} · 22
        </motion.span>

        <h1 className="display mt-6 min-h-[2.6em] text-[1.6rem] leading-snug text-cream-50 sm:text-[2rem]">
          <Typewriter text="I made something for you..." speed={58} startDelay={600} />
        </h1>

        <AnimatePresence>
          {ready ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-9 flex flex-col items-center gap-4"
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => open(false)}
                className="tap glow-pulse flex items-center gap-2.5 rounded-full bg-rose px-7 py-4 text-[0.95rem] font-semibold text-white shadow-lift"
              >
                Open it
                <ArrowRight size={17} />
              </motion.button>

            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

function RevealPhase() {
  const { startJourney, sfx, reducedMotion, music } = useExperience()
  const [burst, setBurst] = useState(0)
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    setBurst(1)
    const t = window.setTimeout(() => setShowCta(true), 2600)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <motion.section
      key="reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative grid min-h-[100dvh] w-full place-items-center overflow-hidden px-5 py-16"
      style={{
        background: 'radial-gradient(120% 85% at 50% 0%, #fffbf5 0%, #fdf1e3 45%, #ffe6d3 100%)',
      }}
    >
      <PetalRain count={reducedMotion ? 0 : 30} reduced={reducedMotion} />
      <Sparkles count={16} reduced={reducedMotion} />
      <Confetti fireKey={burst} reduced={reducedMotion} count={70} />

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-rose-deep"
        >
          Okay. Here we go.
        </motion.p>

        <h1 className="display birthday-title crisp-text mt-5 text-[2.2rem] leading-[1.12] sm:text-[3.4rem]">
          <RevealText text="HAPPY 22ND BIRTHDAY," split="word" className="block" />
          <span className="mt-1 block">
            <RevealText text={`${RIDDHI.name.toUpperCase()}! 🎂🐼`} split="char" delay={0.7} />
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: 'spring', stiffness: 200, damping: 18 }}
          className="mt-4 flex items-center justify-center gap-4"
        >
          <PandaCharacter size={110} mood="cheering" floating />
        </motion.div>

        <HeroPhotoCard
          caption="The one and only Riddhi ✨"
          placeholder="[ADD RIDDHI PHOTO 1]"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-soft"
        >
          I did not make you a card. I made you a small interactive universe instead. It has 6
          chapters, a rescue game, and one very important panda.
        </motion.p>

        <AnimatePresence>
          {showCta ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-9 flex flex-col items-center gap-3"
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  sfx('whoosh')
                  startJourney()
                }}
                className="tap flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 text-[0.95rem] font-semibold text-cream-50 shadow-lift"
              >
                Let’s go
                <ArrowRight size={17} />
              </motion.button>

              <p className="flex items-center gap-1.5 text-[0.7rem] text-ink-soft/80">
                <Music size={11} />
                {music.anyAvailable
                  ? 'Music is on. You can pause it any time, bottom left.'
                  : 'Turn your sound up. Music unlocks once the files are in the music folder.'}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}