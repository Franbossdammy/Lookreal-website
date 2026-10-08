'use client'

import { motion, useInView, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion'
import { ReactNode, useEffect, useRef, useState, MouseEvent } from 'react'

/* ─────────────────────────────── Reveal ─────────────────────────────── */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  once?: boolean
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────────── Letter stagger heading ────────────────────── */
export function StaggerText({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
  as?: string
}) {
  const words = text.split(' ')
  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden align-bottom">
          {Array.from(word).map((ch, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: delay + (wi * 0.06) + (ci * 0.015),
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

/* ────────────────────────── Animated counter ─────────────────────────── */
export function Counter({
  to,
  prefix = '',
  suffix = '',
  duration = 2,
  decimals = 0,
  className = '',
}: {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
  decimals?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - p, 3)
      setN(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString()}
      {suffix}
    </span>
  )
}

/* ─────────────────────── Magnetic button wrapper ─────────────────────── */
export function Magnetic({
  children,
  className = '',
  strength = 0.35,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.2 })
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.2 })

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────────────── Tilt card ─────────────────────────────── */
export function Tilt({
  children,
  className = '',
  max = 8,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 160, damping: 18 })
  const sry = useSpring(ry, { stiffness: 160, damping: 18 })

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set(-(py - 0.5) * max * 2)
  }
  const onLeave = () => { rx.set(0); ry.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────── Scroll-driven progress bar ────────────────────── */
export function ReadProgress() {
  const { scrollYProgress } = useScrollProgress()
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 h-[2px] bg-primary z-[60] origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

function useScrollProgress() {
  const [p, setP] = useState(0)
  const mv = useMotionValue(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      const v = total > 0 ? window.scrollY / total : 0
      setP(v)
      mv.set(v)
    }
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    window.addEventListener('resize', fn)
    return () => {
      window.removeEventListener('scroll', fn)
      window.removeEventListener('resize', fn)
    }
  }, [mv])
  return { scrollYProgress: mv, value: p }
}

/* ───────────────────────── Section heading kit ───────────────────────── */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Reveal>
      <p className={`eyebrow inline-flex items-center gap-2 ${className}`}>
        <span className="w-6 h-px bg-ink/60" />
        {children}
      </p>
    </Reveal>
  )
}

export function Section({
  id,
  className = '',
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={`relative py-24 md:py-32 px-6 lg:px-10 ${className}`}>
      {children}
    </section>
  )
}

export { motion }
