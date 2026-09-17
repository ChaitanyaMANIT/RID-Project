import { motion } from 'framer-motion'

const SPARKLES = [
  { top: '12%', left: '8%', size: 6, delay: 0 },
  { top: '25%', right: '10%', size: 8, delay: 1.2 },
  { top: '45%', left: '5%', size: 5, delay: 0.6 },
  { top: '65%', right: '7%', size: 7, delay: 1.8 },
  { top: '82%', left: '12%', size: 6, delay: 0.9 },
  { top: '38%', right: '15%', size: 9, delay: 2.1 },
]

export default function FloatingDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Soft ambient glowing light orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-rose-deep/20 blur-[100px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -right-20 top-2/3 h-96 w-96 rounded-full bg-gold/15 blur-[120px]"
      />

      {/* Floating golden dust sparkles */}
      {SPARKLES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            width: s.size,
            height: s.size,
            boxShadow: '0 0 10px rgba(232, 194, 126, 0.8)',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        />
      ))}
    </div>
  )
}
