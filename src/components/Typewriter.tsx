import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface TypewriterProps {
  text: string
  /** Milliseconds per character. */
  speed?: number
  startDelay?: number
  className?: string
  showCaret?: boolean
  onDone?: () => void
}

/** Types a line out. Used sparingly — only where the pause is the point. */
export default function Typewriter({
  text,
  speed = 42,
  startDelay = 0,
  className = '',
  showCaret = true,
  onDone,
}: TypewriterProps) {
  const [shown, setShown] = useState(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    setShown(0)
    let interval: number | undefined
    const startTimer = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setShown((n) => {
          if (n >= text.length) {
            if (interval !== undefined) window.clearInterval(interval)
            doneRef.current?.()
            return n
          }
          return n + 1
        })
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(startTimer)
      if (interval !== undefined) window.clearInterval(interval)
    }
  }, [text, speed, startDelay])

  const finished = shown >= text.length

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, shown)}</span>
      {showCaret && !finished ? (
        <motion.span
          aria-hidden="true"
          className="ml-0.5 inline-block align-middle"
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ width: 2, height: '1.05em', background: 'currentColor' }}
        />
      ) : null}
    </span>
  )
}