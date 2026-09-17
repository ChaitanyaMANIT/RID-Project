import { MEMORY_SLOTS, assetUrl } from './assets'

/**
 * Chapter 5 — Memory scrapbook.
 *
 * Drop `memory-01.jpg` … `memory-08.jpg` into `public/assets/memories/`
 * (see public/assets/README.md), then write each caption below where it says
 * `[ADD MEMORY]`. A missing photo renders as a `[ADD PHOTO]` card — never
 * a broken image.
 */

export interface Memory {
  id: string
  src: string
  /** Shows if the photo file is missing. */
  placeholder: string
  /** Your handwriting under the polaroid. */
  caption: string
  /** Slight rotation, in degrees, so the pile looks hand-placed. */
  tilt: number
}

const TILTS = [-3.4, 2.6, -1.8, 4.2, -2.4, 1.6, -4.6, 3.2]
const CAPTIONS: string[] = [
  '[ADD MEMORY]',
  '[ADD MEMORY]',
  '[ADD MEMORY]',
  '[ADD MEMORY]',
  '[ADD MEMORY]',
  '[ADD MEMORY]',
  '[ADD MEMORY]',
  '[ADD MEMORY]',
]

export const MEMORIES: Memory[] = Array.from({ length: MEMORY_SLOTS }, (_, i) => ({
  id: `memory-${String(i + 1).padStart(2, '0')}`,
  src: assetUrl('memories', `memory-${String(i + 1).padStart(2, '0')}.jpg`),
  placeholder: '[ADD PHOTO]',
  caption: CAPTIONS[i] ?? '[ADD MEMORY]',
  tilt: TILTS[i % TILTS.length] ?? 0,
}))

export const SCRAPBOOK_COPY = {
  eyebrow: 'Chapter Five',
  title: 'Memory scrapbook',
  lead: 'A few of my favourites. Tap any photo.',
  closeHint: 'Tap anywhere to close',
} as const