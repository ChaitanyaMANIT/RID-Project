import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'

/**
 * The only navigation she ever needs: one obvious forward action, one quiet way
 * back. Always on screen, always reachable with a thumb, never in the way.
 */
export default function ChapterNavigation() {
  const { chapter, chapterIndex, chapterCount, next, prev, isFirst, isLast, restart, sfx } =
    useExperience()

  const forwardLabel = isLast ? 'Watch it all again' : `${chapter.nextLabel}`

  return (
    <>
      {/* Back */}
      {!isFirst ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            sfx('tap')
            prev()
          }}
          aria-label="Previous chapter"
          className="tap pointer-events-auto fixed left-4 top-4 z-40 grid h-10 w-10 place-items-center rounded-full border border-white/55 bg-white/70 text-ink-soft shadow-soft backdrop-blur-md transition hover:text-ink"
        >
          <ChevronLeft size={17} />
        </motion.button>
      ) : null}

      {/* Counter */}
      <div className="pointer-events-none fixed right-4 top-4 z-40 flex justify-end">
        <span className="rounded-full border border-white/50 bg-white/60 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider text-ink-soft backdrop-blur-md">
          {chapterIndex + 1} / {chapterCount}
        </span>
      </div>

      {/* Forward */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="pointer-events-none fixed bottom-[max(1.1rem,env(safe-area-inset-bottom))] right-4 z-40 flex justify-end"
        style={{ willChange: 'auto' }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sfx('whoosh')
            if (isLast) restart()
            else next()
          }}
          className="tap next-pill pointer-events-auto flex items-center gap-2 rounded-full px-5 py-3.5 text-[0.85rem] font-semibold transition hover:bg-[#3b312c]"
          style={{ color: '#fdf5ea', backgroundColor: '#221c18', WebkitFontSmoothing: 'antialiased' }}
        >
          {isLast ? <RotateCcw size={16} /> : null}
          <span className="max-w-[9.5rem] truncate">{forwardLabel}</span>
          {!isLast ? <ChevronRight size={16} /> : null}
        </motion.button>
      </motion.div>
    </>
  )
}