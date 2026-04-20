'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'

/* ── Toast ── */
type ToastType = { type: 'success' | 'error'; msg: string } | null

function Toast({ toast, onClose }: { toast: NonNullable<ToastType>; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t) }, [onClose])
  const ok = toast.type === 'success'
  return (
    <motion.div
      initial={{ opacity: 0, y: -60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -60 }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      className={`fixed top-20 right-4 sm:right-6 z-[400] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-[340px] border backdrop-blur-xl ${ok ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-50' : 'bg-red-950/95 border-red-500/30 text-red-50'}`}
    >
      <span className="text-xl shrink-0 mt-0.5">{ok ? '🎉' : '⚠️'}</span>
      <p className="text-sm leading-relaxed flex-1">{toast.msg}</p>
      <button onClick={onClose} className="shrink-0 text-white/40 hover:text-white text-xl leading-none mt-0.5">×</button>
    </motion.div>
  )
}

/* ── Countdown ── */
function CountdownTimer({ deadline }: { deadline: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [expired, setExpired] = useState(false)
  useEffect(() => {
    const tick = () => {
      const diff = new Date(deadline).getTime() - Date.now()
      if (diff <= 0) { setExpired(true); return }
      setTime({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [deadline])
  if (expired) return <p className="text-white/50 text-sm">Submissions are now closed.</p>
  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {[{ v: time.days, l: 'Days' }, { v: time.hours, l: 'Hrs' }, { v: time.minutes, l: 'Mins' }, { v: time.seconds, l: 'Secs' }].map(t => (
        <div key={t.l} className="flex flex-col items-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2.5 min-w-[60px] sm:min-w-[72px]">
          <span className="text-2xl sm:text-3xl font-bold tabular-nums leading-none">{String(t.v).padStart(2, '0')}</span>
          <span className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">{t.l}</span>
        </div>
      ))}
    </div>
  )
}

/* ── FAQ Item ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/8 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-0 py-5 flex justify-between items-center gap-4 hover:text-primary transition-colors group">
        <span className="font-medium text-sm md:text-base text-white/90 group-hover:text-primary transition-colors leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-2xl shrink-0 text-primary font-light leading-none">+</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="pb-5 text-white/60 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Idea Carousel ── */
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
    autoRef.current = setInterval(() => setCurrent(c => (c + 1) % N), 4000)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [autoPlay, N])

  return (
    <div className="w-full max-w-xl mx-auto select-none">
      <div className="relative overflow-hidden rounded-2xl"
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return
          const diff = touchStartX.current - e.changedTouches[0].clientX
          if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1)
          touchStartX.current = null
        }}>
        <div style={{ display: 'flex', width: `${N * 100}%`, transform: `translateX(-${current * (100 / N)}%)`, transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
          {CONTENT_LANES.map(lane => (
            <div key={lane.n} style={{ width: `${100 / N}%` }}
              className="flex-shrink-0 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 rounded-2xl p-7 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-primary/20 text-primary text-sm font-bold flex items-center justify-center shrink-0 border border-primary/20">{lane.n}</span>
                <h3 className="font-bold text-base sm:text-lg leading-tight">{lane.name}</h3>
              </div>
              <p className="text-white/65 text-sm leading-relaxed mb-4">{lane.desc}</p>
              <div className="bg-primary/8 border border-primary/15 rounded-xl px-4 py-3">
                <p className="text-primary/90 text-xs italic leading-relaxed">{lane.hook}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => goTo(current - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all text-lg font-bold hover:scale-110" aria-label="Previous">‹</button>
        <button onClick={() => goTo(current + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all text-lg font-bold hover:scale-110" aria-label="Next">›</button>
      </div>
      <div className="flex justify-center items-center gap-1.5 mt-5">
        {CONTENT_LANES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all duration-300"
            style={{ width: i === current ? '20px' : '6px', height: '6px', background: i === current ? '#E91E8C' : 'rgba(255,255,255,0.2)' }} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  )
}

/* ── Constants ── */
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
  { emoji: '💇‍♀️', name: 'Hairstylists' }, { emoji: '💅', name: 'Nail Technicians' },
  { emoji: '💄', name: 'Makeup Artists' }, { emoji: '👁️', name: 'Lash Technicians' },
  { emoji: '✂️', name: 'Barbers' }, { emoji: '🦶', name: 'Pedicurists' },
  { emoji: '💆', name: 'Massage Therapists' }, { emoji: '🌿', name: 'Skincare Professionals' },
  { emoji: '🎨', name: 'Brow Technicians' }, { emoji: '🧖', name: 'Wellness Professionals' },
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

/* ── Interest Form ── */
const inputCls = 'w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E91E8C]/60 focus:bg-white/[0.08] transition-all'
const selectCls = `${inputCls} appearance-none`

function InterestForm({ onSuccess, showToast }: { onSuccess: () => void; showToast: (t: 'success' | 'error', m: string) => void }) {
  const [form, setForm] = useState({ fullName: '', email: '', whatsapp: '', instagram: '', tiktok: '', cityState: '', creatorType: '', contentNiche: '', usedBefore: '', hearAbout: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {textFields.map(({ i, key, label, placeholder, type, note }) => (
        <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-white/50">{label} <span className="text-primary">*</span></label>
          <input type={type} placeholder={placeholder} value={form[key as keyof typeof form] as string}
            onChange={e => set(key, e.target.value)} className={`${inputCls} ${errors[key] ? 'border-red-500/60' : ''}`} />
          {note && <p className="text-white/30 text-xs mt-1">{note}</p>}
          {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30 }}>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-white/50">Type of Creator <span className="text-primary">*</span></label>
        <select value={form.creatorType} onChange={e => set('creatorType', e.target.value)} className={`${selectCls} ${errors.creatorType ? 'border-red-500/60' : ''}`}>
          <option value="" className="bg-slate-900">Select your type</option>
          {CREATOR_TYPES.map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
        </select>
        {errors.creatorType && <p className="text-red-400 text-xs mt-1">{errors.creatorType}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-white/50">Preferred Services <span className="text-primary">*</span></label>
        <select value={form.contentNiche} onChange={e => set('contentNiche', e.target.value)} className={`${selectCls} ${errors.contentNiche ? 'border-red-500/60' : ''}`}>
          <option value="" className="bg-slate-900">Select your preferred service</option>
          {CONTENT_NICHES.map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
        </select>
        {errors.contentNiche && <p className="text-red-400 text-xs mt-1">{errors.contentNiche}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.40 }}>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-white/50">Have you used LookReal before? <span className="text-primary">*</span></label>
        <div className="grid grid-cols-1 gap-2">
          {['Yes', 'No', 'Just downloaded it'].map(opt => (
            <label key={opt} className={`flex gap-3 items-center rounded-xl px-4 py-3 cursor-pointer transition-all border ${form.usedBefore === opt ? 'bg-primary/10 border-primary/40 text-white' : 'bg-white/[0.04] border-white/[0.08] text-white/70 hover:border-white/20'}`}>
              <input type="radio" name="usedBefore" value={opt} checked={form.usedBefore === opt} onChange={() => set('usedBefore', opt)} className="accent-primary" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        {errors.usedBefore && <p className="text-red-400 text-xs mt-1">{errors.usedBefore}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-white/50">How did you hear about this? <span className="text-white/30 normal-case font-normal">(optional)</span></label>
        <select value={form.hearAbout} onChange={e => set('hearAbout', e.target.value)} className={selectCls}>
          <option value="" className="bg-slate-900">Select one</option>
          {HEAR_ABOUT.map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
        </select>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.50 }} className="pt-2">
        <button type="submit" disabled={submitting}
          className="w-full bg-[#E91E8C] text-white py-4 rounded-xl font-bold text-base hover:bg-[#c2185b] active:scale-[0.98] transition-all shadow-lg shadow-[#E91E8C]/25 disabled:opacity-60 flex items-center justify-center gap-2">
          {submitting ? (<><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/></svg>Registering…</>) : 'Register My Interest →'}
        </button>
      </motion.div>
    </form>
  )
}

/* ── Interest Modal ── */
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
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200]" onClick={onClose} />
          <div className="fixed inset-0 z-[201] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
            <motion.div key="modal" initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              className="pointer-events-auto w-full sm:max-w-lg flex flex-col max-h-[94vh] sm:max-h-[90vh] sm:rounded-2xl rounded-t-3xl overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #111827 0%, #0d1421 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-0 sm:hidden shrink-0">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-4 pb-4 border-b border-white/[0.06] shrink-0">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="sh" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-0.5">All done!</p>
                      <h2 className="text-lg font-bold">You&apos;re registered 🎉</h2>
                    </motion.div>
                  ) : (
                    <motion.div key="fh" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-0.5">Booked &amp; Glowing Challenge</p>
                      <h2 className="text-lg font-bold">Register Your Interest</h2>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 transition-colors text-white/50 hover:text-white shrink-0 ml-4 text-sm mt-0.5">✕</button>
              </div>
              {/* Body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 overscroll-contain">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div key="sb" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
                      <div className="text-center py-4">
                        <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1, damping: 12 }} className="text-6xl mb-4">🎉</motion.p>
                        <h3 className="text-xl font-bold mb-2">Welcome to the challenge!</h3>
                        <p className="text-white/55 text-sm leading-relaxed">Check your email for next steps from the LookReal team.</p>
                      </div>
                      <div className="bg-[#075E54]/15 border border-[#25D366]/20 rounded-2xl p-5 text-center">
                        <p className="text-2xl mb-2">📲</p>
                        <h4 className="font-bold text-sm mb-1">Join the Challenge WhatsApp Group</h4>
                        <p className="text-white/50 text-xs mb-4 leading-relaxed">Stay updated, get reminders, and connect with other creators.</p>
                        <a href={WHATSAPP_GROUP} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#20b558] transition-colors">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          Join WhatsApp Group →
                        </a>
                      </div>
                      <div className="text-center space-y-3">
                        <p className="text-white/40 text-xs">Already created your content?</p>
                        <a href="/challenge/submit" className="block w-full bg-[#E91E8C] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#c2185b] transition-all shadow-lg shadow-[#E91E8C]/20">Submit Your Entry →</a>
                        <button onClick={onClose} className="text-white/30 text-xs hover:text-white/60 transition-colors">Close this window</button>
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

/* ── Shared variants ── */
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } } as const
const stagger = { visible: { transition: { staggerChildren: 0.1 } } } as const

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
    <button onClick={openModal} className={`inline-flex items-center justify-center bg-[#E91E8C] text-white rounded-full font-bold hover:bg-[#c2185b] active:scale-[0.97] transition-all shadow-lg shadow-[#E91E8C]/30 ${className}`}>
      {children}
    </button>
  )

  return (
    <main className="relative bg-[#090d16] text-white overflow-hidden">
      <AnimatePresence>{toast && <Toast toast={toast} onClose={() => setToast(null)} />}</AnimatePresence>
      <InterestModal open={modalOpen} onClose={closeModal} showToast={showToast} />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
      </div>

      {/* ── Nav ── */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#090d16]/80 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/assets/logo.png" alt="LookReal" className="w-9 h-9 rounded-xl" />
            <span className="text-xl font-display font-bold">LookReal</span>
          </a>
          <button onClick={openModal}
            className="bg-[#E91E8C] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#c2185b] transition-all shadow-md shadow-[#E91E8C]/25 hover:shadow-[#E91E8C]/40">
            Enter Now
          </button>
        </div>
      </motion.nav>

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 text-xs text-primary font-semibold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            LookReal Presents
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-[1.05] tracking-tight">
            <span className="block text-white">Booked &amp;</span>
            <span className="block bg-gradient-to-r from-[#E91E8C] via-[#f06292] to-[#E91E8C] bg-clip-text text-transparent">Glowing</span>
            <span className="block text-white text-4xl sm:text-5xl md:text-6xl">Challenge</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg sm:text-xl text-white/70 mb-4 leading-relaxed max-w-xl mx-auto">
            Show us your LookReal experience. Win up to <span className="text-white font-bold">₦250,000</span>.
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-sm text-white/45 mb-10 max-w-md mx-auto">
            Create a short video. Post on TikTok and Instagram. Win real money.
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, type: 'spring', damping: 18 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <PinkBtn className="px-8 py-4 text-base">Register Your Interest →</PinkBtn>
            <a href="/challenge/submit"
              className="inline-flex items-center justify-center border border-white/15 text-white/70 hover:text-white hover:border-white/30 px-8 py-4 rounded-full font-semibold text-base transition-all">
              Submit Entry
            </a>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="text-yellow-400/80 text-xs font-medium mb-14">
            ✦ Sponsored spots for first 30 entries only — limited credits available
          </motion.p>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {[{ val: '₦500k', label: 'Total Prize Pool' }, { val: '28 Days', label: 'Campaign Window' }, { val: 'TikTok + IG', label: 'Post on Both' }].map(s => (
              <div key={s.label} className="bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm rounded-2xl py-4 px-2">
                <p className="text-base sm:text-lg font-bold text-primary">{s.val}</p>
                <p className="text-[10px] text-white/40 mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ PRIZES ══ */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <p className="text-primary uppercase tracking-widest text-xs font-bold mb-3">What You Can Win</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-3 leading-tight">₦500,000 in prizes.</h2>
            <p className="text-white/50 text-base">Real money. Real bookings.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-3 gap-4 sm:gap-6 items-end">
            {/* 2nd */}
            <motion.div variants={fadeUp} className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-2xl p-7 text-center md:mb-0 mb-0 order-2 md:order-1">
              <p className="text-4xl mb-3">🥈</p>
              <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-2">2nd Place</p>
              <p className="text-4xl font-display font-black mb-5">₦150,000</p>
              <div className="space-y-2 text-sm text-white/60">
                <p>₦100,000 Cash</p>
                <p>₦50,000 App Booking Credit</p>
                <p className="text-white/80 font-semibold pt-1">+ Monthly Retainership</p>
              </div>
            </motion.div>

            {/* 1st — Featured */}
            <motion.div variants={fadeUp}
              className="relative bg-gradient-to-b from-amber-500/15 via-amber-500/8 to-transparent border border-amber-400/30 rounded-2xl p-8 text-center md:-mt-6 shadow-2xl shadow-amber-500/10 order-1 md:order-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Top Prize
              </div>
              <p className="text-5xl mb-3 mt-2">🥇</p>
              <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">1st Place</p>
              <p className="text-5xl font-display font-black mb-5 text-amber-300">₦250,000</p>
              <div className="space-y-2 text-sm text-white/70">
                <p>₦200,000 Cash</p>
                <p>₦50,000 LookReal Credit</p>
                <p className="text-amber-400 font-bold pt-1">+ Monthly Retainership</p>
              </div>
            </motion.div>

            {/* 3rd */}
            <motion.div variants={fadeUp} className="bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-7 text-center order-3">
              <p className="text-4xl mb-3">🥉</p>
              <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">3rd Place</p>
              <p className="text-4xl font-display font-black mb-5">₦100,000</p>
              <div className="space-y-2 text-sm text-white/60">
                <p>₦70,000 Cash</p>
                <p>₦30,000 App Booking Credit</p>
                <p className="text-emerald-400 font-semibold pt-1">+ Creator Circle Invite</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-10">
            <button onClick={openModal} className="text-primary text-sm font-semibold hover:underline">Ready to compete? Register your interest →</button>
          </motion.div>
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <p className="text-primary uppercase tracking-widest text-xs font-bold mb-3">Important Dates</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-3">Challenge Timeline</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="relative flex flex-col gap-0">
            <div className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/60 via-primary/30 to-primary/10 hidden sm:block" />
            {[
              { date: 'April 20, 2026', label: 'Challenge Starts', desc: 'Registrations open. Sponsored credits (first 30 entries) begin.', icon: '🚀', color: 'text-primary border-primary/30 bg-primary/10' },
              { date: 'May 10, 2026', label: 'Submissions Close', desc: 'All entries must be posted and submitted before midnight WAT.', icon: '🎬', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
              { date: 'May 17, 2026', label: 'Winners Announced', desc: 'Winners announced on LookReal\'s TikTok and Instagram. All winners notified by DM first.', icon: '🏆', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}
                className="flex gap-4 sm:gap-6 items-start px-1 py-4">
                <div className={`w-12 h-12 shrink-0 rounded-2xl border flex items-center justify-center text-xl z-10 ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 py-4 hover:border-white/[0.12] transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{item.date}</p>
                  <h3 className="font-bold text-base mb-1">{item.label}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ HOW TO ENTER ══ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 bg-white/[0.015]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <p className="text-primary uppercase tracking-widest text-xs font-bold mb-3">The Process</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-3">How to Enter</h2>
            <p className="text-white/45 text-sm">Four steps between you and ₦250,000.</p>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
              {[
                { step: '01', title: 'Download LookReal', desc: <>Get the app on iOS or Android. Find a beauty or wellness professional near you.<br /><br /><span className="text-primary font-semibold">When signing up, enter referral code <span className="font-mono bg-primary/10 px-1.5 py-0.5 rounded text-sm">SV1RC5DGv</span> in the referral field — or use your promoter&apos;s code.</span></> },
                { step: '02', title: 'Book Your Service', desc: 'Use the app to book a service — hair, makeup, nails, lashes, brows, barber, pedicure, massage, skincare, or any category. First 30 approved applicants get up to ₦20,000 in app credit.' },
                { step: '03', title: 'Create Your Video', desc: 'Film a 30–90 second vertical video (9:16). Pick any content style — before & after, booking walkthrough, GRWM, testimonial, or your own creative angle. Make it real. Make it you.' },
                { step: '04', title: 'Register & Submit', desc: 'Register your interest using the button on this page. Post on TikTok (tag @lookrealapp) and Instagram as a Reel (collab @lookreal). Use #LookReal #BookedAndGlowing #LookRealChallenge. Then submit your video links.' },
              ].map(s => (
                <motion.div key={s.step} variants={fadeUp}
                  className="flex gap-4 sm:gap-6 items-start bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-6 hover:border-white/[0.12] transition-colors">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary font-black text-sm">{s.step}</span>
                  </div>
                  <div className="pt-1 min-w-0">
                    <h3 className="text-base font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ WHO CAN ENTER ══ */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-black mb-3">This challenge is for you if…</h2>
          </motion.div>

          <div className="space-y-3 mb-14">
            {[
              'You are 18 or older and based anywhere in Lagos, Nigeria.',
              'You create content on TikTok or Instagram — beauty, lifestyle, fashion, grooming, wellness, or any style.',
              'You have or will have a real LookReal booking to document. (Sponsored credit for first 30 applicants.)',
              'You are comfortable on camera — or letting your screen recording do the talking.',
              'Your TikTok is public and your Instagram can post Reels.',
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex gap-4 items-start bg-white/[0.03] border border-white/[0.06] rounded-2xl px-5 py-4">
                <span className="w-6 h-6 rounded-lg bg-primary/15 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <p className="text-white/75 text-sm leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-center text-xs text-white/40 mb-5 uppercase tracking-wider">Every service category is eligible</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
              {SERVICES.map(s => (
                <motion.div key={s.name} whileHover={{ scale: 1.04, borderColor: 'rgba(233,30,140,0.3)' }}
                  className="bg-white/[0.03] border border-white/[0.07] rounded-xl py-3.5 px-2 text-center cursor-default transition-all">
                  <span className="text-xl">{s.emoji}</span>
                  <p className="text-white/55 mt-1.5 text-xs leading-tight">{s.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ 10 IDEAS CAROUSEL ══ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-primary uppercase tracking-widest text-xs font-bold mb-3">Content Ideas</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black mb-3">Not sure what to create?</h2>
            <p className="text-white/45 text-sm">Pick any of these 10 video styles. Make it yours.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <IdeaCarousel />
          </motion.div>
        </div>
      </section>

      {/* ══ WHY LOOKREAL ══ */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-primary uppercase tracking-widest text-xs font-bold mb-3">About the App</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black mb-4">Why LookReal?</h2>
            <p className="text-white/55 text-sm leading-relaxed max-w-lg mx-auto mb-12">
              LookReal is Nigeria&apos;s beauty and wellness booking marketplace. We connect you with trusted, nearby professionals — hair, makeup, nails, lashes, brows, barbers, massage, pedicure, skincare — all in one platform. No DM back-and-forth. No ghosting. Just book.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-12">
              {[{ val: '2,000+', label: 'Active Users' }, { val: '100+', label: 'Active Vendors' }, { val: '4.8 ⭐', label: 'App Rating' }].map(s => (
                <div key={s.label} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl py-6 px-3">
                  <p className="text-2xl sm:text-3xl font-black text-primary">{s.val}</p>
                  <p className="text-xs text-white/45 mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center flex-wrap mb-10">
              <a href="https://apps.apple.com/ng/app/lookreal/id6749508043" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.12] text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.inuud.sharplook" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white/[0.06] border border-white/[0.12] text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.24.98.2l12.87-12.86L13.5 7.57 3.18 23.76zm17.74-9.37l-2.77-1.6-3.12 3.12 3.12 3.12 2.8-1.61c.8-.46.8-1.57-.03-2.03zM3.22.24C2.9.04 2.54-.04 2.18.03L14.89 12.74l-3.08-3.08L3.22.24zm7.54 10.26L.98.42C.38.76 0 1.41 0 2.18v19.64c0 .77.38 1.42.98 1.76l10.81-10.81-1.03-2.27z"/></svg>
                Google Play
              </a>
            </div>
            <PinkBtn className="px-8 py-3.5 text-sm">Enter the Challenge →</PinkBtn>
          </motion.div>
        </div>
      </section>

      {/* ══ RULES ══ */}
      <section className="relative z-10 py-24 px-4 sm:px-6 bg-white/[0.015]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-primary uppercase tracking-widest text-xs font-bold mb-3">Competition Rules</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black">The Rules — Plain and Simple</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden divide-y divide-white/[0.05]">
            {RULES.map(([rule, detail]) => (
              <div key={rule} className="flex gap-4 sm:gap-6 px-5 sm:px-6 py-4 hover:bg-white/[0.03] transition-colors">
                <span className="font-bold text-primary text-sm shrink-0 w-28 sm:w-36 pt-0.5">{rule}</span>
                <span className="text-white/65 text-sm leading-relaxed">{detail}</span>
              </div>
            ))}
          </motion.div>
          <p className="text-white/35 text-xs mt-5 text-center">By submitting, you grant LookReal a non-exclusive, royalty-free licence to repost and use your content for organic social media, with credit.</p>
        </div>
      </section>

      {/* ══ BRIDGE / CTA ══ */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary/8 to-transparent border border-primary/25 rounded-3xl p-8 sm:p-12 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 blur-[60px] rounded-full" />
              <div className="relative z-10">
                <p className="text-primary uppercase tracking-widest text-xs font-bold mb-4">Already Registered?</p>
                <h2 className="text-2xl sm:text-3xl font-display font-black mb-4">Ready to Submit Your Entry?</h2>
                <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                  If you&apos;ve already registered and created your content, head to the submission page and lock in your shot at ₦500,000.
                </p>
                <a href="/challenge/submit"
                  className="inline-flex items-center gap-2 bg-[#E91E8C] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#c2185b] transition-all shadow-xl shadow-primary/30 hover:scale-105">
                  Submit My Entry Now →
                </a>
                <p className="text-white/35 text-xs mt-5">
                  Haven&apos;t registered yet?{' '}
                  <button onClick={openModal} className="text-primary hover:underline">Register your interest first.</button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ REGISTER CTA ══ */}
      <section id="interest-form" className="relative z-10 py-24 px-4 sm:px-6 bg-white/[0.015] scroll-mt-24">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-primary uppercase tracking-widest text-xs font-bold mb-4">Step 1</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black mb-4">Register Your Interest</h2>
            <p className="text-white/50 text-sm mb-10 leading-relaxed max-w-sm mx-auto">Tell us about yourself. We&apos;ll send you everything you need. Takes 2 minutes.</p>
            <PinkBtn className="px-12 py-5 text-lg">Register My Interest →</PinkBtn>
            <p className="text-white/30 text-xs mt-5">Free to enter. Open to Lagos creators 18+.</p>
          </motion.div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-primary uppercase tracking-widest text-xs font-bold mb-3">Got Questions?</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black">Frequently Asked Questions</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-5 sm:px-8">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </motion.div>
        </div>
      </section>

      {/* ══ SHARE ══ */}
      <section className="relative z-10 py-20 px-4 sm:px-6 bg-white/[0.015]">
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl font-display font-black mb-3">Know someone who should enter?</h2>
            <p className="text-white/50 text-sm mb-8">Send them the link — ₦250,000 is a lot to keep to yourself.</p>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              href={`https://api.whatsapp.com/send?text=${WHATSAPP_MSG}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] text-white px-7 py-3.5 rounded-full font-bold hover:bg-[#20b558] transition-colors shadow-lg shadow-green-600/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Share on WhatsApp
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-display font-black mb-3">Still reading? That means you should enter.</h2>
            <p className="text-white/50 text-sm mb-10">Register before the deadline. ₦250,000 is waiting.</p>
            <PinkBtn className="px-10 py-4 text-base mb-14">Register Your Interest →</PinkBtn>
            <p className="text-white/40 text-sm mb-5">Submissions close:</p>
            <CountdownTimer deadline={DEADLINE} />
            <div className="mt-12 flex gap-3 justify-center flex-wrap">
              <a href="https://apps.apple.com/ng/app/lookreal/id6749508043" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.10] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.inuud.sharplook" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.10] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.24.98.2l12.87-12.86L13.5 7.57 3.18 23.76zm17.74-9.37l-2.77-1.6-3.12 3.12 3.12 3.12 2.8-1.61c.8-.46.8-1.57-.03-2.03zM3.22.24C2.9.04 2.54-.04 2.18.03L14.89 12.74l-3.08-3.08L3.22.24zm7.54 10.26L.98.42C.38.76 0 1.41 0 2.18v19.64c0 .77.38 1.42.98 1.76l10.81-10.81-1.03-2.27z"/></svg>
                Google Play
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ TRUST BAR ══ */}
      <div className="relative z-10 border-t border-white/[0.06] bg-white/[0.02] py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3 items-center justify-center text-xs text-white/40">
          <span className="font-bold text-white/60">LookReal</span>
          <span>·</span><span>2,000+ Active Users</span>
          <span>·</span><span>100+ Active Vendors</span>
          <span>·</span><span>4.8-Star Rating</span>
          <span>·</span><span>iOS &amp; Android</span>
        </div>
        <p className="text-center text-[11px] text-white/30 mt-2">@lookreal on Instagram · @lookrealapp on TikTok · lookreal.beauty</p>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-5 px-4 border-t border-white/[0.05] text-center text-xs text-white/30">
        #LookReal #BookedAndGlowing #LookRealChallenge &nbsp;|&nbsp;
        <a href="#" className="hover:text-primary transition-colors">Official Rules</a> &nbsp;|&nbsp;
        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a> &nbsp;|&nbsp;
        © LookReal Nigeria 2026
      </footer>

      {/* ── Sticky mobile CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden px-4 pb-4 pt-3 bg-gradient-to-t from-[#090d16] to-transparent pointer-events-none">
        <button onClick={openModal} className="pointer-events-auto w-full bg-[#E91E8C] text-white py-4 rounded-2xl font-bold text-base shadow-2xl shadow-[#E91E8C]/40 active:scale-[0.98] transition-all">
          Register Your Interest →
        </button>
      </div>
    </main>
  )
}
