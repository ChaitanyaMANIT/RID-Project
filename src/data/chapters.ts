export type ChapterId =
  | 'starter'
  | 'game'
  | 'jungle'
  | 'scrapbook'
  | 'confessions'
  | 'finale'

export type Mood = 'warm' | 'playful' | 'calm' | 'celebration' | 'night'
export type MusicKey = 'birthday' | 'relatable' | 'finale'

export interface ChapterMeta {
  id: ChapterId
  no: number
  /** Tiny kicker above the title. */
  eyebrow: string
  title: string
  /** Shown on the "next" affordance and in the dot tooltips. */
  nextLabel: string
  mood: Mood
  music: MusicKey
}

/**
 * The journey, in 6 vibrant chapters.
 */
export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'starter',
    no: 1,
    eyebrow: 'Chapter One',
    title: 'The Riddhi Starter Pack',
    nextLabel: 'Rescue Simran',
    mood: 'playful',
    music: 'birthday',
  },
  {
    id: 'game',
    no: 2,
    eyebrow: 'Chapter Two',
    title: 'Rescue Simran Mini-Game',
    nextLabel: 'Jungle Trail',
    mood: 'night',
    music: 'relatable',
  },
  {
    id: 'jungle',
    no: 3,
    eyebrow: 'Chapter Three',
    title: 'The Jungle Trail Incident',
    nextLabel: 'Memories & Lessons',
    mood: 'playful',
    music: 'relatable',
  },
  {
    id: 'scrapbook',
    no: 4,
    eyebrow: 'Chapter Four',
    title: 'Memories & Lessons',
    nextLabel: 'Things I Never Say',
    mood: 'warm',
    music: 'birthday',
  },
  {
    id: 'confessions',
    no: 5,
    eyebrow: 'Chapter Five',
    title: 'Things I Never Say Enough',
    nextLabel: 'Make a Wish',
    mood: 'warm',
    music: 'birthday',
  },
  {
    id: 'finale',
    no: 6,
    eyebrow: 'Chapter Six',
    title: 'Make a Wish & Finale',
    nextLabel: 'Watch Again',
    mood: 'celebration',
    music: 'finale',
  },
]

export const CHAPTER_COUNT = CHAPTERS.length

export function chapterAt(index: number): ChapterMeta {
  return CHAPTERS[Math.min(Math.max(index, 0), CHAPTER_COUNT - 1)]
}

export function chapterIndexById(id: ChapterId): number {
  const i = CHAPTERS.findIndex((c) => c.id === id)
  return i < 0 ? 0 : i
}

