import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { listItem } from '../animations/variants'

interface RevealTextProps {
  text: string
  className?: string
  /** Seconds to wait before the first piece arrives. */
  delay?: number
  split?: 'word' | 'char'
  stagger?: number
  annotate?: ReactNode
}

/**
 * Words (or letters) that arrive one after another. The whole string is still
 * exposed to screen readers as a single label.
 */
export default function RevealText({
  text,
  className,
  delay = 0,
  split = 'word',
  stagger,
  annotate,
}: RevealTextProps) {
  const parts = split === 'char' ? Array.from(text) : text.split(' ')
  const NBSP = ' '

  return (
    <motion.span
      className={className}
      style={{ display: 'inline-block' }}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger ?? (split === 'char' ? 0.035 : 0.075),
            delayChildren: delay,
          },
        },
      }}
      aria-label={text}
    >
      {parts.map((part, i) => (
        <motion.span
          key={`${part}-${i}`}
          variants={listItem}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            whiteSpace: split === 'char' ? 'pre' : 'normal',
          }}
        >
          {split === 'char' ? (part === ' ' ? NBSP : part) : part}
          {split === 'word' && i < parts.length - 1 ? NBSP : ''}
        </motion.span>
      ))}
      {annotate}
    </motion.span>
  )
}