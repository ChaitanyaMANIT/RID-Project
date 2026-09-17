import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'

interface PolaroidProps {
  src?: string
  caption: string
  /** Shown when the photo file is missing, e.g. `[ADD PHOTO]`. */
  placeholder?: string
  tilt?: number
  className?: string
  onClick?: () => void
  priority?: boolean
}

/**
 * A scrapbook polaroid.
 *
 * If the file is not there yet it degrades into a tidy `[ADD PHOTO]` card, never
 * a broken image icon. That is what makes it safe to send this before every
 * photograph has been chosen.
 */
export default function Polaroid({
  src,
  caption,
  placeholder = '[ADD PHOTO]',
  tilt = 0,
  className = '',
  onClick,
  priority = false,
}: PolaroidProps) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>(src ? 'loading' : 'error')
  const missing = !src || status === 'error'

  return (
    <motion.figure
      initial={{ opacity: 0, y: 18, rotate: tilt * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={onClick ? { rotate: 0, scale: 1.03 } : undefined}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`paper-grain relative overflow-hidden rounded-[1.1rem] bg-white p-2.5 pb-3 shadow-soft ${
        onClick ? 'cursor-zoom-in' : ''
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 z-10 h-4 w-16 -translate-x-1/2 -translate-y-1/2 -rotate-2 rounded-[2px] bg-lavender/80 shadow-sm"
      />

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[0.7rem] bg-cream-100">
        {!missing ? (
          <img
            src={src}
            alt={caption}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setStatus('ok')}
            onError={() => setStatus('error')}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center border-2 border-dashed border-rose/35 px-3 text-center">
            <div>
              <Camera size={18} className="mx-auto mb-1.5 text-rose/70" />
              <span className="block text-[0.66rem] font-semibold tracking-[0.2em] text-rose-deep">
                {placeholder}
              </span>
            </div>
          </div>
        )}
        {status === 'loading' && src ? (
          <div className="absolute inset-0 animate-pulse bg-cream-200/70" aria-hidden="true" />
        ) : null}
      </div>

      <figcaption className="hand mt-2 px-1 text-center text-[1.05rem] leading-tight text-ink">
        {caption}
      </figcaption>
    </motion.figure>
  )
}