import { assetUrl } from './assets'
import type { MusicKey } from './chapters'

/**
 * Music.
 *
 * No external URLs — nothing here streams from anywhere. Drop your own files
 * into `public/assets/music/` and they will be picked up automatically.
 * Change the filenames below if you use different ones.
 */

export interface Track {
  key: MusicKey
  title: string
  src: string
  volume: number
}

export const TRACKS: Record<MusicKey, Track> = {
  birthday: {
    key: 'birthday',
    title: 'Happy Birthday Theme',
    src: assetUrl('music', '01-happy-birthday.mp3'),
    volume: 0.6,
  },
  relatable: {
    key: 'relatable',
    title: 'Background English Track',
    src: assetUrl('music', '02-relatable-english.mp3'),
    volume: 0.5,
  },
  finale: {
    key: 'finale',
    title: 'Finale Celebration',
    src: assetUrl('music', '03-finale.mp3'),
    volume: 0.65,
  },
}

export const TRACK_ORDER: MusicKey[] = ['birthday', 'relatable', 'finale']

export const MUSIC_HINT =
  'Add 01-happy-birthday.mp3 or 02-relatable-english.mp3 to public/assets/music/'

export const CROSSFADE_MS = 1400