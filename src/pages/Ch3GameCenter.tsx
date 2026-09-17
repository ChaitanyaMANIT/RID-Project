import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2 } from 'lucide-react'
import { useExperience } from '../context/ExperienceContext'
import ChapterShell from '../components/ChapterShell'
import FoodMeter from '../components/FoodMeter'
import PandaCharacter from '../components/PandaCharacter'
import { SecretTrigger } from '../components/EasterEgg'
import RescueSimranGame from '../games/RescueSimranGame'
import { fadeUp, staggerParent } from '../animations/variants'

export default function Ch3GameCenter() {
  const { chapter, sfx, fireEgg, isComplete, best } = useExperience()
  const [teases, setTeases] = useState(0)
  const played = isComplete('rescue')

  const tease = () => {
    const next = teases + 1
    setTeases(next)
    sfx('pop')
    if (next >= 3) {
      fireEgg('pit-jaoge')
      setTeases(0)
    } else {
      fireEgg('secret', next === 1 ? 'Riddhi is watching.' : 'Okay, maybe stop teasing Simran.')
    }
  }

  return (
    <ChapterShell
      chapter={chapter}
      subtitle="Chaitanya became a monster. Simran needs help. Riddhi has exactly one job."
      wide
    >
      <motion.div variants={staggerParent(0.09)} initial="hidden" animate="show" className="space-y-5">
        <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <FoodMeter />
          </div>
          <div className="flex items-center gap-3 rounded-card border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
            <PandaCharacter size={58} mood={played ? 'happy' : 'idle'} />
            <div>
              <p className="text-[0.8rem] font-bold text-cream-50">
                {best.rescue ? `Best: ${best.rescue}` : played ? 'Simran rescued!' : 'Mission ready'}
              </p>
              <p className="max-w-[13rem] text-[0.7rem] leading-snug text-cream-50/65">
                {played ? 'That monster never stood a chance.' : 'Run. Jump. Bonk the monster. Save Simran.'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="rounded-card border border-white/15 bg-night/50 p-2.5 sm:p-4 shadow-lift">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <p className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-gold">
              <Gamepad2 size={16} />
              Operation: Rescue Simran
            </p>
            <span className="rounded-full bg-rose/20 px-3 py-1 text-[0.66rem] font-semibold text-rose">Main Quest</span>
          </div>
          <RescueSimranGame />
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={tease}
            className="tap rounded-full border border-rose/40 bg-rose/10 px-4 py-2.5 text-[0.75rem] font-semibold text-rose"
          >
            Tease Simran 😈
          </button>
          <SecretTrigger
            onFire={() => fireEgg('suno')}
            label="Why is this glowing?"
            className="glow-pulse grid h-10 w-10 place-items-center rounded-full border border-gold/30 bg-white/10 text-[0.8rem] font-bold text-gold"
          >
            ?
          </SecretTrigger>
          {teases > 0 ? <span className="hand text-lg text-rose">Warning {teases}/3…</span> : null}
        </motion.div>
      </motion.div>
    </ChapterShell>
  )
}
