import { JUNGLE_SLOTS, assetUrl } from './assets'
import { RIDDHI } from './riddhi'

/**
 * Chapter 4 — the Jungle Trail incident.
 *
 * The real details: the four of you went to Jungle Trail; you were very excited
 * and asked her to run with you; she prefers sitting/walking; you were holding
 * her but she is shorter than you so she could not match your pace; you both
 * fell. Nobody was seriously hurt.
 *
 * `media: 'animation'` plays the animated rebuild. Change to `'photos'` once
 * you drop `jungle-01.jpg` / `jungle-02.jpg` into `public/assets/jungle/`.
 */

export interface JungleLine {
  who: 'me' | 'riddhi' | 'screen'
  line: string
}

export const JUNGLE = {
  media: 'animation' as 'animation' | 'photos',

  title: 'The Jungle Trail incident',
  eyebrow: 'Chapter Four',
  cast: ['Me', 'Govinda', RIDDHI.bestFriend, RIDDHI.name],

  photos: Array.from({ length: JUNGLE_SLOTS }, (_, i) =>
    assetUrl('jungle', `jungle-0${i + 1}.jpg`),
  ),
  photoCaptions: ['[ADD MEMORY]', '[ADD MEMORY]'],

  /** Everything below is editable — swap in your own retelling if you like. */
  script: [
    { who: 'me', line: 'Let’s run!' },
    { who: 'riddhi', line: '…do we have to?' },
    { who: 'me', line: 'Come on, it’s right there!' },
    { who: 'riddhi', line: 'Wait…' },
    { who: 'me', line: 'It’s fine, keep going!' },
    { who: 'riddhi', line: 'WAIT…' },
  ] as JungleLine[],

  crashWord: 'CRASH',

  verdict: [
    { label: 'Injury', value: 'Thankfully minimal.' },
    { label: 'Dignity', value: 'Completely destroyed.' },
    { label: 'Witnesses', value: 'Govinda and Simran. They are still laughing.' },
  ],

  /** Your words from the brief. Change it if you want. */
  sorryLine: 'And yes, Rid bro… I’m still sorry. 😭',

  outro: 'Told you. She does not run. She was right and I was on the floor.',
} as const