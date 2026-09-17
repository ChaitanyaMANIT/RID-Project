import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useExperience } from '../context/ExperienceContext'

interface EnvelopeProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Small label on the flap, e.g. "One". */
  sealLabel?: string
  children: ReactNode
  tone?: 'cream' | 'sage'
}

/**
 * A physical envelope that opens on tap.
 *
 * Deliberately lip-only when closed: the flap lifts, the card rises out, and the
 * writing is revealed — so opening five of these never feels like filling a form.
 */
export default function Envelope({
  open,
  onOpenChange,
  sealLabel,
  children,
  tone = 'cream',
}: EnvelopeProps) {
  const { sfx, reducedMotion } = useExperience()
  const body = tone === 'sage' ? '#eef2ea' : '#fdf5ea'
  const edge = tone === 'sage' ? '#c9d6c1' : '#f0dfc8'

  return (
    <div className="w-full" style={{ perspective: 1400 }}>
      <div className="relative w-full">
        <div
          className="relative overflow-hidden rounded-2xl border shadow-soft"
          style={{ background: body, borderColor: edge }}
        >
          {/* The letter. Render the content when open rather than animating the
              wrapper to height:auto. The latter can leave the envelope showing
              "close" while the letter itself remains at zero height. */}
          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                key="letter"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
              >
                <div className="px-4 pb-5 pt-5 sm:px-6">{children}</div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* the envelope front, always visible */}
          <div className="relative px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => {
                sfx(open ? 'tap' : 'whoosh')
                onOpenChange(!open)
              }}
              aria-expanded={open}
              className="tap flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink-soft">
                {sealLabel}
              </span>
              <span className="hand text-lg text-rose-deep">{open ? 'close' : 'open me'}</span>
            </button>

            {/* flap */}
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={{ rotateX: open ? -172 : 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                background: `linear-gradient(180deg, ${edge} 0%, ${body} 100%)`,
              }}
              className="pointer-events-none absolute inset-x-0 top-0 h-10 rounded-t-2xl border-b"
            />
          </div>
        </div>
      </div>
    </div>
  )
}