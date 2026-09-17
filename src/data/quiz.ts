import { RIDDHI, NICKNAMES } from './riddhi'
import { VOICE } from './cast'

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  /** Index into `options`. */
  answer: number
  /** Shown when she/he picks correctly. */
  right: string
  /** Shown for the wrong pick, per option index. */
  wrong: Record<number, string>
}

/**
 * Built ONLY from facts Chaitanya gave about Riddhi.
 * Edit freely — the quiz is fully data-driven.
 */
export const QUIZ: QuizQuestion[] = [
  {
    id: 'animal',
    prompt: `What is ${RIDDHI.name}'s favourite animal?`,
    options: ['Cats', 'Panda', 'Dogs', 'Penguins'],
    answer: 1,
    right: 'Correct. And there is a dummy panda involved. It is serious.',
    wrong: {
      0: 'Cats? Rid bro, she owns a panda. A dummy one. This was the free question.',
      2: 'Dogs are great. Wrong animal. Try the furry one that is black and white.',
      3: 'Penguins. Genuinely creative guess. Still wrong.',
    },
  },
  {
    id: 'met',
    prompt: 'Where did the two of us actually first meet?',
    options: [
      'A college fest',
      'The Radisson Hotel in Delhi, at dinner',
      'A Samsung review meeting',
      'Instagram DMs',
    ],
    answer: 1,
    right: 'Yes. One circular table, one "you guys can sit here only."',
    wrong: {
      0: 'No fest. Try a hotel, at dinner, with almost every seat taken.',
      2: 'Nope. We did not meet in a meeting. We met at dinner.',
      3: 'We did not meet on Instagram. We met in person, awkwardly.',
    },
  },
  {
    id: 'internship',
    prompt: 'How long was the Samsung internship we both got selected for?',
    options: ['2 months', '6 months', '1 year', '3 weeks'],
    answer: 1,
    right: 'Six months. Enough time for all of this to happen.',
    wrong: {
      0: 'Two months was not enough time to become this annoying to each other.',
      2: 'A year? We would have been unstoppable. No.',
      3: 'Three weeks would not have even covered the movie.',
    },
  },
  {
    id: 'gift',
    prompt: 'What did she make with her own hands and give me as a farewell gift?',
    options: [
      'A photo album',
      'A clay Ganesh Ji and a pot she painted herself',
      'A handwritten letter',
      'A panda soft toy',
    ],
    answer: 1,
    right: 'Both. Made by hand, painted by hand, given to me. Still on my desk.',
    wrong: {
      0: 'A photo album would have been easier. She does not do easy.',
      2: 'Closer, but she went further than a letter. She made actual things.',
      3: 'The panda is hers, not a gift. Try something made of clay.',
    },
  },
  {
    id: 'run',
    prompt: 'When I try to get Riddhi to run with me, what does she actually prefer?',
    options: [
      'Running. Obviously running.',
      'Sitting, walking, or literally anything slower',
      'Racing me to the gate',
      'She runs. She just says she does not.',
    ],
    answer: 1,
    right: 'Correct. And Jungle Trail is exactly why I should have listened.',
    wrong: {
      0: 'Have you met her? Running is not on the list.',
      2: 'She would rather stand there and watch me regret it.',
      3: 'No. She does not run. Chapter Four is the proof.',
    },
  },
]

export const QUIZ_TOTAL = QUIZ.length

export function quizVerdict(score: number): string {
  const ratio = score / QUIZ_TOTAL
  if (ratio >= 0.8) return `Okay. You actually listen to her. Respect. — ${NICKNAMES.primary}`
  if (ratio >= 0.5) return `Solid. Not ${RIDDHI.bestFriend}-level, but solid.`
  return `Simran knows more than you. This is a serious problem. Also… ${VOICE.pitJaogeSoft}`
}
