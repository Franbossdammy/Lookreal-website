'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import Nav from './_components/Nav'
import Footer from './_components/Footer'
import {
  Reveal,
  StaggerText,
  Counter,
  Magnetic,
  Tilt,
  Eyebrow,
  Section,
  motion,
} from './_components/Primitives'

const APP_STORE = 'https://apps.apple.com/ng/app/lookreal/id6749508043'
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.inuud.sharplook'

export default function Home() {
  return (
    <main className="relative bg-canvas text-ink overflow-x-clip">
      <Nav />

      <Hero />
      <TrustBar />
      <Features />
      <Showcase />
      <HowItWorks />
      <Gallery />
      <Trust />
      <Download />
      <Footer />
    </main>
  )
}

/* ──────────────────────────────── Hero ─────────────────────────────── */
function Hero() {
  return (
    <section className="relative pt-32 md:pt-40 pb-24 md:pb-32 px-6 lg:px-10 overflow-hidden">
      {/* ambient shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -right-24 w-[560px] h-[560px] rounded-full bg-primary/10 blur-[120px] animate-blob-slow" />
        <div className="absolute bottom-0 -left-32 w-[460px] h-[460px] rounded-full bg-primary/5 blur-[120px] animate-blob-slow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow inline-flex items-center gap-2 mb-7">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Now live on iOS & Android
              </p>
            </Reveal>

            <h1 className="font-display font-light text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] tracking-tightest text-ink">
              <StaggerText text="Book the people" as="span" className="block" />
              <StaggerText text="who make you " as="span" className="block" delay={0.2}  />
              <span className="block">
                <StaggerText text="glow — " as="span" delay={0.4} />
                <span className="serif-italic text-primary">
                  <StaggerText text="locally." delay={0.55} />
                </span>
              </span>
            </h1>

            <Reveal delay={0.9}>
              <p className="mt-8 max-w-xl text-lg md:text-xl text-ink/60 leading-relaxed">
                LookReal is a marketplace for trusted beauty &amp; wellness professionals near you. Browse, chat, book, and pay — all in one quiet, elegant app.
              </p>
            </Reveal>

            <Reveal delay={1.05}>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Magnetic>
                  <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="btn-pill btn-primary group">
                    <AppleIcon />
                    Download for iOS
                    <Arrow />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="btn-pill btn-ghost">
                    <AndroidIcon />
                    Download for Android
                  </a>
                </Magnetic>
              </div>
            </Reveal>

            <Reveal delay={1.2}>
              <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
                <Stat value={2000} suffix="+" label="active users" />
                <Stat value={100} suffix="+" label="verified vendors" />
                <Stat value={4.8} decimals={1} suffix="★" label="app rating" />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, suffix, label, decimals = 0 }: { value: number; suffix?: string; label: string; decimals?: number }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl text-ink">
        <Counter to={value} suffix={suffix} decimals={decimals} />
      </div>
      <div className="text-[0.78rem] text-ink/50 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  )
}

function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* soft shadow */}
      <div className="absolute -inset-12 bg-primary/5 blur-3xl rounded-full" />

      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="relative w-[300px] bg-ink rounded-[3rem] p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)]">
          <div className="bg-canvas rounded-[2.4rem] overflow-hidden h-[600px]">
            {/* notch */}
            <div className="h-6 flex justify-center items-center">
              <div className="w-24 h-5 bg-ink rounded-b-xl" />
            </div>

            <div className="px-5 pt-2 pb-5 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-ink/50">Good morning,</p>
                  <p className="font-display text-lg">Jola</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 text-primary font-semibold flex items-center justify-center">J</div>
              </div>

              <div className="mt-4 bg-canvas-soft border border-line rounded-2xl px-4 py-3 flex items-center gap-3 text-sm text-ink/50">
                <SearchIcon className="w-4 h-4" />
                vendors near me
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {['Hair', 'Nails', 'Brows', 'Lash'].map((c, i) => (
                  <div key={i} className="bg-canvas-soft rounded-xl py-2.5 text-center">
                    <div className="w-6 h-6 bg-primary/15 rounded-lg mx-auto mb-1" />
                    <p className="text-[10px] text-ink/60">{c}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-ink text-white rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Top rated near you</p>
                    <p className="text-[10px] text-white/50">Lekki · 2.3 km away</p>
                  </div>
                  <span className="text-[10px] bg-primary px-2 py-0.5 rounded-full">★ 4.9</span>
                </div>
                <div className="mt-3 h-20 bg-white/5 rounded-xl" />
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 bg-white/10 rounded-lg py-2 text-center text-[10px]">Message</div>
                  <div className="flex-1 bg-primary rounded-lg py-2 text-center text-[10px] font-semibold">Book now</div>
                </div>
              </div>

              <div className="mt-4 flex-1 space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-canvas-soft rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-line rounded-lg" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold">Hair braiding</p>
                      <p className="text-[10px] text-ink/50">Available today · from ₦15,000</p>
                    </div>
                    <span className="text-primary text-xs">→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating pill labels */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="hidden md:flex absolute -left-10 top-20 bg-white border border-line rounded-full px-4 py-2 shadow-lg items-center gap-2 text-sm"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Vendor accepted
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="hidden md:flex absolute -right-6 bottom-24 bg-white border border-line rounded-full px-4 py-2 shadow-lg items-center gap-2 text-sm"
      >
        <span className="text-primary">★</span>
        4.9 · 128 reviews
      </motion.div>
    </motion.div>
  )
}

/* ────────────────────────── Trust / Marquee ───────────────────────── */
function TrustBar() {
  const items = ['Hair stylists', 'Makeup artists', 'Nail techs', 'Lash artists', 'Barbers', 'Brow stylists', 'Pedicurists', 'Massage therapists', 'Skincare pros', 'Wellness coaches']
  return (
    <section className="relative py-12 border-y border-line bg-canvas-soft overflow-hidden">
      <div className="flex marquee-track">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-10 pr-10 shrink-0">
            <span className="font-display text-2xl md:text-3xl text-ink/70">{item}</span>
            <span className="text-primary">✦</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────────── Features ───────────────────────────── */
function Features() {
  const [active, setActive] = useState('all')
  const filtered = active === 'all' ? FEATURES : FEATURES.filter((f) => f.category === active)

  return (
    <Section id="features" className="bg-canvas">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <Eyebrow>Features</Eyebrow>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">
              Everything you need, <span className="serif-italic text-primary">nothing you don't.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg text-ink/60 max-w-xl leading-relaxed">
              From discovery to secure checkout — every feature is built to make your next booking the smoothest one you've ever had.
            </p>
          </Reveal>
        </div>

        {/* Tabs */}
        <Reveal delay={0.3}>
          <div className="mt-14 flex flex-wrap gap-2">
            {FILTERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  active === t.id
                    ? 'bg-ink text-white border-ink'
                    : 'bg-transparent text-ink/70 border-line hover:border-ink hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((f, i) => (
            <motion.div
              key={f.title}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.6 }}
            >
              <Tilt className="h-full">
                <div className="group relative h-full bg-canvas-soft border border-line hover:border-ink/20 rounded-3xl p-7 transition-all duration-500 hover:shadow-xl hover:shadow-ink/5">
                  <div className="w-11 h-11 rounded-xl bg-white border border-line flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-white transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="mt-6 font-display text-2xl leading-tight tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] text-ink/60 leading-relaxed">
                    {f.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-ink/40 uppercase tracking-widest">
                    <span className="w-5 h-px bg-ink/30" />
                    {f.category}
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ─────────────────────────── Big Showcase ─────────────────────────── */
function Showcase() {
  return (
    <section className="relative py-32 md:py-40 bg-canvas-sand overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Eyebrow>Why LookReal</Eyebrow>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-4xl md:text-6xl font-light leading-[1] tracking-tightest">
              Built for the <span className="serif-italic text-primary">way you book.</span>
            </h2>
          </Reveal>

          <div className="mt-10 space-y-7 max-w-lg">
            {SHOWCASE_POINTS.map((p, i) => (
              <Reveal key={p.title} delay={0.15 + i * 0.08}>
                <div className="flex gap-5">
                  <span className="shrink-0 w-7 h-7 border border-ink rounded-full flex items-center justify-center font-mono text-xs">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl tracking-tight">{p.title}</h3>
                    <p className="mt-1.5 text-ink/60 leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Collage */}
        <div className="relative h-[560px] hidden lg:block">
          <ShowcaseCollage />
        </div>
      </div>
    </section>
  )
}

function ShowcaseCollage() {
  const items = [
    { img: '/assets/gallery/1011451721.jpg', top: '0', left: '0', w: 220, delay: 0 },
    { img: '/assets/gallery/1011451723.jpg', top: '40px', right: '0', w: 240, delay: 0.1 },
    { img: '/assets/gallery/1011451734.jpg', top: '280px', left: '40px', w: 260, delay: 0.2 },
    { img: '/assets/gallery/1011451736.jpg', top: '320px', right: '20px', w: 200, delay: 0.3 },
  ] as const
  return (
    <>
      {items.map((it, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: it.delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -8 }}
          style={{
            position: 'absolute',
            top: it.top,
            left: 'left' in it ? it.left : undefined,
            right: 'right' in it ? it.right : undefined,
            width: it.w,
          }}
          className="rounded-3xl overflow-hidden shadow-2xl shadow-ink/10 border border-white"
        >
          <img src={it.img} alt="" className="w-full h-auto object-cover" />
        </motion.div>
      ))}
    </>
  )
}

/* ─────────────────────────── How it works ─────────────────────────── */
function HowItWorks() {
  return (
    <Section id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <Eyebrow>How it works</Eyebrow>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">
              Three steps.
              <br />
              <span className="serif-italic text-primary">That's it.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-10 md:gap-6 relative">
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-line" />

          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="relative flex flex-col items-start">
                <div className="w-20 h-20 rounded-full bg-canvas border-2 border-ink flex items-center justify-center font-display text-2xl text-ink relative z-10">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-7 font-display text-3xl tracking-tight">{s.title}</h3>
                <p className="mt-3 text-ink/60 leading-relaxed max-w-sm">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ─────────────────────────── Gallery ─────────────────────────── */
function Gallery() {
  const screenshots = ['IMG_0163.png', 'IMG_0164.png', 'IMG_0165.png', 'IMG_0166.png', 'IMG_0167.png', 'IMG_0168.png', 'IMG_0169.png', 'IMG_0170.png']

  return (
    <Section id="gallery" className="bg-canvas-soft">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <Eyebrow>See it in motion</Eyebrow>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">
              A quieter kind of <span className="serif-italic text-primary">interface.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-lg text-ink/60 max-w-xl">
              Every screen is designed to disappear — so you can get back to your day.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5">
          {screenshots.map((img, i) => (
            <motion.div
              key={img}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10 }}
              className="rounded-2xl overflow-hidden bg-white border border-line shadow-sm hover:shadow-xl hover:shadow-ink/10 transition-shadow duration-500"
            >
              <img src={`/assets/screenshots/${img}`} alt={`App screenshot ${i + 1}`} className="w-full h-auto" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────────── Trust ─────────────────────────────── */
function Trust() {
  return (
    <Section className="bg-ink text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <p className="eyebrow text-white/50 inline-flex items-center gap-2">
                <span className="w-6 h-px bg-white/50" />
                Trust
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest text-white">
                Safety is the <span className="serif-italic text-primary-light">product.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
                We built LookReal around a simple idea: your money is held safely until the service is done, and both sides stay protected the whole way.
              </p>
            </Reveal>

            <div className="mt-10 space-y-3">
              {TRUST_LIST.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 text-white/80"
                >
                  <span className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </span>
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {TRUST_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.1}>
                <Tilt>
                  <div className="relative bg-white/[0.04] border border-white/10 rounded-3xl p-7 hover:bg-white/[0.07] transition-colors h-full">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 text-primary-light flex items-center justify-center">
                      {card.icon}
                    </div>
                    <h3 className="mt-6 font-display text-2xl tracking-tight text-white">{card.title}</h3>
                    <p className="mt-2 text-sm text-white/60 leading-relaxed">{card.desc}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ────────────────────────────── Download ──────────────────────────── */
function Download() {
  return (
    <Section id="download">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="relative border border-line rounded-[2.5rem] p-10 md:p-20 bg-canvas-soft overflow-hidden">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative text-center">
              <Eyebrow>Download</Eyebrow>
              <Reveal delay={0.1}>
                <h2 className="mt-5 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">
                  Ready when <span className="serif-italic text-primary">you are.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 text-lg text-ink/60 max-w-lg mx-auto">
                  Free to download. Free to use. One tap closer to your next appointment.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                  <Magnetic>
                    <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="btn-pill btn-primary">
                      <AppleIcon />
                      App Store
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="btn-pill btn-ghost">
                      <AndroidIcon />
                      Google Play
                    </a>
                  </Magnetic>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <p className="mt-6 text-xs text-ink/40 uppercase tracking-widest">
                  Free · No credit card required
                </p>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

/* ─────────────────────────── Icons / Data ─────────────────────────── */
function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}
function AndroidIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
    </svg>
  )
}
function Arrow() {
  return (
    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  )
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'booking', label: 'Booking' },
  { id: 'communication', label: 'Communication' },
  { id: 'security', label: 'Trust & safety' },
]

type Feature = { title: string; description: string; category: string; icon: React.ReactNode }

const Icon = (path: React.ReactNode) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">{path}</svg>
)

const FEATURES: Feature[] = [
  { category: 'marketplace', title: 'Local marketplace', description: 'Browse products and services from vendors in your city — all curated, approved, and ready to book.', icon: Icon(<><path d="M16 11V7a4 4 0 00-8 0v4" /><path d="M5 9h14l1 12H4L5 9z" /></>) },
  { category: 'booking', title: 'One-tap bookings', description: 'See availability, pick a slot, pay a deposit. The vendor confirms in minutes — no DMs.', icon: Icon(<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>) },
  { category: 'marketplace', title: 'Smart search', description: 'Filter by distance, rating, category, and price. Save your favourite vendors for later.', icon: Icon(<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>) },
  { category: 'marketplace', title: 'Offer bargaining', description: 'Propose a price. Counter-offer. Negotiate like real life — but inside the app.', icon: Icon(<><path d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" /></>) },
  { category: 'security', title: 'Escrow protection', description: 'Your money is held safely until the service is complete. Automatic releases, zero drama.', icon: Icon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>) },
  { category: 'booking', title: 'Late-cancel fees', description: 'A fair policy that protects vendor time. Set once, enforced automatically.', icon: Icon(<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>) },
  { category: 'communication', title: 'In-app chat', description: 'Message vendors directly. Send photos, voice notes, references — all in one thread.', icon: Icon(<><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></>) },
  { category: 'communication', title: 'Voice notes', description: 'Describe what you want faster than typing. Vendors reply in kind.', icon: Icon(<><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M19 10v2a7 7 0 11-14 0v-2M12 19v3" /></>) },
  { category: 'communication', title: 'Smart notifications', description: 'Real-time pings for messages, booking changes, and payments — never miss a beat.', icon: Icon(<><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></>) },
  { category: 'marketplace', title: 'Featured listings', description: 'Vendors can boost their best work for extra reach, surfaced right where you look first.', icon: Icon(<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>) },
  { category: 'security', title: 'Verified vendors', description: 'Every seller is manually reviewed, verified, and tied to a real business — not a vibe.', icon: Icon(<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></>) },
  { category: 'booking', title: 'Distance tracking', description: 'See exactly how far each vendor is from you. No more wasted trips.', icon: Icon(<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" /><circle cx="12" cy="10" r="3" /></>) },
]

const SHOWCASE_POINTS = [
  { title: 'No DM back-and-forth', body: 'Service details, pricing, and availability live inside each vendor profile. You read, you book.' },
  { title: 'Vendors you can trust', body: 'Verified identity, portfolio, reviews, and a clear service list — before you ever send a naira.' },
  { title: 'Money handled right', body: 'Payments sit in escrow until the booking is complete. Automated, transparent, fair to both sides.' },
]

const STEPS = [
  { title: 'Discover.', body: 'Open the app and find trusted professionals near you — filtered by what you actually need.' },
  { title: 'Book or buy.', body: 'Pick a time, place an order, or send an offer. Pay a deposit to lock it in.' },
  { title: 'Enjoy.', body: 'Message, show up, get glowing. Your payment releases when the service is done.' },
]

const TRUST_LIST = [
  'Escrow payment protection',
  'Verified-vendor system',
  'In-app secure messaging',
  'Fair cancellation policy',
  'Transaction monitoring',
]

const TRUST_CARDS = [
  { title: 'Secure', desc: 'End-to-end encrypted conversations.', icon: Icon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>) },
  { title: 'Verified', desc: 'Trusted vendors only — manually approved.', icon: Icon(<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></>) },
  { title: 'Protected', desc: 'Payments held in escrow until completion.', icon: Icon(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 1110 0v4" /></>) },
  { title: 'Fast', desc: 'Push notifications in real time.', icon: Icon(<><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></>) },
]
