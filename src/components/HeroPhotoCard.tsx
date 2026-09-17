import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Sparkles } from 'lucide-react'
import { assetUrl } from '../data/assets'

interface HeroPhotoCardProps {
  photoSrc?: string
  alt?: string
  caption?: string
  placeholder?: string
}

export default function HeroPhotoCard({
  photoSrc = assetUrl('memories', 'hero-riddhi.jpg'),
  alt = 'Riddhi',
  caption = 'The birthday girl herself ✨',
  placeholder = '[ADD HERO PHOTO]',
}: HeroPhotoCardProps) {
  const [error, setError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto my-4 w-full max-w-xs sm:max-w-sm"
    >
      <div aria-hidden="true" className="absolute -inset-1 rounded-[1.8rem] bg-gradient-to-r from-gold/50 via-rose/40 to-peach/60 opacity-70" />
      <div className="hero-photo paper-grain relative overflow-hidden rounded-[1.5rem] border border-white/60 bg-white p-3.5 shadow-lift">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.1rem] bg-cream-100">
          {!error && photoSrc ? (
            <img
              src={photoSrc}
              alt={alt}
              onError={() => setError(true)}
              className="crisp-img h-full w-full object-cover"
              loading="eager"
              decoding="sync"
              draggable={false}
            />
          ) : (
            <div className="grid h-full w-full place-items-center border-2 border-dashed border-rose/40 px-4 text-center bg-cream-50/50">
              <div>
                <Camera size={28} className="mx-auto mb-2 text-rose" />
                <span className="block text-[0.72rem] font-bold uppercase tracking-[0.2em] text-rose-deep">
                  {placeholder}
                </span>
                <span className="mt-1 block text-[0.65rem] text-ink-soft/70">
                  Drop hero-riddhi.jpg into public/assets/memories/
                </span>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-ink/70 px-2.5 py-1 text-[0.65rem] font-semibold text-gold backdrop-blur">
            <Sparkles size={10} className="inline mr-1 text-gold" />
            22 & Shining
          </div>
        </div>

        <p className="hand mt-3 text-center text-xl font-bold leading-tight text-ink">
          {caption}
        </p>
      </div>
    </motion.div>
  )
}
