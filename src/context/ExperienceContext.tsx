import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { CHAPTERS, CHAPTER_COUNT, chapterAt } from '../data/chapters'
import type { ChapterId, ChapterMeta } from '../data/chapters'
import { useMusic } from '../hooks/useMusic'
import type { MusicController } from '../hooks/useMusic'
import { unlockAudio, useSfx } from '../hooks/useSfx'
import type { SfxName } from '../hooks/useSfx'
import { usePersistentState } from '../hooks/usePersistentState'

/** cover → reveal (the prologue) → journey (the ten chapters). */
export type Stage = 'cover' | 'reveal' | 'journey'

export type EggId =
  | 'suno'
  | 'pit-jaoge'
  | 'bas-karo'
  | 'dont-click'
  | 'bhalu'
  | 'confetti-22'
  | 'secret'

export type GameId = 'rescue' | 'feed' | 'quiz'

export interface EggEvent {
  id: EggId
  text?: string
  nonce: number
}

interface Persisted {
  chapterIndex: number
  completed: Record<string, boolean>
  eggsFound: string[]
  foodMeter: number
  best: Record<string, number>
}

const STORAGE_KEY = 'rid-bday-v1'
const EMPTY: Persisted = {
  chapterIndex: 0,
  completed: {},
  eggsFound: [],
  foodMeter: 0,
  best: {},
}

export interface ExperienceValue {
  /** Prologue control. */
  stage: Stage
  beginReveal: (resume: boolean) => void
  startJourney: () => void
  restart: () => void
  hasProgress: boolean
  continueChapterNo: number

  /** Chapter navigation. */
  chapterIndex: number
  chapter: ChapterMeta
  chapters: ChapterMeta[]
  chapterCount: number
  goTo: (index: number) => void
  next: () => void
  prev: () => void
  isFirst: boolean
  isLast: boolean

  /** Progress + interactions. */
  completed: Record<string, boolean>
  markCompleted: (id: ChapterId | GameId) => void
  isComplete: (id: ChapterId | GameId) => boolean

  /** Games lock horizontal swiping while they are being played. */
  swipeLocked: boolean
  setSwipeLocked: (locked: boolean) => void

  /** Audio. */
  music: MusicController
  sfx: (name: SfxName) => void
  unlock: () => void

  /** Easter eggs. */
  egg: EggEvent | null
  fireEgg: (id: EggId, text?: string) => void
  clearEgg: () => void
  eggsFound: string[]
  eggsFoundCount: number

  /** The recurring panda. */
  pandaTaps: number
  tapPanda: () => number

  /** Running food joke, shared across the two arcade games. */
  foodMeter: number
  addFood: (amount: number) => void
  best: Record<string, number>
  recordScore: (game: GameId, score: number) => void

  reducedMotion: boolean
}

