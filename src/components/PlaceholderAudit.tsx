import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, RotateCcw, X } from 'lucide-react'
import { isPlaceholder } from './Placeholder'
import { CONFESSIONS } from '../data/confessions'
import { TAUGHT } from '../data/taught'
import { LETTER } from '../data/letters'
import { MEMORIES } from '../data/memories'
import { JUNGLE } from '../data/jungleTrail'
import { CAKE } from '../data/cake'
import { FINAL } from '../data/finalSurprise'
import { TRACKS, TRACK_ORDER } from '../data/music'
import { assetExists } from '../data/assets'
import { useExperience } from '../context/ExperienceContext'

interface AuditItem {
  where: string
  what: string
}

function collectPlaceholders(): AuditItem[] {
  const items: AuditItem[] = []
  const add = (where: string, what: string | undefined) => {
    if (isPlaceholder(what)) items.push({ where, what: what as string })
  }

  CONFESSIONS.forEach((c) => {
    add('data/confessions.ts', c.body)
    add('data/confessions.ts', c.footer)
  })
  add('data/taught.ts', TAUGHT.realisation)
  add('data/taught.ts', TAUGHT.checkIn.note)
  add('data/taught.ts', TAUGHT.closing)
  MEMORIES.forEach((m) => add('data/memories.ts', m.caption))
  add('data/letters.ts', LETTER.body)
  add('data/letters.ts', LETTER.signOff)
  add('data/letters.ts', LETTER.ps)
  JUNGLE.photoCaptions.forEach((c) => add('data/jungleTrail.ts', c))
  CAKE.lines.forEach((l) => add('data/cake.ts', l))
  add('data/finalSurprise.ts', FINAL.personalLine)

  return items
}

/**
 * Chaitanya's own tool. Only appears with `?audit=1` in the URL.
 *
 * It lists every un-written placeholder and every missing asset so nothing ships
 * by accident as a `[WRITE LETTER]` card — and it can reset saved progress while
 * you are testing.
 */
export default function PlaceholderAudit() {
  const { restart, chapterIndex, goTo } = useExperience()
  const [open, setOpen] = useState(false)
  const [missing, setMissing] = useState<string[]>([])
  const [checked, setChecked] = useState(false)

  const run = useCallback(async () => {
    const targets: string[] = [
      ...TRACK_ORDER.map((k) => TRACKS[k].src),
      ...MEMORIES.map((m) => m.src),
      ...JUNGLE.photos,
    ]
    const results = await Promise.all(targets.map(async (t) => ((await assetExists(t)) ? null : t)))
    setMissing(results.filter((r): r is string => r !== null))
    setChecked(true)
  }, [])

  useEffect(() => {
    void run()
  }, [run])

  const placeholders = collectPlaceholders()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open the placeholder audit"
        className="tap fixed left-1/2 top-4 z-[80] -translate-x-1/2 rounded-full border border-gold/50 bg-night/85 px-3 py-1.5 text-[0.65rem] font-semibold tracking-wider text-gold backdrop-blur"
      >
        AUDIT
      </button>

      <AnimatePresence>
        {open ? (
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed inset-x-3 bottom-3 z-[81] max-h-[70vh] overflow-y-auto rounded-2xl border border-white/15 bg-night/96 p-4 text-cream-50 shadow-lift backdrop-blur"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Before you send it
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close audit"
                className="tap grid h-8 w-8 place-items-center rounded-full text-cream-50/70 hover:bg-white/10"
              >
                <X size={15} />
              </button>
            </div>
            <section className="mb-4">
              <h4 className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-cream-50/60">
                Still to write ({placeholders.length})
              </h4>
              {placeholders.length === 0 ? (
                <p className="text-[0.78rem] text-sage">Nothing left. All your words are in. 🐼</p>
              ) : (
                <ul className="space-y-1">
                  {placeholders.map((p, i) => (
                    <li key={`${p.where}-${i}`} className="flex gap-2 text-[0.75rem] leading-snug">
                      <span className="shrink-0 font-mono text-gold">{p.what}</span>
                      <span className="text-cream-50/60">{p.where}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mb-4">
              <h4 className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-cream-50/60">
                Missing files ({missing.length})
              </h4>
              {!checked ? (
                <p className="text-[0.78rem] text-cream-50/50">Checking…</p>
              ) : missing.length === 0 ? (
                <p className="text-[0.78rem] text-sage">All assets found.</p>
              ) : (
                <ul className="space-y-1">
                  {missing.map((m) => (
                    <li key={m} className="break-all font-mono text-[0.7rem] text-rose">
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mb-4">
              <h4 className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-cream-50/60">
                Jump to chapter
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 10 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`h-8 w-8 rounded-lg text-[0.7rem] font-semibold ${
                      chapterIndex === i ? 'bg-gold text-night' : 'bg-white/10 text-cream-50/80'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={restart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose px-3 py-2.5 text-[0.78rem] font-semibold text-white"
            >
              <RotateCcw size={14} /> Reset progress to the very beginning
            </button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[0.68rem] text-cream-50/40">
              <Eye size={11} /> Only visible with ?audit=1 in the URL
            </p>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  )
}