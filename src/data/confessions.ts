/**
 * Chapter 6 — "Things I never say enough".
 *
 * WRITE THESE. Each `body` is intentionally a placeholder so nothing here
 * pretends to be your feelings. Replace the text between the quotes and the
 * placeholders disappear automatically.
 */

export interface Confession {
  id: string
  kicker: string
  title: string
  /** Replace `[WRITE CONFESSION]` with your own writing. */
  body: string
  /** Optional one-line sign off inside the card. */
  footer?: string
}

export const CONFESSIONS_LEAD = {
  chaos: 'Okay… enough chaos.',
  intro: 'There are a few things I actually want you to know.',
  hint: 'Open them one at a time. There is no rush.',
  allOpened: 'That is everything. For now.',
}

export const CONFESSIONS: Confession[] = [
  {
    id: 'like',
    kicker: 'One',
    title: 'What I like most about you',
    body: 'Mushkil samay me apne dosto ke saath rehna',
  },
  {
    id: 'appreciate',
    kicker: 'Two',
    title: 'What I appreciate about you',
    body: 'You point out my mistakes whenever I am wrong.',
  },
  {
    id: 'taught-me',
    kicker: 'Three',
    title: 'What you taught me',
    body: 'Good khana can solve your big problems.',
  },
  {
    id: 'never-change',
    kicker: 'Four',
    title: 'Something I hope you never change',
    body: 'Aapka caring nature.',
  },
  {
    id: 'out-loud',
    kicker: 'Five',
    title: 'Things I never say out loud',
    body: 'Escapism will not solve your problems.',
  },
]