const Ctx = createContext<ExperienceValue | null>(null)

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [store, setStore, resetStore] = usePersistentState<Persisted>(STORAGE_KEY, EMPTY)
  const [stage, setStage] = useState<Stage>('cover')
  const [swipeLocked, setSwipeLockedState] = useState(false)
  const [egg, setEgg] = useState<EggEvent | null>(null)
  const [pandaTaps, setPandaTaps] = useState(0)
  const pandaTapsRef = useRef(0)
  const nonceRef = useRef(0)

  const reducedMotion = useReducedMotion() ?? false
  const sfx = useSfx()
  const music = useMusic()

  const chapterIndex = Math.min(Math.max(store.chapterIndex, 0), CHAPTER_COUNT - 1)
  const chapter = chapterAt(chapterIndex)
  const isFirst = chapterIndex === 0
  const isLast = chapterIndex === CHAPTER_COUNT - 1
  const hasProgress = store.chapterIndex > 0 || Object.keys(store.completed).length > 0
  const continueChapterNo = chapterAt(store.chapterIndex).no

  const unlock = useCallback(() => {
    unlockAudio()
    sfx('sparkle')
  }, [sfx])

  const beginReveal = useCallback(
    (resume: boolean) => {
      setStage('reveal')
      // A fresh run always starts from Chapter One; resuming keeps the bookmark.
      if (!resume) setStore((s) => ({ ...s, chapterIndex: 0 }))
    },
    [setStore],
  )

  const startJourney = useCallback(() => setStage('journey'), [])

  const restart = useCallback(() => {
    resetStore()
    setStore((s) => ({ ...EMPTY, eggsFound: s.eggsFound, best: s.best }))
    pandaTapsRef.current = 0
    setPandaTaps(0)
    setEgg(null)
    setStage('cover')
  }, [resetStore, setStore])

  const goTo = useCallback(
    (index: number) => {
      setStore((s) => ({
        ...s,
        chapterIndex: Math.min(Math.max(index, 0), CHAPTER_COUNT - 1),
      }))
      setEgg(null)
    },
    [setStore],
  )

  const next = useCallback(() => {
    setStore((s) => ({ ...s, chapterIndex: Math.min(s.chapterIndex + 1, CHAPTER_COUNT - 1) }))
  }, [setStore])

  const prev = useCallback(() => {
    setStore((s) => ({ ...s, chapterIndex: Math.max(s.chapterIndex - 1, 0) }))
  }, [setStore])

  const markCompleted = useCallback(
    (id: ChapterId | GameId) => {
      setStore((s) =>
        s.completed[id] ? s : { ...s, completed: { ...s.completed, [id]: true } },
      )
    },
    [setStore],
  )

  const isComplete = useCallback(
    (id: ChapterId | GameId) => Boolean(store.completed[id]),
    [store.completed],
  )

  const setSwipeLocked = useCallback((locked: boolean) => setSwipeLockedState(locked), [])

  const fireEgg = useCallback(
    (id: EggId, text?: string) => {
      nonceRef.current += 1
      setEgg({ id, text, nonce: nonceRef.current })
      setStore((s) =>
        s.eggsFound.includes(id) ? s : { ...s, eggsFound: [...s.eggsFound, id] },
      )
      if (id === 'pit-jaoge') sfx('slap')
      else if (id === 'suno') sfx('whoosh')
      else if (id === 'confetti-22') sfx('win')
      else sfx('pop')
    },
    [setStore, sfx],
  )

  const clearEgg = useCallback(() => setEgg(null), [])

  const tapPanda = useCallback(() => {
    pandaTapsRef.current += 1
    setPandaTaps(pandaTapsRef.current)
    return pandaTapsRef.current
  }, [])

  const addFood = useCallback(
    (amount: number) => {
      setStore((s) => ({
        ...s,
        foodMeter: Math.max(0, Math.min(100, Math.round(s.foodMeter + amount))),
      }))
    },
    [setStore],
  )

  const recordScore = useCallback(
    (game: GameId, score: number) => {
      setStore((s) =>
        (s.best[game] ?? 0) >= score ? s : { ...s, best: { ...s.best, [game]: score } },
      )
    },
    [setStore],
  )

  const value = useMemo<ExperienceValue>(
    () => ({
      stage,
      beginReveal,
      startJourney,
      restart,
      hasProgress,
      continueChapterNo,
      chapterIndex,
      chapter,
      chapters: CHAPTERS,
      chapterCount: CHAPTER_COUNT,
      goTo,
      next,
      prev,
      isFirst,
      isLast,
      completed: store.completed,
      markCompleted,
      isComplete,
      swipeLocked,
      setSwipeLocked,
      music,
      sfx,
      unlock,
      egg,
      fireEgg,
      clearEgg,
      eggsFound: store.eggsFound,
      eggsFoundCount: store.eggsFound.length,
      pandaTaps,
      tapPanda,
      foodMeter: store.foodMeter,
      addFood,
      best: store.best,
      recordScore,
      reducedMotion,
    }),
    [
      stage,
      beginReveal,
      startJourney,
      restart,
      hasProgress,
      continueChapterNo,
      chapterIndex,
      chapter,
      goTo,
      next,
      prev,
      isFirst,
      isLast,
      store.completed,
      store.eggsFound,
      store.foodMeter,
      store.best,
      markCompleted,
      isComplete,
      swipeLocked,
      setSwipeLocked,
      music,
      sfx,
      unlock,
      egg,
      fireEgg,
      clearEgg,
      pandaTaps,
      tapPanda,
      addFood,
      recordScore,
      reducedMotion,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useExperience(): ExperienceValue {
  const value = useContext(Ctx)
  if (!value) throw new Error('useExperience() must be used inside <ExperienceProvider>')
  return value
}