/**
 * Facts and phrases taken directly from Chaitanya's brief.
 *
 * Only the short blurbs below are drafted copy (describing traits that were
 * already stated). Nothing here invents a memory, event or feeling.
 */

export const RIDDHI = {
  name: 'Riddhi',
  age: 22,
  college: 'Banasthali Vidyapith',
  authorCollege: 'MANIT Bhopal',
  program: 'Samsung internship',
  programLength: '6 months',
  programCity: 'Delhi',
  hotel: 'Radisson Hotel',
  /** Her person. Appears in the origin chapter and again in the game. */
  bestFriend: 'Simran',
} as const

export const NICKNAMES = {
  primary: 'Rid bro',
  alt: 'Bhalu',
} as const

export type StarterKind = 'plain' | 'overthinking' | 'panda'

export interface StarterItem {
  id: string
  emoji: string
  title: string
  blurb: string
  kind: StarterKind
}

/** Chapter 2 — the starter pack. Tap a tile, get a line. */
export const STARTER_PACK: StarterItem[] = [
  {
    id: 'panda',
    emoji: '🐼',
    title: 'Panda',
    blurb: 'Mujhe Panda bohot pasand hai. Kisine kuch kiyaa to dekhnaa 😠🐼',
    kind: 'panda',
  },
  {
    id: 'food',
    emoji: '🍕',
    title: 'Food',
    blurb: 'Khaanaaaaaa yayyyyy 😋🍕 Kahin bhi aur kabhibhi.',
    kind: 'plain',
  },
  {
    id: 'coffee',
    emoji: '☕',
    title: 'Cold Coffee',
    blurb: 'Cold coffee? Bas milni chahiye. Kabhi bhi, kahin bhi. ☕😋',
    kind: 'plain',
  },
  {
    id: 'games',
    emoji: '📱',
    title: 'Casual Games',
    blurb: 'Will deny playing them. Will also be on level 40.',
    kind: 'plain',
  },
  {
    id: 'shopping',
    emoji: '🛍️',
    title: 'Shopping',
    blurb: 'Goes in for one thing. Comes out with a bag and a story.',
    kind: 'plain',
  },
  {
    id: 'music',
    emoji: '🎵',
    title: 'Music',
    blurb: 'Always something playing. Always.',
    kind: 'plain',
  },
  {
    id: 'creative',
    emoji: '🎨',
    title: 'Creativity',
    blurb: 'Made Ganesh Ji out of clay. Painted a whole pot by hand. Casual.',
    kind: 'plain',
  },
  {
    id: 'jokes',
    emoji: '😂',
    title: 'Bad jokes',
    blurb: 'Some are honestly funnier than mine. I am not happy about it.',
    kind: 'plain',
  },
  {
    id: 'overthinking',
    emoji: '💭',
    title: 'Overthinking',
    blurb: 'Hold on. This one has a warning label.',
    kind: 'overthinking',
  },
]

export const TRAITS = [
  'Down-to-earth',
  'Caring',
  'Empathetic',
  'Protective',
  'Creative',
  'Sometimes lazy',
  'An overthinker',
  'A huge food lover',
] as const

/** Shown after the overthinking tile floods the screen. */
export const OVERTHINKING_END = 'Riddhi, breathe. 🐼'

/** Chapter 2 footer — the trap button. Escalates on every press. */
export const DONT_CLICK_LINES: string[] = [
  'I said don’t.',
  'Okay, you’re the reason I made this button.',
  'This button does nothing. It was a trap for you specifically.',
  'You’ve clicked it more times than Simran replies to my memes.',
  'Fine. Panda is watching you now.',
]
