import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * An <img> that refuses to break.
 *
 * 1. Tries `.jpg` → `.jpeg` → `.png` → `.webp`, so whatever extension you drop
 *    into `public/assets/` just works. (This is exactly what silently swallowed
 *    `memory-01.jpeg`, which the code was requesting as `memory-01.jpg`.)
 * 2. `capToNatural` stops a photo being stretched beyond its real pixels — the
 *    difference between "soft" and "crisp" on a high-DPI screen.
 * 3. Renders your own placeholder when nothing loads, so it is never a broken
 *    image icon.
 */

export function extensionCandidates(path: string): string[] {
  const match = /^(.*)\.([a-z0-9]+)$/i.exec(path)
  if (!match) return [path]
  const stem = match[1] ?? path
  const order = [(match[2] ?? 'jpg').toLowerCase(), 'jpg', 'jpeg', 'png', 'webp']
  const unique: string[] = []
  for (const ext of order) if (!unique.includes(ext)) unique.push(ext)
  return unique.map((ext) => `${stem}.${ext}`)
}

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  /** Shown when every candidate fails to load. */
  fallback?: ReactNode
  /** Never render wider than the file's real pixel width. */
  capToNatural?: boolean
  priority?: boolean
  /** Soft shimmer while loading. Needs a positioned parent. */
  shimmer?: boolean
}

export default function SmartImage({
  src,
  alt,
  className = '',
  fallback = null,
  capToNatural = false,
  priority = false,
  shimmer = true,
}: SmartImageProps) {
  const candidates = useMemo(() => extensionCandidates(src), [src])
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null)

  useEffect(() => {
    setIndex(0)
    setStatus('loading')
    setNaturalWidth(null)
  }, [src])

  if (status === 'error' || index >= candidates.length) return <>{fallback}</>

  return (
    <>
      <img
        key={candidates[index]}
        src={candidates[index]}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={(e) => {
          setStatus('ok')
          setNaturalWidth(e.currentTarget.naturalWidth || null)
        }}
        onError={() => {
          if (index + 1 < candidates.length) setIndex(index + 1)
          else setStatus('error')
        }}
        className={className}
        style={
          capToNatural && naturalWidth ? { maxWidth: `min(100%, ${naturalWidth}px)` } : undefined
        }
      />
      {shimmer && status === 'loading' ? (
        <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-cream-200/60" />
      ) : null}
    </>
  )
}
