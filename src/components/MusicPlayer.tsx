import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { MUSIC_HINT, TRACKS } from '../data/music'
import { useExperience } from '../context/ExperienceContext'

/**
 * Floating music control.
 *
 * Because browsers block autoplay, this is only ever *started* by a real tap
 * (the "Open it" button in the prologue). If no audio files exist yet, it shows
 * a quiet hint instead of a dead button.
 */
export default function MusicPlayer() {
  const { music, sfx } = useExperience()
  const [expanded, setExpanded] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)

  const label = music.track ? TRACKS[music.track].title : 'Music'

  return (
    <div className="pointer-events-auto fixed bottom-4 left-4 z-40 flex items-end gap-2">
      <AnimatePresence>
        {hintOpen ? (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="mb-1 max-w-[13rem] rounded-xl rounded-bl-sm bg-ink/92 px-3 py-2 text-[0.7rem] leading-snug text-cream-50 shadow-soft"
          >
            {MUSIC_HINT}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        whileTap={{ scale: 0.93 }}
        onClick={() => {
          if (!music.anyAvailable) {
            setHintOpen((v) => !v)
            return
          }
          sfx('tap')
          music.toggle()
          setExpanded(true)
          window.setTimeout(() => setExpanded(false), 2600)
        }}
        aria-label={music.playing ? 'Pause music' : 'Play music'}
        className={`tap relative grid place-items-center rounded-full border border-white/50 bg-white/78 backdrop-blur-md transition ${
          music.playing ? 'h-12 w-12' : 'h-12 w-12'
        } shadow-soft hover:bg-white`}
      >
        {music.playing ? (
          <Pause size={19} className="text-ink" strokeWidth={2.1} />
        ) : (
          <Play size={19} className="text-ink" strokeWidth={2.1} />
        )}
        {!music.anyAvailable && music.probed ? (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-rose text-[0.6rem] font-bold text-white">
            !
          </span>
        ) : null}
      </motion.button>

      <AnimatePresence>
        {expanded && music.anyAvailable ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="mb-1 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/85 px-3 py-2 shadow-soft backdrop-blur-md"
          >
            <Music size={14} className="text-ink-soft" />
            <span className="text-[0.7rem] font-medium text-ink">{label}</span>
            <button
              type="button"
              onClick={() => music.setMuted(!music.muted)}
              aria-label={music.muted ? 'Unmute' : 'Mute'}
              className="grid h-7 w-7 place-items-center rounded-full text-ink-soft transition hover:bg-cream-100"
            >
              {music.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}