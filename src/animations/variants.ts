import type { Transition, Variants } from 'framer-motion'

/** The house easing. Everything soft settles on this. */
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const

export const springSoft: Transition = { type: 'spring', stiffness: 210, damping: 26, mass: 0.9 }
export const springSnappy: Transition = { type: 'spring', stiffness: 420, damping: 30 }

/** Text and blocks arriving. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: EASE_SOFT },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE_SOFT } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE_SOFT } },
}

/** Parent wrappers — stagger children instead of animating each by hand. */
export function staggerParent(stagger = 0.09, delayChildren = 0.08): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  }
}

export const listItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_SOFT } },
}

/** Cinematic chapter transitions: a soft drift, never a hard cut. */
export const chapterVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_SOFT },
  },
  exit: {
    opacity: 0,
    y: -18,
    transition: { duration: 0.32, ease: EASE_IN_OUT },
  },
}

/** The black-to-light wipe used between big moments. */
export const veilVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 0, transition: { duration: 0.9, ease: EASE_SOFT } },
  exit: { opacity: 1, transition: { duration: 0.6, ease: EASE_IN_OUT } },
}

/** Envelope / card flips. */
export const flipVariants: Variants = {
  closed: { rotateX: 0 },
  open: { rotateX: -168, transition: { duration: 0.75, ease: EASE_SOFT } },
}

export const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springSnappy,
  },
  exit: { opacity: 0, scale: 0.7, y: -10, transition: { duration: 0.22 } },
}

export const shakeVariants: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -14, 12, -10, 8, -5, 3, 0],
    rotate: [0, -1.2, 1, -0.8, 0.6, -0.4, 0.2, 0],
    transition: { duration: 0.66, ease: 'easeInOut' },
  },
}

/** Motion-safe: returns `undefined` variants when the reader asked for less. */
export function soften(variants: Variants, reduced: boolean): Variants | undefined {
  return reduced ? undefined : variants
}