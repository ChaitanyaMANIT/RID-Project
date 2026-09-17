/**
 * Chapter 8 — the cake.
 *
 * 22 candles, one for every year. Light them, wish, blow them out.
 * `lines` appear after "22 years of Riddhi." — write your own.
 */

export const CAKE = {
  eyebrow: 'Chapter Eight',
  title: 'Make a wish',
  lead: 'Twenty-two candles. Because, you know. Twenty-two.',

  stepLight: 'Light the candles',
  stepWish: 'Hold to make a wish',
  stepWishDone: 'Wish locked in.',
  stepBlow: 'Blow them out',
  blowHint: 'Tap the cake to blow them out.',

  reveal: '22 years of Riddhi.',
  revealSub: '— and every single one of them worth celebrating.',

  /** Replace each `[WRITE LINE]` with your own. */
  lines: ['[WRITE LINE]', '[WRITE LINE]', '[WRITE LINE]'],

  wishLine: 'Whatever you just wished for — I hope it happens.',
  candles: 22,
} as const