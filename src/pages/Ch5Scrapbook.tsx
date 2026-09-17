import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Quote, X, LockKeyhole } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'
import ChapterShell from '../components/ChapterShell'
import Polaroid from '../components/Polaroid'
import RevealText from '../components/RevealText'
import Placeholder, { isPlaceholder } from '../components/Placeholder'
import PandaCharacter from '../components/PandaCharacter'
import { MEMORIES } from '../data/memories'
import type { Memory } from '../data/memories'
import { TAUGHT } from '../data/taught'
import { staggerParent } from '../animations/variants'

export default function Ch5Scrapbook() {
  const { chapter, sfx, markCompleted, reducedMotion } = useExperience()
  const [activeTab, setActiveTab] = useState<'photos' | 'taught'>('photos')
  const [openPhoto, setOpenPhoto] = useState<Memory | null>(null)
  const [broken, setBroken] = useState<Record<string, boolean>>({})
  const [taughtRevealed, setTaughtRevealed] = useState(0)
  const [taughtPassword, setTaughtPassword] = useState('')
  const [taughtUnlocked, setTaughtUnlocked] = useState(false)
  const [taughtPasswordError, setTaughtPasswordError] = useState(false)

  const viewPhoto = (memory: Memory) => {
    sfx('pop')
    setOpenPhoto(memory)
    markCompleted('scrapbook')
  }

  const checkInTaught = () => {
    sfx('chime')
    setTaughtRevealed((n) => {
      const next = Math.min(TAUGHT.checkIn.lines.length, n + 1)
      if (next >= TAUGHT.checkIn.lines.length) markCompleted('scrapbook')
      return next
    })
  }

  return (
    <ChapterShell chapter={chapter} subtitle="A collection of favourite moments and what our friendship taught me." wide>
      <motion.div variants={staggerParent(0.09)} initial="hidden" animate="show" className="space-y-6">
        {/* Sub-tab navigation */}
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              sfx('tap')
              setActiveTab('photos')
            }}
            className={`tap rounded-full px-5 py-2.5 text-[0.8rem] font-bold transition backdrop-blur-md ${
              activeTab === 'photos'
                ? 'bg-rose text-white shadow-lift'
                : 'bg-white/10 border border-white/15 text-cream-50/80 hover:bg-white/20'
            }`}
          >
            📸 Memory Scrapbook
          </button>
          <button
            type="button"
            onClick={() => {
              sfx('tap')
              setActiveTab('taught')
            }}
            className={`tap rounded-full px-5 py-2.5 text-[0.8rem] font-bold transition backdrop-blur-md ${
              activeTab === 'taught'
                ? 'bg-rose text-white shadow-lift'
                : 'bg-white/10 border border-white/15 text-cream-50/80 hover:bg-white/20'
            }`}
          >
            💡 What You Taught Me
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'photos' ? (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
                {MEMORIES.map((memory, i) => (
                  <div key={memory.id} className="mb-3 break-inside-avoid sm:mb-4">
                    <Polaroid
                      src={memory.src}
                      caption={memory.caption}
                      placeholder={memory.placeholder}
                      tilt={memory.tilt}
                      priority={i < 2}
                      onClick={() => viewPhoto(memory)}
                    />
                  </div>
                ))}
              </div>

              <p className="mt-6 text-center text-[0.72rem] text-ink-soft/70">
                {reducedMotion ? 'Tap a photo to view.' : 'Tap any polaroid to enlarge and read.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="taught"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-xl space-y-6"
            >
              {!taughtUnlocked ? (
                <div className="mx-auto max-w-md rounded-card border border-sage/30 bg-white/65 p-6 text-center shadow-soft backdrop-blur-sm">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sage/15 text-sage-deep">
                    <LockKeyhole size={20} />
                  </div>
                  <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-sage-deep">
                    A little secret
                  </p>
                  <h3 className="display mt-2 text-[1.5rem] text-ink">What you taught me</h3>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">
                    You know the password. 😉
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const correct = taughtPassword === 'pit-jaoge'
                      setTaughtPasswordError(!correct)
                      if (correct) {
                        setTaughtUnlocked(true)
                        sfx('chime')
                      } else {
                        sfx('slap')
                      }
                    }}
                    className="mt-5 flex flex-col gap-2 sm:flex-row"
                  >
                    <input
                      type="password"
                      value={taughtPassword}
                      onChange={(e) => {
                        setTaughtPassword(e.target.value)
                        setTaughtPasswordError(false)
                      }}
                      placeholder="Enter password"
                      autoComplete="off"
                      className="min-w-0 flex-1 rounded-full border border-ink/10 bg-white px-4 py-3 text-[0.85rem] text-ink outline-none transition placeholder:text-ink-soft/45 focus:border-sage-deep focus:ring-2 focus:ring-sage/20"
                    />
                    <button type="submit" className="tap rounded-full bg-sage-deep px-5 py-3 text-[0.82rem] font-semibold text-white shadow-soft">
                      Unlock
                    </button>
                  </form>
                  {taughtPasswordError ? (
                    <p className="mt-3 text-[0.75rem] font-semibold text-rose-deep">
                      Nope. Think of the phrase you hear quite often. 😏
                    </p>
                  ) : null}
                </div>
              ) : (
              <>
              <blockquote className="relative rounded-card border border-sage/40 bg-white/65 p-6 text-center shadow-soft backdrop-blur-sm">
                <Quote size={20} className="mx-auto mb-3 text-sage-deep/70" />
                <p className="display text-[1.4rem] leading-[1.35] text-ink sm:text-[1.8rem]">
                  <RevealText text={TAUGHT.centrepiece} split="word" stagger={0.08} />
                </p>
              </blockquote>

              <div className="space-y-3">
                {isPlaceholder(TAUGHT.realisation) ? (
                  <Placeholder label={TAUGHT.realisation} note="Written in src/data/taught.ts" />
                ) : (
                  TAUGHT.realisation.split('\n\n').map((para, i) => (
                    <p key={i} className="text-[0.95rem] leading-relaxed text-ink/85">
                      {para}
                    </p>
                  ))
                )}
              </div>

              <div className="rounded-card border border-white/70 bg-white/65 p-5 shadow-soft">
                <h3 className="display text-[1.15rem] text-ink">{TAUGHT.checkIn.title}</h3>
                <p className="mt-1 text-[0.82rem] text-ink-soft">
                  Tap below. You know exactly what comes next.
                </p>

                <div className="mt-4 min-h-[3rem] space-y-2">
                  <AnimatePresence>
                    {TAUGHT.checkIn.lines.slice(0, taughtRevealed).map((line, i) => (
                      <motion.p
                        key={line}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`display text-[1.1rem] ${
                          i === TAUGHT.checkIn.lines.length - 1 ? 'text-sage-deep' : 'text-ink/75'
                        }`}
                      >
                        “{line}”
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </div>

                {taughtRevealed < TAUGHT.checkIn.lines.length ? (
                  <button
                    type="button"
                    onClick={checkInTaught}
                    className="tap mt-3 rounded-full bg-sage-deep px-4 py-2.5 text-[0.8rem] font-semibold text-white"
                  >
                    {taughtRevealed === 0 ? 'Aap thik ho naa?' : 'Go on'}
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
                    {isPlaceholder(TAUGHT.checkIn.note) ? (
                      <Placeholder label={TAUGHT.checkIn.note} note="Why this mattered to you." />
                    ) : (
                      <p className="text-[0.9rem] leading-relaxed text-ink/85">{TAUGHT.checkIn.note}</p>
                    )}
                    <div className="flex justify-center pt-2">
                      <PandaCharacter size={76} mood="shy" />
                    </div>
                  </motion.div>
                )}
              </div>
              </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Polaroid enlarged modal */}
        <AnimatePresence>
          {openPhoto ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenPhoto(null)}
              className="fixed inset-0 z-[76] grid place-items-center bg-night/85 px-4 py-8 backdrop-blur-md"
            >
              <motion.figure
                initial={{ opacity: 0, scale: 0.92, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="paper-grain relative w-full max-w-lg rounded-[1.4rem] bg-white p-3 pb-4 shadow-lift"
              >
                <button
                  type="button"
                  onClick={() => setOpenPhoto(null)}
                  className="tap absolute right-2.5 top-2.5 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink/80 text-cream-50"
                >
                  <X size={15} />
                </button>

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[0.9rem] bg-cream-100">
                  {!broken[openPhoto.id] ? (
                    <img
                      src={openPhoto.src}
                      alt={openPhoto.caption}
                      onError={() => setBroken((b) => ({ ...b, [openPhoto.id]: true }))}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center border-2 border-dashed border-rose/35 text-center">
                      <div>
                        <Camera size={22} className="mx-auto mb-2 text-rose/70" />
                        <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-rose-deep">
                          {openPhoto.placeholder}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <figcaption className="hand mt-3 px-2 text-center text-[1.4rem] leading-tight text-ink">
                  {openPhoto.caption}
                </figcaption>
              </motion.figure>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </ChapterShell>
  )
}