'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import Nav from '../_components/Nav'
import Footer from '../_components/Footer'
import { Reveal, Eyebrow } from '../_components/Primitives'

/* ─────────────────────────── Toast ─────────────────────────── */
type ToastType = { type: 'success' | 'error'; msg: string } | null

function Toast({ toast, onClose }: { toast: NonNullable<ToastType>; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t) }, [onClose])
  const ok = toast.type === 'success'
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      className={`fixed top-24 right-4 sm:right-6 z-[400] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl max-w-[360px] border bg-white ${ok ? 'border-emerald-200' : 'border-red-200'}`}
    >
      <span className="text-xl shrink-0 mt-0.5">{ok ? '✓' : '⚠'}</span>
      <p className={`text-sm leading-relaxed flex-1 ${ok ? 'text-emerald-900' : 'text-red-900'}`}>{toast.msg}</p>
      <button onClick={onClose} className="shrink-0 text-ink/30 hover:text-ink text-xl leading-none">×</button>
    </motion.div>
  )
}

/* ──────────────────────── Countdown ──────────────────────── */
function CountdownTimer({ deadline }: { deadline: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [expired, setExpired] = useState(false)
  useEffect(() => {
    const tick = () => {
      const diff = new Date(deadline).getTime() - Date.now()
      if (diff <= 0) { setExpired(true); return }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [deadline])
  if (expired) return <p className="text-ink/50 text-sm">Submissions are now closed.</p>
  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {[{ v: time.days, l: 'Days' }, { v: time.hours, l: 'Hrs' }, { v: time.minutes, l: 'Min' }, { v: time.seconds, l: 'Sec' }].map((t) => (
        <div key={t.l} className="flex flex-col items-center bg-canvas-soft border border-line rounded-2xl px-4 py-3 min-w-[70px] sm:min-w-[80px]">
          <span className="font-display text-3xl sm:text-4xl font-light tabular-nums leading-none tracking-tight">{String(t.v).padStart(2, '0')}</span>
          <span className="text-[10px] text-ink/50 mt-1 uppercase tracking-widest">{t.l}</span>
        </div>
      ))}
    </div>
  )
}

/* ──────────────────────── FAQ ──────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full text-left py-5 flex justify-between items-center gap-4 hover:text-primary transition-colors group">
        <span className="font-display text-lg md:text-xl text-ink group-hover:text-primary transition-colors leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }} className="text-2xl shrink-0 text-primary font-light leading-none">+</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="pb-6 text-ink/60 text-base leading-relaxed max-w-3xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ──────────────────────── Idea Carousel ──────────────────────── */
function IdeaCarousel() {
  const N = CONTENT_LANES.length
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const touchStartX = useRef<number | null>(null)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pause = () => {
    setAutoPlay(false)
    if (autoRef.current) clearInterval(autoRef.current)
    if (resumeRef.current) clearTimeout(resumeRef.current)
    resumeRef.current = setTimeout(() => setAutoPlay(true), 6000)
  }
  const goTo = (idx: number) => { setCurrent(((idx % N) + N) % N); pause() }

  useEffect(() => {
    if (!autoPlay) return
    autoRef.current = setInterval(() => setCurrent((c) => (c + 1) % N), 4000)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [autoPlay, N])

  return (
    <div className="w-full max-w-xl mx-auto select-none">
      <div
        className="relative overflow-hidden rounded-3xl"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return
          const diff = touchStartX.current - e.changedTouches[0].clientX
          if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1)
          touchStartX.current = null
        }}
      >
        <div style={{ display: 'flex', width: `${N * 100}%`, transform: `translateX(-${current * (100 / N)}%)`, transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}>
          {CONTENT_LANES.map((lane) => (
            <div key={lane.n} style={{ width: `${100 / N}%` }} className="flex-shrink-0 bg-canvas-soft border border-line rounded-3xl p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-xl bg-ink text-white text-sm font-mono flex items-center justify-center shrink-0">{String(lane.n).padStart(2, '0')}</span>
                <h3 className="font-display text-2xl leading-tight tracking-tight">{lane.name}</h3>
              </div>
              <p className="text-ink/70 text-base leading-relaxed mb-5">{lane.desc}</p>
              <div className="bg-white border-l-2 border-primary pl-5 py-3">
                <p className="serif-italic text-ink/80 text-lg leading-relaxed">{lane.hook}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => goTo(current - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-line text-ink w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-ink hover:text-white text-lg" aria-label="Previous">‹</button>
        <button onClick={() => goTo(current + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-line text-ink w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-ink hover:text-white text-lg" aria-label="Next">›</button>
      </div>
      <div className="flex justify-center items-center gap-1.5 mt-6">
        {CONTENT_LANES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{ width: i === current ? '24px' : '6px', height: '6px', background: i === current ? '#D73870' : '#E7E5E4' }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────── Constants ──────────────────────── */
const DEADLINE = '2026-05-10T23:59:00+01:00'
const WHATSAPP_GROUP = 'https://chat.whatsapp.com/DpCjCwqhleaJnnduUSBg2P?mode=gi_t'
const WHATSAPP_MSG = encodeURIComponent('Hey! LookReal is running the Booked & Glowing Challenge — a creator competition where you can win up to ₦250,000 just for sharing your beauty experience on TikTok and Instagram. Check it out: https://lookreal.beauty/challenge')

const CONTENT_LANES = [
  { n: 1, name: 'Before & After', desc: 'Show your look before and after a LookReal-booked service.', hook: '"POV: You finally found a lash tech who actually listens to you."' },
  { n: 2, name: 'Booked on LookReal', desc: 'Screen-record or show the booking process in real time.', hook: '"I booked a full glam in 3 minutes. No DMs. No begging. Just booked."' },
  { n: 3, name: 'No More DM Stress', desc: 'Start with DM chaos, then show LookReal as the alternative.', hook: '"Me: \'Can I book for Saturday?\' Vendor: Seen. [3 days later]..."' },
  { n: 4, name: 'Vendor Near Me', desc: 'Open the app, search your area, find someone nearby.', hook: '"I found a hidden gem nail tech 5 minutes from my house."' },
  { n: 5, name: 'Event Prep with LookReal', desc: 'Use LookReal to organise your beauty prep for an event.', hook: '"Owambe in 2 days. Brow tech just cancelled. Fixed it in 10 minutes."' },
  { n: 6, name: 'Trust Proof Testimonial', desc: 'Sit on camera and talk directly about your LookReal experience.', hook: '"I\'ve been burned by Instagram beauty pages too many times. LookReal is different."' },
  { n: 7, name: 'GRWM Using LookReal', desc: 'A full Get Ready With Me where every service was booked through LookReal.', hook: '"Full glam from scratch — booked every single professional on LookReal."' },
  { n: 8, name: 'Men Book Too', desc: 'Barber discovery, booking, and result — from the male perspective.', hook: '"Found my new barber on LookReal. No WhatsApp drama. Cut came out clean."' },
  { n: 9, name: 'Wellness & Body Care', desc: 'Find and book a massage, pedicure, or spa professional.', hook: '"I needed a massage. Found a therapist on LookReal 10 minutes from my house."' },
  { n: 10, name: 'The Negotiation', desc: 'Use LookReal\'s in-app offer bargaining to negotiate a price.', hook: '"Nigerian in me could never pay full price. Sent an offer. They countered. We met in the middle."' },
]

const RULES: [string, string][] = [
  ['Video Length', '30–90 seconds'],
  ['Format', 'Vertical (9:16) only'],
  ['Resolution', 'Minimum 1080p'],
  ['Originality', 'Newly created for this campaign — no recycled content'],
  ['One Entry', 'One submission per person'],
  ['Both Platforms', 'Must post on TikTok AND Instagram'],
  ['TikTok', 'Post publicly. Tag @lookrealapp. Use #LookReal #BookedAndGlowing #LookRealChallenge'],
  ['Instagram', 'Post as a Reel. Collab-invite @lookreal. Same hashtags.'],
  ['No Watermarks', 'Upload separately to each platform — no TikTok watermarks on IG'],
  ['LookReal Must Feature', 'The app must appear visually or be clearly referenced'],
  ['Caption', 'Minimum 50 words — tell your story'],
  ['Age & Location', '18+ and based in Lagos, Nigeria'],
  ['Eligibility', 'Open to all genders, all service categories'],
  ['Follow', 'Follow LookReal App on Instagram (@lookreal) and TikTok (@lookrealapp)'],
]

const SERVICES = [
  { emoji: '✂', name: 'Hairstylists' },
  { emoji: '◇', name: 'Nail Techs' },
  { emoji: '◉', name: 'Makeup Artists' },
  { emoji: '✦', name: 'Lash Techs' },
  { emoji: '✂', name: 'Barbers' },
  { emoji: '◈', name: 'Pedicurists' },
  { emoji: '◎', name: 'Massage' },
  { emoji: '✿', name: 'Skincare' },
  { emoji: '◊', name: 'Brow Techs' },
  { emoji: '✧', name: 'Wellness' },
]

const FAQS: { q: string; a: string }[] = [
  { q: 'Who can enter the challenge?', a: 'Anyone 18 or older, based in Lagos, Nigeria. Both men and women are welcome. You don\'t need to be a professional creator — if you have a story to tell and a camera, you can enter.' },
  { q: 'Do I need a referral code?', a: 'You can use code SV1RC5DGv when signing up on the LookReal app, or your promoter\'s code if you were referred. It helps but is not required to enter the challenge.' },
  { q: 'Do I need to already be on LookReal?', a: 'You need to feature a LookReal booking in your video, so yes — you need to create an account and make at least one booking. Download the app at lookreal.beauty on iOS or Android.' },
  { q: 'What are the sponsored spots?', a: 'The first 30 creators who apply, pass our approval check, and sign a participation agreement will receive up to ₦20,000 in LookReal app credit to cover their service booking. Once those 30 spots are filled, all remaining participants are self-funded.' },
  { q: 'Do I really have to post on both TikTok AND Instagram?', a: 'Yes. Both platforms are required. An entry posted on only one platform will be disqualified. You can upload the same video to both, but do not cross-post the TikTok version with its watermark to Instagram — upload separately.' },
  { q: 'What is the Instagram Collab feature and how do I use it?', a: 'When posting your Reel, tap \'Invite Collaborator\' and search for @lookreal. Once we accept, the post will appear on both profiles. This is mandatory for all Instagram entries.' },
  { q: 'How are winners chosen?', a: 'An internal judging panel scores every entry against 8 criteria: hook strength, feature integration, brand clarity, authenticity, result/transformation, watchability, platform execution, and ad potential. Public engagement counts for 20 points out of 100. Your follower count does not determine the winner — your content does.' },
  { q: 'When will winners be announced?', a: 'Winners will be announced approximately 7 days after the submission deadline — on LookReal\'s TikTok and Instagram pages. All winners will also be notified privately via DM before the public announcement.' },
  { q: 'How and when are prizes paid?', a: 'Cash prizes are paid by bank transfer to a Nigerian account within 5 business days of the winner announcement. LookReal app credits are added to your account immediately.' },
  { q: 'What if I have more questions?', a: 'DM @lookreal on Instagram or @lookrealapp on TikTok and we will reply as quickly as possible.' },
]

const CREATOR_TYPES = ['Beauty Creator', 'Lifestyle Creator', 'Customer (not a creator)', 'Salon/Vendor Owner', 'Other']
const CONTENT_NICHES = ['Hair', 'Nails', 'Skin', 'Makeup', 'Lashes', 'General Beauty', 'Lifestyle', 'Other']
const HEAR_ABOUT = ['Instagram', 'TikTok', 'WhatsApp', 'A Friend', 'Other']

/* ──────────────────────── Interest Form ──────────────────────── */
function InterestForm({ onSuccess, showToast }: { onSuccess: () => void; showToast: (t: 'success' | 'error', m: string) => void }) {
  const [form, setForm] = useState({ fullName: '', email: '', whatsapp: '', instagram: '', tiktok: '', cityState: '', creatorType: '', contentNiche: '', usedBefore: '', hearAbout: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.whatsapp.trim()) e.whatsapp = 'Required'
    if (!form.instagram.trim()) e.instagram = 'Required'
    if (!form.tiktok.trim()) e.tiktok = 'Required'
    if (!form.cityState.trim()) e.cityState = 'Required'
    if (!form.creatorType) e.creatorType = 'Required'
    if (!form.contentNiche) e.contentNiche = 'Required'
    if (!form.usedBefore) e.usedBefore = 'Required'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/interest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('failed')
      onSuccess()
    } catch { showToast('error', 'Something went wrong. Please try again or DM @lookreal on Instagram.') }
    setSubmitting(false)
  }

  const textFields = [
    { i: 0, key: 'fullName', label: 'Full Name', placeholder: 'Your full name', type: 'text' },
    { i: 1, key: 'email', label: 'Email Address', placeholder: 'your@email.com', type: 'email' },
    { i: 2, key: 'whatsapp', label: 'WhatsApp Number', placeholder: '+234 xxx xxx xxxx', type: 'tel', note: 'Include country code e.g. +234…' },
    { i: 3, key: 'instagram', label: 'Instagram Handle', placeholder: '@username', type: 'text' },
    { i: 4, key: 'tiktok', label: 'TikTok Handle', placeholder: '@username', type: 'text' },
    { i: 5, key: 'cityState', label: 'City / State', placeholder: 'e.g. Lagos, Abuja', type: 'text' },
  ]

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {textFields.map(({ i, key, label, placeholder, type, note }) => (
        <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Label>{label} *</Label>
          <input type={type} placeholder={placeholder} value={form[key as keyof typeof form] as string} onChange={(e) => set(key, e.target.value)} className={`field ${errors[key] ? 'border-red-400' : ''}`} />
          {note && <p className="text-ink/40 text-xs mt-1.5">{note}</p>}
          {errors[key] && <p className="text-red-500 text-xs mt-1.5">{errors[key]}</p>}
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Label>Type of Creator *</Label>
        <select value={form.creatorType} onChange={(e) => set('creatorType', e.target.value)} className={`field appearance-none ${errors.creatorType ? 'border-red-400' : ''}`}>
          <option value="">Select your type</option>
          {CREATOR_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.creatorType && <p className="text-red-500 text-xs mt-1.5">{errors.creatorType}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Label>Preferred Services *</Label>
        <select value={form.contentNiche} onChange={(e) => set('contentNiche', e.target.value)} className={`field appearance-none ${errors.contentNiche ? 'border-red-400' : ''}`}>
          <option value="">Select your preferred service</option>
          {CONTENT_NICHES.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.contentNiche && <p className="text-red-500 text-xs mt-1.5">{errors.contentNiche}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Label>Have you used LookReal before? *</Label>
        <div className="grid gap-2">
          {['Yes', 'No', 'Just downloaded it'].map((opt) => (
            <label key={opt} className={`flex gap-3 items-center rounded-xl px-4 py-3 cursor-pointer transition-all border ${form.usedBefore === opt ? 'bg-primary/5 border-primary/40' : 'bg-canvas-soft border-line hover:border-ink/40'}`}>
              <input type="radio" name="usedBefore" value={opt} checked={form.usedBefore === opt} onChange={() => set('usedBefore', opt)} className="accent-primary" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        {errors.usedBefore && <p className="text-red-500 text-xs mt-1.5">{errors.usedBefore}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Label>How did you hear about this? <span className="text-ink/40 normal-case font-normal tracking-normal">(optional)</span></Label>
        <select value={form.hearAbout} onChange={(e) => set('hearAbout', e.target.value)} className="field appearance-none">
          <option value="">Select one</option>
          {HEAR_ABOUT.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-2">
        <button type="submit" disabled={submitting} className="btn-pill btn-accent w-full py-4 disabled:opacity-50">
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>
              Registering…
            </>
          ) : 'Register my interest →'}
        </button>
      </motion.div>
    </form>
  )
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink/60">{children}</label>
)

/* ──────────────────────── Interest Modal ──────────────────────── */
function InterestModal({ open, onClose, showToast }: { open: boolean; onClose: () => void; showToast: (t: 'success' | 'error', m: string) => void }) {
  const [success, setSuccess] = useState(false)
  useEffect(() => { if (!open) { const t = setTimeout(() => setSuccess(false), 400); return () => clearTimeout(t) } }, [open])
  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn); return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[201] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
            <motion.div
              key="modal"
              initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 34, stiffness: 320 }}
              className="pointer-events-auto w-full sm:max-w-lg bg-white flex flex-col max-h-[94vh] sm:max-h-[90vh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex justify-center pt-3 pb-0 sm:hidden shrink-0">
                <div className="w-10 h-1 bg-ink/20 rounded-full" />
              </div>
              <div className="flex items-start justify-between px-6 pt-5 pb-5 border-b border-line shrink-0">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="sh" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                      <p className="eyebrow mb-1 text-primary">All done</p>
                      <h2 className="font-display text-2xl">You're registered.</h2>
                    </motion.div>
                  ) : (
                    <motion.div key="fh" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                      <p className="eyebrow mb-1 text-primary">Booked & Glowing</p>
                      <h2 className="font-display text-2xl">Register your interest</h2>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full border border-line text-ink/50 hover:bg-ink hover:text-white hover:border-ink transition-all">✕</button>
              </div>
              <div className="overflow-y-auto flex-1 px-6 py-6 overscroll-contain">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="sb" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
                      <div className="text-center py-4">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1, damping: 12 }} className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
                          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </motion.div>
                        <h3 className="font-display text-2xl mb-2">Welcome to the challenge.</h3>
                        <p className="text-ink/60 text-sm leading-relaxed">Check your email for next steps from the LookReal team.</p>
                      </div>
                      <div className="bg-canvas-soft border border-line rounded-2xl p-5 text-center">
                        <h4 className="font-display text-lg mb-1">Join the WhatsApp Group</h4>
                        <p className="text-ink/50 text-xs mb-4">Stay updated, get reminders, and connect with other creators.</p>
                        <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer" className="btn-pill bg-[#25D366] text-white hover:bg-[#20b558]">Join WhatsApp →</a>
                      </div>
                      <div className="text-center space-y-3 pt-2">
                        <p className="text-ink/40 text-xs">Already created your content?</p>
                        <a href="/challenge/submit" className="btn-pill btn-primary w-full">Submit your entry →</a>
                        <button onClick={onClose} className="text-ink/40 text-xs hover:text-ink/70 transition-colors">Close</button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="fb" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <InterestForm onSuccess={() => { setSuccess(true); showToast('success', 'You\'re in! Welcome to the Booked & Glowing Challenge.') }} showToast={showToast} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function ChallengePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState<ToastType>(null)
  const openModal = useCallback((e?: React.MouseEvent) => { e?.preventDefault(); setModalOpen(true) }, [])
  const closeModal = useCallback(() => setModalOpen(false), [])
  const showToast = useCallback((type: 'success' | 'error', msg: string) => setToast({ type, msg }), [])

  const PinkBtn = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <button onClick={openModal} className={`btn-pill btn-accent ${className}`}>{children}</button>
  )

  return (
    <main className="relative bg-canvas text-ink">
      <AnimatePresence>{toast && <Toast toast={toast} onClose={() => setToast(null)} />}</AnimatePresence>
      <InterestModal open={modalOpen} onClose={closeModal} showToast={showToast} />

      <Nav
        links={[
          { href: '/#features', label: 'Features' },
          { href: '/challenge', label: 'Challenge' },
          { href: '/contact', label: 'Contact' },
        ]}
        cta={{ href: '#', label: 'Enter now' }}
      />

      {/* HERO */}
      <section className="relative pt-32 md:pt-44 pb-28 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 -right-24 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-amber-200/40 blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <Reveal>
            <p className="eyebrow inline-flex items-center gap-2 justify-center">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              LookReal presents
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-7 font-display font-light text-[clamp(3rem,10vw,8.5rem)] leading-[0.9] tracking-tightest">
              Booked &amp;
              <br />
              <span className="serif-italic text-primary">Glowing</span>
              <br />
              Challenge.
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-10 text-xl md:text-2xl text-ink/60 max-w-2xl mx-auto leading-relaxed">
              Make a short video of your LookReal experience. Post on TikTok &amp; Instagram.
              Win up to <span className="text-ink font-semibold">₦250,000</span>.
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <PinkBtn className="px-10 py-4 text-base">Register your interest →</PinkBtn>
              <a href="/challenge/submit" className="btn-pill btn-ghost">Submit entry</a>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <p className="mt-6 text-xs text-ink/50 uppercase tracking-widest">
              ✦ First 30 entries get up to ₦20,000 in app credit
            </p>
          </Reveal>

          <Reveal delay={0.55}>
            <div className="mt-16 grid grid-cols-3 gap-3 max-w-xl mx-auto">
              {[
                { val: '₦500k', label: 'Total prize pool' },
                { val: '28 Days', label: 'Campaign window' },
                { val: 'TikTok + IG', label: 'Post on both' },
              ].map((s) => (
                <div key={s.label} className="bg-canvas-soft border border-line rounded-2xl py-5 px-3">
                  <p className="font-display text-xl md:text-2xl text-primary">{s.val}</p>
                  <p className="text-[10px] text-ink/50 mt-1 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRIZES */}
      <section className="relative py-24 md:py-32 px-6 lg:px-10 bg-canvas-soft">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow>What you can win</Eyebrow>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">
                ₦500,000 in <span className="serif-italic text-primary">prizes.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-ink/60">Real money. Real bookings. Real careers.</p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-end">
            {/* 2nd */}
            <Reveal delay={0.1}>
              <div className="bg-white border border-line rounded-3xl p-8 text-center order-2 md:order-1">
                <p className="font-display text-4xl text-ink/40 mb-3">02</p>
                <p className="eyebrow mb-2">2nd place</p>
                <p className="font-display text-4xl font-light mb-5">₦150,000</p>
                <div className="space-y-1.5 text-sm text-ink/60">
                  <p>₦100,000 Cash</p>
                  <p>₦50,000 App Credit</p>
                  <p className="pt-2 text-ink font-semibold">+ Monthly Retainership</p>
                </div>
              </div>
            </Reveal>

            {/* 1st */}
            <Reveal delay={0.2}>
              <div className="relative bg-ink text-white rounded-3xl p-10 text-center md:-mt-6 shadow-xl order-1 md:order-2">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-ink text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Top prize</span>
                <p className="font-display text-5xl text-primary-light mb-3">01</p>
                <p className="eyebrow mb-2 text-amber-300">1st place</p>
                <p className="font-display text-6xl font-light mb-5 text-amber-300">₦250,000</p>
                <div className="space-y-1.5 text-sm text-white/70">
                  <p>₦200,000 Cash</p>
                  <p>₦50,000 LookReal Credit</p>
                  <p className="pt-2 text-amber-300 font-semibold">+ Monthly Retainership</p>
                </div>
              </div>
            </Reveal>

            {/* 3rd */}
            <Reveal delay={0.3}>
              <div className="bg-white border border-line rounded-3xl p-8 text-center order-3">
                <p className="font-display text-4xl text-ink/40 mb-3">03</p>
                <p className="eyebrow mb-2">3rd place</p>
                <p className="font-display text-4xl font-light mb-5">₦100,000</p>
                <div className="space-y-1.5 text-sm text-ink/60">
                  <p>₦70,000 Cash</p>
                  <p>₦30,000 App Credit</p>
                  <p className="pt-2 text-emerald-700 font-semibold">+ Creator Circle Invite</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <div className="text-center mt-12">
              <button onClick={openModal} className="text-primary text-sm font-semibold ulink">Ready to compete? Register your interest →</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative py-24 md:py-32 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Eyebrow>Important dates</Eyebrow>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">Timeline.</h2>
            </Reveal>
          </div>

          <div className="relative">
            <div className="absolute left-7 top-10 bottom-10 w-px bg-line hidden sm:block" />
            {[
              { date: 'April 20, 2026', label: 'Challenge Starts', desc: 'Registrations open. Sponsored credits (first 30 entries) begin.', mark: '→' },
              { date: 'May 10, 2026', label: 'Submissions Close', desc: 'All entries must be posted and submitted before midnight WAT.', mark: '◆' },
              { date: 'May 17, 2026', label: 'Winners Announced', desc: 'Winners announced on LookReal\'s TikTok and Instagram. All winners notified by DM first.', mark: '✦' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex gap-5 sm:gap-7 items-start py-5">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-white border border-ink flex items-center justify-center font-display text-xl z-10">
                    {item.mark}
                  </div>
                  <div className="flex-1 bg-canvas-soft border border-line rounded-2xl px-6 py-5 hover:border-ink/40 transition-colors">
                    <p className="eyebrow mb-2">{item.date}</p>
                    <h3 className="font-display text-2xl tracking-tight mb-1">{item.label}</h3>
                    <p className="text-sm text-ink/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO ENTER */}
      <section className="relative py-24 md:py-32 px-6 lg:px-10 bg-canvas-soft">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Eyebrow>The process</Eyebrow>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">How to enter.</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-ink/60">Four steps between you and ₦250,000.</p>
            </Reveal>
          </div>

          <div className="space-y-4">
            {[
              { step: '01', title: 'Download LookReal', desc: <>Get the app on iOS or Android. Find a beauty or wellness professional near you.<br /><br /><span className="text-primary font-semibold">When signing up, enter referral code <span className="font-mono bg-primary/10 px-1.5 py-0.5 rounded text-sm">SV1RC5DGv</span> — or your promoter&apos;s code.</span></> },
              { step: '02', title: 'Book Your Service', desc: 'Use the app to book a service — hair, makeup, nails, lashes, brows, barber, pedicure, massage, skincare, or any category. First 30 approved applicants get up to ₦20,000 in app credit.' },
              { step: '03', title: 'Create Your Video', desc: 'Film a 30–90 second vertical video (9:16). Pick any content style — before & after, booking walkthrough, GRWM, testimonial, or your own creative angle. Make it real. Make it you.' },
              { step: '04', title: 'Register & Submit', desc: 'Register your interest using the button on this page. Post on TikTok (tag @lookrealapp) and Instagram as a Reel (collab @lookreal). Use #LookReal #BookedAndGlowing #LookRealChallenge. Then submit your video links.' },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 0.08}>
                <div className="flex gap-5 sm:gap-7 items-start bg-white border border-line rounded-3xl p-6 sm:p-8 hover:border-ink/30 transition-colors">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-ink text-white flex items-center justify-center font-display text-lg">{s.step}</div>
                  <div className="pt-1.5 min-w-0">
                    <h3 className="font-display text-2xl tracking-tight mb-2">{s.title}</h3>
                    <p className="text-ink/70 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHO CAN ENTER */}
      <section className="relative py-24 md:py-32 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Reveal>
              <h2 className="font-display text-4xl md:text-6xl font-light leading-[1] tracking-tightest">
                This challenge is <span className="serif-italic text-primary">for you</span> if…
              </h2>
            </Reveal>
          </div>

          <div className="space-y-3 mb-16">
            {[
              'You are 18 or older and based anywhere in Lagos, Nigeria.',
              'You create content on TikTok or Instagram — beauty, lifestyle, fashion, grooming, wellness, or any style.',
              'You have or will have a real LookReal booking to document.',
              'You are comfortable on camera — or letting your screen recording do the talking.',
              'Your TikTok is public and your Instagram can post Reels.',
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="flex gap-4 items-start bg-canvas-soft border border-line rounded-2xl px-6 py-4">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <p className="text-ink/80 leading-relaxed">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="eyebrow text-center mb-6">Every service category is eligible</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {SERVICES.map((s) => (
                <motion.div
                  key={s.name}
                  whileHover={{ y: -4, borderColor: 'rgba(215,56,112,0.4)' }}
                  className="bg-white border border-line rounded-2xl py-5 px-3 text-center cursor-default transition-colors"
                >
                  <span className="text-primary text-xl">{s.emoji}</span>
                  <p className="text-ink/70 mt-2 text-xs leading-tight">{s.name}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* IDEAS */}
      <section className="relative py-24 md:py-32 px-6 lg:px-10 bg-canvas-soft">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Eyebrow>Content ideas</Eyebrow>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">
                Not sure what <span className="serif-italic text-primary">to create?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg text-ink/60">Pick any of these 10 video styles. Make it yours.</p>
            </Reveal>
          </div>
          <Reveal>
            <IdeaCarousel />
          </Reveal>
        </div>
      </section>

      {/* WHY LOOKREAL */}
      <section className="relative py-24 md:py-32 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow>About the app</Eyebrow>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">Why LookReal?</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg text-ink/60 leading-relaxed max-w-xl mx-auto mb-14">
              LookReal is Nigeria&apos;s beauty and wellness booking marketplace. We connect you with trusted, nearby professionals — all in one platform. No DM back-and-forth. No ghosting. Just book.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-14">
              {[{ val: '2,000+', label: 'Active users' }, { val: '100+', label: 'Vendors' }, { val: '4.8 ★', label: 'App rating' }].map((s) => (
                <div key={s.label} className="bg-canvas-soft border border-line rounded-2xl py-7 px-3">
                  <p className="font-display text-3xl md:text-4xl text-primary">{s.val}</p>
                  <p className="text-xs text-ink/50 mt-2 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex gap-3 justify-center flex-wrap mb-10">
              <a href="https://apps.apple.com/ng/app/lookreal/id6749508043" target="_blank" rel="noopener noreferrer" className="btn-pill btn-ghost">App Store</a>
              <a href="https://play.google.com/store/apps/details?id=com.inuud.sharplook" target="_blank" rel="noopener noreferrer" className="btn-pill btn-ghost">Google Play</a>
            </div>
            <PinkBtn className="px-10 py-4">Enter the challenge →</PinkBtn>
          </Reveal>
        </div>
      </section>

      {/* RULES */}
      <section className="relative py-24 md:py-32 px-6 lg:px-10 bg-canvas-soft">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Eyebrow>Competition rules</Eyebrow>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">
                The rules — <span className="serif-italic text-primary">plain &amp; simple.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <div className="bg-white border border-line rounded-3xl overflow-hidden divide-y divide-line">
              {RULES.map(([rule, detail]) => (
                <div key={rule} className="flex gap-5 sm:gap-8 px-6 sm:px-8 py-5 hover:bg-canvas-soft transition-colors">
                  <span className="font-semibold text-primary text-sm shrink-0 w-28 sm:w-40 pt-0.5">{rule}</span>
                  <span className="text-ink/70 text-sm leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>
            <p className="text-ink/40 text-xs mt-5 text-center">By submitting, you grant LookReal a non-exclusive, royalty-free licence to repost and use your content for organic social media, with credit.</p>
          </Reveal>
        </div>
      </section>

      {/* BRIDGE CTA */}
      <section className="relative py-24 md:py-32 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="relative overflow-hidden bg-ink text-white rounded-[2.5rem] p-10 sm:p-16 text-center">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-32 bg-primary/30 blur-[80px] rounded-full" />
              <div className="relative">
                <p className="eyebrow text-primary-light mb-5">Already registered?</p>
                <h2 className="font-display text-4xl md:text-5xl font-light leading-tight tracking-tightest mb-5">
                  Ready to submit your <span className="serif-italic text-primary-light">entry?</span>
                </h2>
                <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed mb-10">
                  If you&apos;ve already registered and created your content, head to the submission page and lock in your shot at ₦500,000.
                </p>
                <a href="/challenge/submit" className="btn-pill btn-accent">Submit my entry now →</a>
                <p className="text-white/40 text-xs mt-6">
                  Haven&apos;t registered yet?{' '}
                  <button onClick={openModal} className="text-primary-light ulink">Register your interest first.</button>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REGISTER CTA */}
      <section id="interest-form" className="relative py-24 md:py-32 px-6 lg:px-10 bg-canvas-soft scroll-mt-24">
        <div className="max-w-lg mx-auto text-center">
          <Reveal>
            <Eyebrow>Step 01</Eyebrow>
            <h2 className="mt-4 font-display text-5xl md:text-6xl font-light leading-[0.95] tracking-tightest">Register your interest.</h2>
            <p className="mt-6 text-lg text-ink/60 max-w-sm mx-auto mb-10 leading-relaxed">Tell us about yourself. We&apos;ll send everything you need. Takes 2 minutes.</p>
            <PinkBtn className="px-12 py-5 text-base">Register my interest →</PinkBtn>
            <p className="text-ink/40 text-xs mt-5 uppercase tracking-widest">Free to enter · Lagos creators 18+</p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 md:py-32 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Eyebrow>Got questions?</Eyebrow>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">
                Frequently <span className="serif-italic text-primary">asked.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <div className="bg-canvas-soft border border-line rounded-3xl px-6 sm:px-10">
              {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SHARE */}
      <section className="relative py-20 px-6 lg:px-10 bg-canvas-soft">
        <div className="max-w-xl mx-auto text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-light leading-tight tracking-tightest mb-4">
              Know someone who should enter?
            </h2>
            <p className="text-ink/60 mb-8">Send them the link — ₦250,000 is a lot to keep to yourself.</p>
            <motion.a
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              href={`https://api.whatsapp.com/send?text=${WHATSAPP_MSG}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-pill bg-[#25D366] text-white hover:bg-[#20b558]"
            >
              Share on WhatsApp
            </motion.a>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-24 md:py-32 px-6 lg:px-10">
        <div className="max-w-xl mx-auto text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight tracking-tightest mb-3">
              Still reading? <span className="serif-italic text-primary">That means you should enter.</span>
            </h2>
            <p className="text-ink/60 mb-10 text-lg">Register before the deadline. ₦250,000 is waiting.</p>
            <PinkBtn className="px-10 py-4 mb-14">Register your interest →</PinkBtn>
            <p className="eyebrow mb-5">Submissions close in</p>
            <CountdownTimer deadline={DEADLINE} />
          </Reveal>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-t border-b border-line bg-canvas-soft py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3 items-center justify-center text-xs text-ink/50 uppercase tracking-widest">
          <span className="font-semibold text-ink">LookReal</span>
          <span>·</span><span>2,000+ Users</span>
          <span>·</span><span>100+ Vendors</span>
          <span>·</span><span>4.8 ★ Rating</span>
          <span>·</span><span>iOS &amp; Android</span>
        </div>
      </div>

      <Footer />

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden px-4 pb-4 pt-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
        <button onClick={openModal} className="pointer-events-auto w-full btn-pill btn-accent py-4 shadow-xl">
          Register your interest →
        </button>
      </div>
    </main>
  )
}
