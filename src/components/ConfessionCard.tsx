import { motion } from 'framer-motion'
import Placeholder, { isPlaceholder } from './Placeholder'
import type { Confession } from '../data/confessions'

/**
 * The inside of one envelope in "Things I never say enough".
 *
 * Anything still written as `[WRITE CONFESSION]` renders as the graceful
 * placeholder card instead of pretending to be a real feeling.
 */
export default function ConfessionCard({ confession }: { confession: Confession }) {
  const pending = isPlaceholder(confession.body)

  return (
    <div className="pb-3">
      <h3 className="display text-[1.25rem] leading-tight text-ink sm:text-[1.5rem]">
        {confession.title}
      </h3>

      {pending ? (
        <div className="mt-3">
          <Placeholder
            label={confession.body}
            note="Chaitanya is still writing this one."
            className="text-left"
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-3 space-y-3"
        >
          {confession.body.split('\n\n').map((para, i) => (
            <p key={i} className="text-[0.95rem] leading-relaxed text-ink/85">
              {para}
            </p>
          ))}
        </motion.div>
      )}

      {confession.footer && !isPlaceholder(confession.footer) ? (
        <p className="hand mt-3 text-lg text-rose-deep">{confession.footer}</p>
      ) : null}
    </div>
  )
}