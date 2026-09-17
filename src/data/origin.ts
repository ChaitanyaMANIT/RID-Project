import { RIDDHI } from './riddhi'
import { VOICE } from './cast'

/**
 * Chapter 1 — how it all started.
 *
 * The real story: you are from MANIT Bhopal, she is from Banasthali Vidyapith,
 * you were both selected for a 6-month Samsung internship and stayed at the
 * Radisson Hotel in Delhi with the other interns. One dinner, almost every seat
 * was taken; the only table left was the circular one where she and Simran were
 * sitting. Five of you went over to ask them to move, and Simran said
 * "You guys can sit here only." So you sat. A week or two later the four of you
 * — you, Govinda, Riddhi, Simran — went for a movie.
 */

export const ORIGIN = {
  eyebrow: 'Chapter One',
  title: 'How it all started',

  card: {
    heading: 'Somewhere between two colleges and one internship',
    authorSide: `Me — ${RIDDHI.authorCollege}`,
    herSide: `${RIDDHI.name} — ${RIDDHI.college}`,
    program: `${RIDDHI.program} → ${RIDDHI.programLength}, ${RIDDHI.programCity}`,
    stay: `${RIDDHI.hotel}, along with the other interns`,
  },

  scene: {
    heading: 'One dinner',
    line: 'Almost every seat was taken. One circular table was left — and it was already taken.',
    seatedLabel: `${RIDDHI.name} and ${RIDDHI.bestFriend}`,
    usLabel: 'Us. Five of us, standing there.',
    askCta: 'Can we sit here?',
    askHint: 'Tap to ask.',
  },

  simran: {
    speaker: RIDDHI.bestFriend,
    line: VOICE.simranAskedToMove,
    aside: 'We asked if they could move. This was the answer.',
  },

  unlock: {
    word: 'Friendship unlocked 🔓',
    sub: 'So we sat down. We talked about our colleges, our lives, and everything in between.',
  },

  movie: {
    lead: 'And then, one movie later…',
    cta: 'Roll it',
    caption: 'Four of us. One movie. That is where the friendship really started.',
    cast: ['Me', 'Govinda', RIDDHI.name, RIDDHI.bestFriend],
  },

  conclusion: 'And somehow… these strangers became best friends.',

  /** Real, straight from your brief. */
  today: [
    'Today, Riddhi is one of my closest friends.',
    'We support each other emotionally. She listens to my problems, tries to understand what I am feeling, empathises with me, and gives me genuine advice.',
    'I do the same for her.',
  ],

  nextHint: 'Next up: what you are actually made of.',
} as const