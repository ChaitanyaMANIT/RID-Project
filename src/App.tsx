import { useEffect, useRef } from 'react'
import type { ComponentType } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ExperienceProvider, useExperience } from './context/ExperienceContext'
import BirthdayIntro from './components/BirthdayIntro'
import ChapterNavigation from './components/ChapterNavigation'
import ProgressDots from './components/ProgressDots'
import MusicPlayer from './components/MusicPlayer'
import EasterEggLayer from './components/EasterEgg'
import PlaceholderAudit from './components/PlaceholderAudit'
import PetalRain from './components/PetalRain'
import Sparkles from './components/Sparkles'
import FloatingDecor from './components/FloatingDecor'
import RibbonOverlay from './components/RibbonOverlay'
import Ch2StarterPack from './pages/Ch2StarterPack'
import Ch3GameCenter from './pages/Ch3GameCenter'
import Ch4JungleTrail from './pages/Ch4JungleTrail'
import Ch5Scrapbook from './pages/Ch5Scrapbook'
import Ch6Confessions from './pages/Ch6Confessions'
import Ch10FinalSurprise from './pages/Ch10FinalSurprise'
import type { ChapterId } from './data/chapters'

/** Chapter id → page mapping for the 6 chapters. */
const PAGES: Record<ChapterId, ComponentType> = {
  starter: Ch2StarterPack,
  game: Ch3GameCenter,
  jungle: Ch4JungleTrail,
  scrapbook: Ch5Scrapbook,
  confessions: Ch6Confessions,
  finale: Ch10FinalSurprise,
}

export default function App() {
  return (
    <ExperienceProvider>
      <Experience />
    </ExperienceProvider>
  )
}

function Experience() {
  const {
    stage,
    chapter,
    chapterIndex,
    chapterCount,
    next,
    prev,
    swipeLocked,
    reducedMotion,
    music,
    fireEgg,
  } = useExperience()

  const audit =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('audit')

  /* Music starts on cover/reveal and updates with chapter */
  const play = music.play
  useEffect(() => {
    if (stage === 'cover' || stage === 'reveal') {
      play('birthday')
    } else if (stage === 'journey') {
      play(chapter.music)
    }
  }, [stage, chapter.music, play])

  /* Arrow keys, for anyone on a laptop. */
  useEffect(() => {
    if (stage !== 'journey') return
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stage, next, prev])

  /* Horizontal swipes. Locked while a game is being played. */
  const start = useRef<{ x: number; y: number } | null>(null)
  useEffect(() => {
    if (stage !== 'journey' || swipeLocked) return
    const onDown = (e: PointerEvent) => {
      start.current = { x: e.clientX, y: e.clientY }
    }
    const onUp = (e: PointerEvent) => {
      const from = start.current
      start.current = null
      if (!from) return
      const dx = e.clientX - from.x
      const dy = e.clientY - from.y
      if (Math.abs(dx) < 72 || Math.abs(dy) > 56) return
      if (dx < 0) next()
      else if (chapterIndex > 0) prev()
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [stage, swipeLocked, next, prev, chapterIndex])

  /* Typing `bhalu` summons pandas. Phones get the same egg by tapping the panda nine times. */
  useEffect(() => {
    let buffer = ''
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-12)
      if (buffer.includes('bhalu')) {
        buffer = ''
        fireEgg('bhalu')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fireEgg])

  /* ---------------- the prologue ---------------- */
  if (stage !== 'journey') {
    return (
      <div data-mood="night" className="mood-surface relative min-h-[100dvh]">
        <RibbonOverlay />
        <BirthdayIntro />
        <MusicPlayer />
        <EasterEggLayer />
      </div>
    )
  }

  const Page = PAGES[chapter.id]
  const calm = chapter.mood === 'calm'

  return (
    <div data-mood={chapter.mood} className="mood-surface relative min-h-[100dvh]">
      <RibbonOverlay />
      <PetalRain
        key={`petals-${chapter.id}`}
        count={reducedMotion ? 0 : calm ? 10 : 20}
        reduced={reducedMotion}
      />
      <Sparkles count={reducedMotion ? 0 : calm ? 8 : 14} reduced={reducedMotion} />
      <FloatingDecor />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center pt-[max(0.65rem,env(safe-area-inset-top))]">
        <ProgressDots />
      </div>

      <AnimatePresence mode="wait">
        <Page key={chapter.id} />
      </AnimatePresence>

      <ChapterNavigation />

      <div className="pointer-events-none fixed bottom-0 left-0 z-40 pl-[max(1rem,env(safe-area-inset-left))]">
        <span className="sr-only">
          Chapter {chapterIndex + 1} of {chapterCount}
        </span>
      </div>

      <MusicPlayer />
      <EasterEggLayer />
      {audit ? <PlaceholderAudit /> : null}
    </div>
  )
}