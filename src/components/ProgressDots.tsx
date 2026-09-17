import { motion } from 'framer-motion'
import { useExperience } from '../context/ExperienceContext'

/**
 * The eleven dots at the top.
 *
 * They exist so she always knows how close the end is — the single biggest
 * reason people abandon a long interactive page is not knowing the length.
 * Tap any dot to jump back to a chapter she liked.
 */
export default function ProgressDots() {
  const { chapters, chapterIndex, goTo, sfx, completed } = useExperience()

  return (
    <nav aria-label="Chapters" className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/55 bg-white/70 px-2.5 py-2 shadow-soft backdrop-blur-md">
      {chapters.map((c, i) => {
        const active = i === chapterIndex
        const done = completed[c.id] === true || i < chapterIndex
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              sfx('tap')
              goTo(i)
            }}
            aria-label={`Chapter ${c.no}: ${c.title}`}
            aria-current={active ? 'step' : undefined}
            title={`${c.no}. ${c.title}`}
            className="group grid h-6 w-4 place-items-center"
          >
            <motion.span
              layout
              className="block rounded-full"
              animate={{
                width: active ? 18 : 7,
                height: 7,
                opacity: active ? 1 : done ? 0.75 : 0.42,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              style={{
                background: active ? 'var(--mood-accent, #e8927c)' : '#7a6a63',
              }}
            />
          </button>
        )
      })}
    </nav>
  )
}