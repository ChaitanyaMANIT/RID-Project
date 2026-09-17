import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cake, Mail, RotateCcw, Sparkles } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'
import ChapterShell from '../components/ChapterShell'
import Confetti from '../components/Confetti'
import PetalRain from '../components/PetalRain'
import Placeholder, { isPlaceholder } from '../components/Placeholder'
import PandaCharacter from '../components/PandaCharacter'
import RevealText from '../components/RevealText'
import { CAKE } from '../data/cake'
import { LETTER } from '../data/letters'
import { FINAL } from '../data/finalSurprise'
import { staggerParent } from '../animations/variants'

type CakePhase = 'idle' | 'lighting' | 'lit' | 'wished' | 'blowing' | 'done'

export default function Ch10FinalSurprise() {
  const { chapter, sfx, restart, reducedMotion, eggsFound, markCompleted } = useExperience()
  const [activeTab, setActiveTab] = useState<'cake' | 'letter' | 'wish'>('cake')
  
  // Cake State
  const [phase, setPhase] = useState<CakePhase>('idle')
  const [lit, setLit] = useState(0)
  const [hold, setHold] = useState(0)
  const [burst, setBurst] = useState(0)

  // Letter State
  const [letterOpen, setLetterOpen] = useState(false)

  const candles = useMemo(
    () =>
      Array.from({ length: CAKE.candles }, (_, i) => {
        const t = i / (CAKE.candles - 1)
        const angle = (-72 + t * 144) * (Math.PI / 180)
        return {
          id: i,
          left: 50 + Math.sin(angle) * 35,
          bottom: 104 + Math.cos(angle) * 11,
          tilt: Math.sin(angle) * 11,
        }
      }),
    [],
  )

  const light = () => {
    sfx('lit')
    setPhase('lighting')
    let n = 0
    const timer = window.setInterval(() => {
      n += 1
      setLit(n)
      if (n % 3 === 0) sfx('lit')
      if (n >= CAKE.candles) {
        window.clearInterval(timer)
        setPhase('lit')
        sfx('chime')
      }
    }, 72)
  }

  const startHold = () => {
    if (phase !== 'lit') return
    setHold(0)
    let p = 0
    const timer = window.setInterval(() => {
      p += 0.06
      setHold(Math.min(1, p))
      if (p >= 1) {
        window.clearInterval(timer)
        setPhase('wished')
        sfx('sparkle')
      }
    }, 90)
  }

  const release = () => {
    if (phase === 'lit') setHold(0)
  }

  const blow = () => {
    if (phase === 'done') {
      setBurst((b) => b + 1)
      sfx('win')
      return
    }
    if (phase !== 'wished' && phase !== 'lit') return
    sfx('whoosh')
    setPhase('blowing')
    let n = CAKE.candles
    const timer = window.setInterval(() => {
      n -= 2
      setLit(Math.max(0, n))
      if (n <= 0) {
        window.clearInterval(timer)
        setPhase('done')
        setBurst(1)
        sfx('win')
        markCompleted('finale')
      }
    }, 70)
  }

  const secrets = eggsFound.filter((id) => id !== 'secret').length

  return (
    <ChapterShell chapter={chapter} subtitle="Blow the candles, read the birthday letter, and claim the final surprise!" wide>
      <motion.div variants={staggerParent(0.09)} initial="hidden" animate="show" className="space-y-6">
        <PetalRain count={!reducedMotion ? 20 : 0} reduced={reducedMotion} />
        <Confetti fireKey={burst} reduced={reducedMotion} count={120} />

        {/* Tab switcher */}
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              sfx('tap')
              setActiveTab('cake')
            }}
            className={`tap rounded-full px-4 py-2 text-[0.78rem] font-bold transition backdrop-blur-md ${
              activeTab === 'cake' ? 'bg-rose text-white shadow-lift' : 'bg-white/10 border border-white/15 text-cream-50/80 hover:bg-white/20'
            }`}
          >
            🎂 1. Make a Wish
          </button>
          <button
            type="button"
            onClick={() => {
              sfx('tap')
              setActiveTab('letter')
            }}
            className={`tap rounded-full px-4 py-2 text-[0.78rem] font-bold transition backdrop-blur-md ${
              activeTab === 'letter' ? 'bg-rose text-white shadow-lift' : 'bg-white/10 border border-white/15 text-cream-50/80 hover:bg-white/20'
            }`}
          >
            ✉️ 2. The Letter
          </button>
          <button
            type="button"
            onClick={() => {
              sfx('tap')
              setActiveTab('wish')
            }}
            className={`tap rounded-full px-4 py-2 text-[0.78rem] font-bold transition backdrop-blur-md ${
              activeTab === 'wish' ? 'bg-rose text-white shadow-lift' : 'bg-white/10 border border-white/15 text-cream-50/80 hover:bg-white/20'
            }`}
          >
            ✨ 3. Final Wish
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'cake' ? (
            <motion.div
              key="cake"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-center"
            >
              <div className="relative mx-auto w-full max-w-md select-none">
                <div className="relative h-[210px]">
                  <div className="absolute inset-x-6 bottom-2 h-6 rounded-[50%] bg-ink/10 blur-[1px]" />
                  <div className="absolute bottom-6 left-1/2 h-24 w-64 -translate-x-1/2 rounded-t-[2rem] bg-gradient-to-b from-cream-100 to-peach shadow-lift">
                    <div className="absolute inset-x-0 top-0 h-6 rounded-t-[2rem] bg-white/85" />
                    <div className="absolute inset-x-0 top-5 flex justify-around px-3">
                      {Array.from({ length: 7 }, (_, i) => (
                        <span key={i} className="h-2 w-2 rounded-full bg-rose/70" />
                      ))}
                    </div>
                    <div className="absolute inset-x-4 bottom-3 flex justify-center gap-1.5 text-[0.8rem]">
                      {['🐼', '🍕', '☕', '🥟'].map((e) => (
                        <span key={e}>{e}</span>
                      ))}
                    </div>
                  </div>

                  {candles.map((c) => {
                    const isLit = c.id < lit
                    return (
                      <div
                        key={c.id}
                        className="absolute"
                        style={{
                          left: `${c.left}%`,
                          bottom: c.bottom,
                          transform: `translateX(-50%) rotate(${c.tilt}deg)`,
                        }}
                      >
                        {isLit ? (
                          <span
                            className={`mb-[1px] block h-2.5 w-[7px] ${reducedMotion ? '' : 'flame'}`}
                            style={{
                              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                              background:
                                'radial-gradient(circle at 50% 70%, #fff6d8 0%, #e8c27e 55%, #e8927c 100%)',
                              boxShadow: '0 0 8px rgba(232,194,126,0.75)',
                            }}
                          />
                        ) : (
                          <span className="mb-[1px] block h-2.5 w-[7px]">
                            <span className="mt-1 block h-1 w-1 rounded-full bg-ink/30" />
                          </span>
                        )}
                        <span className="block h-6 w-[5px] rounded-[2px] bg-gradient-to-b from-lavender-deep to-lavender" />
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 flex flex-col items-center gap-3">
                  {phase === 'idle' ? (
                    <button
                      type="button"
                      onClick={light}
                      className="tap inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[0.88rem] font-semibold text-cream-50 shadow-lift"
                    >
                      <Cake size={15} /> {CAKE.stepLight}
                    </button>
                  ) : null}

                  {phase === 'lit' ? (
                    <button
                      type="button"
                      onPointerDown={startHold}
                      onPointerUp={release}
                      onPointerLeave={release}
                      className="tap relative overflow-hidden rounded-full bg-rose px-6 py-3.5 text-[0.88rem] font-semibold text-white shadow-lift"
                    >
                      <span
                        className="absolute inset-y-0 left-0 bg-rose-deep/60"
                        style={{ width: `${hold * 100}%` }}
                      />
                      <span className="relative">{CAKE.stepWish}</span>
                    </button>
                  ) : null}

                  {phase === 'wished' ? (
                    <>
                      <p className="display text-[1.1rem] text-rose-deep">{CAKE.stepWishDone}</p>
                      <button
                        type="button"
                        onClick={blow}
                        className="tap inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[0.88rem] font-semibold text-cream-50 shadow-lift"
                      >
                        {CAKE.stepBlow}
                      </button>
                    </>
                  ) : null}

                  {phase === 'done' ? (
                    <div className="space-y-3">
                      <p className="hand text-2xl text-rose-deep">Happy 22nd Birthday Riddhi! 🎉</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('letter')}
                        className="tap rounded-full bg-ink px-5 py-2.5 text-[0.8rem] font-semibold text-cream-50"
                      >
                        Read your letter →
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'letter' ? (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto max-w-xl space-y-4"
            >
              <div className="rounded-2xl border border-cream-200 bg-cream-100 p-4 shadow-lift">
                <button
                  type="button"
                  onClick={() => setLetterOpen((v) => !v)}
                  className="tap flex w-full items-center justify-between gap-3 text-left"
                >
                  <span className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
                    <Mail size={13} />
                    {LETTER.greeting}
                  </span>
                  <span className="hand text-lg text-rose-deep">
                    {letterOpen ? 'fold it back' : LETTER.coverCta}
                  </span>
                </button>

                <AnimatePresence>
                  {letterOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="paper-grain rounded-xl bg-[#fffdf8] p-5 text-left shadow-soft">
                        <p className="hand text-2xl text-ink">{LETTER.greeting}</p>
                        <div className="mt-3 space-y-3">
                          {isPlaceholder(LETTER.body) ? (
                            <Placeholder label={LETTER.body} note="Written in src/data/letters.ts" />
                          ) : (
                            LETTER.body.split('\n\n').map((para, i) => (
                              <p key={i} className="text-[0.92rem] leading-relaxed text-ink/85">
                                {para}
                              </p>
                            ))
                          )}
                        </div>
                        <p className="hand mt-4 text-right text-2xl text-rose-deep">{LETTER.signature}</p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('wish')}
                  className="tap rounded-full bg-rose px-5 py-2.5 text-[0.8rem] font-bold text-white shadow-soft"
                >
                  See the final surprise →
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="wish"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center"
            >
              <PandaCharacter size={124} mood="cheering" floating label="A very pleased panda" />

              <h3 className="display text-[1.8rem] leading-[1.1] text-cream-50 sm:text-[2.6rem]">
                <RevealText text={FINAL.title} split="char" stagger={0.03} />
              </h3>

              {isPlaceholder(FINAL.personalLine) ? (
                <div className="mx-auto max-w-md">
                  <Placeholder label={FINAL.personalLine} note="Your last line in src/data/finalSurprise.ts" />
                </div>
              ) : (
                <p className="mx-auto max-w-lg text-[1.02rem] leading-relaxed text-cream-50/90">
                  {FINAL.personalLine}
                </p>
              )}

              <div className="mx-auto max-w-md space-y-4 rounded-card border border-white/15 bg-white/8 p-4 backdrop-blur-md">
                <p className="flex items-center justify-center gap-2 text-[0.78rem] text-gold">
                  <Sparkles size={13} />
                  Hidden things found: {secrets} of 6
                </p>
                <button
                  type="button"
                  onClick={() => {
                    sfx('tap')
                    restart()
                  }}
                  className="tap inline-flex items-center gap-2 rounded-full bg-rose px-5 py-3 text-[0.85rem] font-semibold text-white shadow-lift"
                >
                  <RotateCcw size={14} /> {FINAL.replay}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ChapterShell>
  )
}