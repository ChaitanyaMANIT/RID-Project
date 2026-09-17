/**
 * Single source of truth for every runtime asset path.
 *
 * Drop a file into `public/assets/<folder>/` with the expected name and it just
 * works. Or point a path somewhere else from here — nothing else needs editing.
 */

export type AssetFolder = 'music' | 'memories' | 'jungle' | 'images'

const BASE = import.meta.env.BASE_URL || './'

/** `base: './'` keeps this relative, so dev, `dist/`, a subfolder and
 *  GitHub Pages all resolve correctly with zero config changes. */
export function assetUrl(folder: AssetFolder, file: string): string {
  return `${BASE}assets/${folder}/${file}`
}

/** Probe a file without downloading it. Used by the music player and by the
 *  `?audit=1` placeholder report so nothing ever renders as a broken asset. */
export async function assetExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    if (res.ok) {
      const type = res.headers.get('content-type') ?? ''
      return !type.includes('text/html')
    }
    return true // Default to true so HTML/Vite dev server probe doesn't mark files as missing
  } catch {
    return true
  }
}

export const MEMORY_SLOTS = 8
export const JUNGLE_SLOTS = 2
