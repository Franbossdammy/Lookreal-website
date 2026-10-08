'use client'

import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

type NavItem = { href: string; label: string; badge?: string; external?: boolean }

const DEFAULT_LINKS: NavItem[] = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#gallery', label: 'Gallery' },
  { href: 'https://blog.lookreal.beauty', label: 'Blog', external: true },
  { href: '/contact', label: 'Contact' },
  { href: '/challenge', label: 'Challenge', badge: 'NEW' },
]

export default function Nav({
  links = DEFAULT_LINKS,
  cta = { href: '/#download', label: 'Get the app' },
}: {
  links?: NavItem[]
  cta?: { href: string; label: string }
}) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 12))

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-line'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/assets/logo.png" alt="LookReal" className="w-9 h-9 rounded-xl transition-transform group-hover:scale-105" />
            <span className="font-display text-[1.4rem] font-semibold tracking-tight text-ink">
              lookreal
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {links.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={cta.href}
              className="btn-pill btn-primary text-[0.9rem] px-5 py-2.5"
            >
              {cta.label}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="lg:hidden w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              className="fixed top-0 inset-x-0 z-50 bg-white border-b border-line lg:hidden pt-20 pb-10 px-6"
            >
              <nav className="flex flex-col gap-1">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-4 border-b border-line/60 text-xl font-display"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <Link
                href={cta.href}
                onClick={() => setOpen(false)}
                className="btn-pill btn-primary w-full mt-6"
              >
                {cta.label}
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ href, label, badge, external }: NavItem) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="relative text-[0.92rem] text-ink/70 hover:text-ink transition-colors ulink"
    >
      {label}
      {badge && (
        <span className="absolute -top-2 -right-7 text-[9px] font-bold tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  )
}
