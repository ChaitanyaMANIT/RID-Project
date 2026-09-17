import { motion } from 'framer-motion'

export default function RibbonOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none">
      {/* Top horizontal silk ribbon with gold stitching */}
      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-rose-deep via-gold to-rose-deep shadow-md opacity-90" />

      {/* Top right diagonal gift ribbon fold */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rotate-45 border-b-2 border-t-2 border-gold/60 bg-gradient-to-r from-rose-deep/90 via-rose/85 to-rose-deep/90 shadow-lift backdrop-blur-sm">
        <div className="flex h-full items-end justify-center pb-1">
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-gold drop-shadow">
            RIDDHI · 22
          </span>
        </div>
      </div>

      {/* Subtle silk knot badge in corner */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-gold/40 bg-night/80 px-3 py-1 text-[0.68rem] font-semibold text-gold shadow-soft backdrop-blur-md"
      >
        <span className="text-xs">🎀</span>
        <span>For Riddhi</span>
      </motion.div>
    </div>
  )
}
