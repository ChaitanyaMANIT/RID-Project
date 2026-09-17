import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, RotateCcw, Trophy } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'
import { QUIZ, QUIZ_TOTAL, quizVerdict } from '../data/quiz'
import { GAME_COPY } from '../data/cast'
import PandaCharacter from '../components/PandaCharacter'

/**
 * Five questions, all built from real facts, none of them a trap.
 * There is no fail screen — only a verdict, and a panda that judges quietly.
 */
export default function RiddhiQuiz() {
  const { sfx, markCompleted, recordScore, best } = useExperience()
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const question = QUIZ[index]
  const isLast = index === QUIZ_TOTAL - 1

  const choose = (option: number) => {
    if (picked !== null || !question) return
    const right = option === question.answer
    setPicked(option)
    sfx(right ? 'chime' : 'lose')
    if (right) setScore((s) => s + 1)
  }

  const advance = () => {
    sfx('tap')
    if (isLast) {
      const final = score
      setDone(true)
      markCompleted('quiz')
      recordScore('quiz', final)
      sfx(final >= 4 ? 'win' : 'pop')
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
  }

  const restart = () => {
    sfx('tap')
    setIndex(0)
    setPicked(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-card border border-white/60 bg-white/70 p-6 text-center backdrop-blur-sm"
      >
        <Trophy size={26} className="mx-auto mb-3 text-gold-deep" />
        <p className="display text-3xl text-ink">
          {score} / {QUIZ_TOTAL}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-[0.92rem] leading-relaxed text-ink-soft">
          {quizVerdict(score)}
        </p>
        <div className="mt-4 flex justify-center">
          <PandaCharacter
            size={92}
            mood={score >= 4 ? 'cheering' : score >= 2 ? 'idle' : 'annoyed'}
          />
        </div>
        <p className="mt-2 text-[0.75rem] text-ink-soft/80">
          Best so far: {Math.max(best.quiz ?? 0, score)} / {QUIZ_TOTAL}
        </p>
        <button
          type="button"
          onClick={restart}
          className="tap mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[0.82rem] font-semibold text-cream-50"
        >
          <RotateCcw size={14} /> Try again
        </button>
      </motion.div>
    )
  }

  if (!question) return null

  return (
    <div className="rounded-card border border-white/60 bg-white/70 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
        <span>Question {index + 1} of {QUIZ_TOTAL}</span>
        <span>Score {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.35 }}
        >
          <h3 className="display text-[1.15rem] leading-snug text-ink sm:text-[1.35rem]">
            {question.prompt}
          </h3>

          <div className="mt-4 grid gap-2">
            {question.options.map((option, i) => {
              const chosen = picked === i
              const isAnswer = i === question.answer
              const reveal = picked !== null
              return (
                <button
                  key={option}
                  type="button"
                  disabled={reveal}
                  onClick={() => choose(i)}
                  className={`tap w-full rounded-xl border px-4 py-3 text-left text-[0.88rem] leading-snug transition ${
                    reveal && isAnswer
                      ? 'border-sage-deep/60 bg-sage/25 text-ink'
                      : chosen
                        ? 'border-rose-deep/50 bg-rose/20 text-ink'
                        : 'border-white/70 bg-white/70 text-ink hover:border-rose/50'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          <AnimatePresence>
            {picked !== null ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex flex-wrap items-center justify-between gap-3"
              >
                <p className="max-w-sm text-[0.85rem] leading-relaxed text-ink-soft">
                  {picked === question.answer
                    ? question.right
                    : (question.wrong[picked] ?? 'Not quite.')}
                </p>
                <button
                  type="button"
                  onClick={advance}
                  className="tap inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[0.8rem] font-semibold text-cream-50"
                >
                  {isLast ? 'See the verdict' : 'Next'}
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 border-t border-white/60 pt-3 text-[0.7rem] text-ink-soft/70">
        {GAME_COPY.quiz.intro}
      </p>
    </div>
  )
}