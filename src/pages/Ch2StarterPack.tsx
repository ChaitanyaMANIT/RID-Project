import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Coffee } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'
import ChapterShell from '../components/ChapterShell'
import PandaCharacter from '../components/PandaCharacter'
import ThoughtBubbles from '../components/ThoughtBubbles'
import { SecretTrigger } from '../components/EasterEgg'
import { RIDDHI, STARTER_PACK, TRAITS, DONT_CLICK_LINES } from '../data/riddhi'
import { fadeUp, listItem, staggerParent } from '../animations/variants'

export default function Ch2StarterPack() {
  const { chapter, sfx, fireEgg, markCompleted, reducedMotion, pandaTaps } = useExperience()
  const [selected, setSelected] = useState(STARTER_PACK[0]?.id ?? 'panda')
  const [overthinking, setOverthinking] = useState(false)
  const [clicks, setClicks] = useState(0)

  const item = STARTER_PACK.find((i) => i.id === selected) ?? STARTER_PACK[0]

  const choose = (id: string, special: boolean) => {
    sfx('tap')
    setSelected(id)
    if (special) {
      window.setTimeout(() => {
        sfx('whoosh')
        setOverthinking(true)
      }, 320)
    }
    markCompleted('starter')
  }

  const trap = () => {
    const next = clicks + 1
    setClicks(next)
    sfx('pop')
    fireEgg(
      'dont-click',
      DONT_CLICK_LINES[Math.min(next - 1, DONT_CLICK_LINES.length - 1)] ?? 'I said don’t.',
    )
  }

  return (
    <ChapterShell
      chapter={chapter}
      subtitle={`Everything you need to understand ${RIDDHI.name}, in nine small squares. Tap any of them.`}
    >
      <motion.div variants={staggerParent(0.07)} initial="hidden" animate="show" className="space-y-6">
        <motion.ul variants={fadeUp} className="flex flex-wrap gap-1.5">
          {TRAITS.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.72rem] font-medium text-cream-50/80 backdrop-blur-sm"
            >
              {t}
            </li>
          ))}
        </motion.ul>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {STARTER_PACK.map((tile) => {
            const active = tile.id === selected
            const isCoffee = tile.id === 'coffee'
            return (
              <div key={tile.id} className="relative">
                <motion.button
                  variants={listItem}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => choose(tile.id, tile.kind === 'overthinking')}
                  className={`tap flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 py-4 text-center transition backdrop-blur-md ${
                    active
                      ? 'border-gold bg-white/20 shadow-lift'
                      : 'border-white/15 bg-white/10 hover:border-gold/40'
                  }`}
                  aria-pressed={active}
                >
                  <span className="text-[1.6rem] leading-none" aria-hidden="true">
                    {tile.emoji}
                  </span>
                  <span className="text-[0.72rem] font-semibold leading-tight text-cream-50">
                    {tile.title}
                  </span>
                </motion.button>

                {isCoffee ? (
                  <div className="absolute -right-1 -top-1">
                    <SecretTrigger
                      onFire={() => fireEgg('suno')}
                      label="A refill, probably"
                      className="glow-pulse grid h-7 w-7 place-items-center rounded-full bg-night/80 border border-gold/40 shadow-soft"
                    >
                      <Coffee size={13} className="text-gold" />
                    </SecretTrigger>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {item ? (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32 }}
              className="rounded-card border border-white/15 bg-white/10 p-5 shadow-lift backdrop-blur-md"
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold">
                {item.emoji} {item.title}
              </p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-cream-50">{item.blurb}</p>
              {item.id === 'panda' ? (
                <div className="mt-3 flex items-center gap-3">
                  <PandaCharacter size={72} mood={pandaTaps >= 5 ? 'done' : 'idle'} />
                  <p className="text-[0.78rem] leading-snug text-cream-50/70">
                    Go on. Tap it. See what happens.
                  </p>
                </div>
              ) : null}
              {item.id === 'overthinking' ? (
                <button
                  type="button"
                  onClick={() => {
                    sfx('whoosh')
                    setOverthinking(true)
                  }}
                  className="tap mt-3 rounded-full bg-lavender-deep px-4 py-2.5 text-[0.78rem] font-semibold text-white"
                >
                  Open this one anyway
                </button>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 pt-2">
          <button
            type="button"
            onClick={trap}
            className="tap crisp-text rounded-full border border-dashed border-white/35 bg-white/15 px-4 py-2.5 text-[0.78rem] font-bold text-white"
          >
            Definitely don’t click this.
          </button>
          {clicks > 0 ? (
            <p className="hand text-lg text-rose-deep">
              You clicked it {clicks} time{clicks === 1 ? '' : 's'}. Of course you did.
            </p>
          ) : null}
          {!reducedMotion && clicks === 0 ? (
            <p className="text-center text-[0.72rem] font-semibold text-white/85">
              Some of these squares are hiding something. One of them in particular.
            </p>
          ) : null}
        </motion.div>
      </motion.div>

      <ThoughtBubbles
        active={overthinking}
        reduced={reducedMotion}
        onDone={() => setOverthinking(false)}
      />
    </ChapterShell>
  )
}