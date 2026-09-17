import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Sparkles, LockKeyhole } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'
import ChapterShell from '../components/ChapterShell'
import Envelope from '../components/Envelope'
import ConfessionCard from '../components/ConfessionCard'
import PandaCharacter from '../components/PandaCharacter'
import { CONFESSIONS, CONFESSIONS_LEAD } from '../data/confessions'
import { NICKNAMES } from '../data/riddhi'
import { fadeUp, staggerParent } from '../animations/variants'

export default function Ch6Confessions() {
  const { chapter, markCompleted, reducedMotion } = useExperience()
  const [openIds, setOpenIds] = useState<string[]>([])
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const toggle = (id: string, next: boolean) => {
    setOpenIds((prev) => {
      const updated = next ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
      if (next) markCompleted('confessions')
      return updated
    })
  }

  const allOpen = openIds.length === CONFESSIONS.length

  return (
    <ChapterShell chapter={chapter}>
      <motion.div variants={staggerParent(0.12)} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={fadeUp} className="text-center">
          <p className="display text-[1.5rem] text-ink sm:text-[1.9rem]">
            {CONFESSIONS_LEAD.chaos}
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            {CONFESSIONS_LEAD.intro}
          </p>
          <p className="mt-1 text-[0.78rem] text-ink-soft/70">{CONFESSIONS_LEAD.hint}</p>
        </motion.div>

        {!unlocked ? (
          <motion.div variants={fadeUp} className="mx-auto max-w-md rounded-card border border-rose/25 bg-white/65 p-6 text-center shadow-soft backdrop-blur-sm">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose/10 text-rose-deep">
              <LockKeyhole size={20} />
            </div>
            <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-rose-deep">
              Private chapter
            </p>
            <h3 className="display mt-2 text-[1.5rem] text-ink">Things I never say enough</h3>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">
              This one is locked. You know what to type. 😉
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const correct = password === 'pit-jaoge'
                setPasswordError(!correct)
                if (correct) {
                  setUnlocked(true)
                  markCompleted('confessions')
                } else {
                  setPasswordError(true)
                }
              }}
              className="mt-5 flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError(false)
                }}
                placeholder="Enter password"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border border-ink/10 bg-white px-4 py-3 text-[0.85rem] text-ink outline-none transition placeholder:text-ink-soft/45 focus:border-rose-deep focus:ring-2 focus:ring-rose/20"
              />
              <button type="submit" className="tap rounded-full bg-rose-deep px-5 py-3 text-[0.82rem] font-semibold text-white shadow-soft">
                Unlock
              </button>
            </form>
            {passwordError ? (
              <p className="mt-3 text-[0.75rem] font-semibold text-rose-deep">
                Wrong password. Try again. 😏
              </p>
            ) : null}
          </motion.div>
        ) : (
        <>
        <motion.div variants={fadeUp} className="space-y-3">
          {CONFESSIONS.map((confession, i) => (
            <Envelope
              key={confession.id}
              open={openIds.includes(confession.id)}
              onOpenChange={(next) => toggle(confession.id, next)}
              sealLabel={`${confession.kicker} — ${confession.title}`}
              tone={i % 2 === 0 ? 'cream' : 'sage'}
            >
              <ConfessionCard confession={confession} />
            </Envelope>
          ))}
        </motion.div>
        </>
        )}

        <AnimatePresence>
          {unlocked && allOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <PandaCharacter size={96} mood="shy" />
              <p className="display text-[1.2rem] text-ink">{CONFESSIONS_LEAD.allOpened}</p>
              <p className="max-w-sm text-[0.82rem] leading-relaxed text-ink-soft">
                And one more thing that is not an envelope, {NICKNAMES.primary}. It is the next
                chapter.
              </p>
            </motion.div>
          ) : unlocked ? (
            <motion.p
              variants={fadeUp}
              className="flex items-center justify-center gap-2 text-center text-[0.75rem] text-ink-soft/60"
            >
              <Mail size={12} />
              {openIds.length} of {CONFESSIONS.length} opened
            </motion.p>
          ) : null}
        </AnimatePresence>

        {!reducedMotion && !allOpen ? (
          <p className="flex items-center justify-center gap-1.5 text-center text-[0.68rem] text-ink-soft/50">
            <Sparkles size={11} /> The tone changes from here. That is on purpose.
          </p>
        ) : null}
      </motion.div>
    </ChapterShell>
  )
}