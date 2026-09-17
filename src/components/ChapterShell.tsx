import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { chapterVariants } from '../animations/variants'
import type { ChapterMeta } from '../data/chapters'

interface ChapterShellProps {
  chapter: ChapterMeta
  children: ReactNode
  /** Optional line shown under the title. */
  subtitle?: ReactNode
  /** Widens the reading column for game / gallery chapters. */
  wide?: boolean
}

/**
 * Every chapter is a full-screen beat, not a scroll target. The shell owns the
 * title, the cinematic in/out, and the safe padding for phones with notches.
 */
export default function ChapterShell({ chapter, children, subtitle, wide = false }: ChapterShellProps) {
  return (
    <motion.section
      key={chapter.id}
      variants={chapterVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className={`relative mx-auto flex min-h-[100dvh] w-full flex-col pb-36 pt-24 ${
        wide ? 'max-w-5xl' : 'max-w-3xl'
      } px-5 sm:px-8`}
      style={{ paddingTop: 'max(6rem, env(safe-area-inset-top))' }}
    >
      <header className="mb-7">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-current opacity-80">
          {chapter.eyebrow}
        </p>
        <h2 className="display crisp-text mt-2 text-balance text-[1.9rem] font-bold leading-[1.12] sm:text-[2.6rem]">
          {chapter.title}
        </h2>
        {subtitle ? (
          <div className="mt-3 max-w-xl text-[0.95rem] font-medium leading-relaxed text-current opacity-90">{subtitle}</div>
        ) : null}
      </header>

      <div className="flex-1">{children}</div>
    </motion.section>
  )
}