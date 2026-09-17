/**
 * Voice lines, split by who is talking. Fictional UI dialogue only — the real
 * quotes here are the ones Chaitanya actually reported.
 */

export const VOICE = {
  // --- Real phrases -------------------------------------------------
  suno: 'sunoOOOOOOOOOO',
  sunoLong: 'SUNOOOOOOOOOOOOOOOO!',
  thikHoNaa: 'Aap thik ho naa?',
  pakka: 'Pakka thik ho naa?',
  promise: 'Promise?',
  pitJaoge: 'PIT JAOGE.',
  pitJaogeSoft: 'Pit jaoge.',

  // --- Game cast ----------------------------------------------------
  simranAskedToMove: 'You guys can sit here only.',
  simranRescued: 'SIMRAN RESCUED 🫡',
  simranProtected: 'Riddhi has successfully protected her people.',
  simranGrateful: 'Simran says: told you to sit here only. 🐼',

  warningBanner: 'You have been warned.',
  villainTaunt: 'I’m just joking!',
} as const

/** Escalating panda reactions. Tap the panda 5 times and find out. */
export const PANDA_TAP_LINES: string[] = [
  '...',
  'Hello, Rid bro.',
  'You again.',
  'This is clicking, not friendship.',
  'Bas karo.',
  'Bas. Karo.',
  'I have a dummy panda at home and even he is tired.',
]

/** Things the panda mutters to itself between chapters. */
export const PANDA_IDLE_LINES: string[] = [
  'Thik ho naa?',
  'Eat something.',
  'Pit jaoge.',
  'Rid bro.',
  'sunoOOOO',
]

export const SIMRAN_TEASE_LINES: string[] = [
  'Simran is telling a story. Riddhi is already reaching for the back of my head.',
  'Riddhi is watching. Riddhi is always watching.',
]

export const MONSTER_TEASES: string[] = [
  'Chaitanya (monster form): "Simran, suno na… one more joke!"',
  'Simran: "Riddhi, bachao! He will not stop!"',
  'Chaitanya (monster form): "Nobody leaves until they laugh!"',
  'Riddhi: "Hold my cold coffee. I am coming, Simran!"',
]

export const GAME_COPY = {
  rescue: {
    title: 'Rescue Simran',
    tagline: 'Main quest',
    intro: 'Chaitanya has turned into a joke monster and trapped Simran. Riddhi has to run, jump and bonk him!',
    howTo: [
      'Tap ▶ to run right, ◀ to run left, or drag Riddhi.',
      'Press JUMP (or ↑ / Space) to hop over gaps and spikes.',
      'Grab 🍕 and 🐼 for points. Stomp or touch the monster to bonk him.',
      'Reach Simran’s cage at the end to rescue her!',
    ],
    win: 'SIMRAN RESCUED 🫡',
    winSub: 'Riddhi bonked the monster. Chaitanya is normal again. Simran is free!',
    lose: 'Simran is still hearing jokes…',
    loseSub: 'Run it again. You know she won’t stop until it’s done.',
  },
  feed: {
    title: 'Feed the Panda',
    tagline: 'Side quest',
    intro: 'Food falls. Panda waits. This is the easiest job you will ever have.',
    howTo: [
      'Drag to move the panda.',
      'Catch everything edible.',
      'Chain catches for a combo multiplier.',
      '45 seconds. That’s all.',
    ],
    win: 'Panda fed.',
    winSub: 'Riddhi would approve.',
  },
  quiz: {
    title: 'How well do you know Riddhi?',
    tagline: 'Bonus round',
    intro: 'Five questions. All of them real. No pressure, Rid bro.',
    lowScore: 'Simran knows more than you. This is a serious problem.',
    midScore: 'Solid. Not Simran-level, but solid.',
    highScore: 'Okay. You actually listen to her. Respect.',
  },
} as const
