'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

/* ───────── helpers ───────── */

function CountdownTimer({ deadline }: { deadline: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(deadline).getTime() - Date.now()
      if (diff <= 0) return setTime({ days: 0, hours: 0, minutes: 0 })
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      })
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [deadline])

  return (
    <div className="flex gap-4 justify-center text-center">
      {[
        { v: time.days, l: 'Days' },
        { v: time.hours, l: 'Hours' },
        { v: time.minutes, l: 'Minutes' },
      ].map((t) => (
        <div key={t.l} className="bg-white/10 backdrop-blur rounded-xl px-5 py-3 min-w-[80px]">
          <span className="text-3xl font-bold font-display">{t.v}</span>
          <p className="text-xs text-white/60 mt-1">{t.l}</p>
        </div>
      ))}
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-4 flex justify-between items-center gap-4 hover:bg-white/5 transition-colors"
      >
        <span className="font-semibold text-sm md:text-base">{q}</span>
        <span className="text-xl shrink-0">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-white/70 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────── constants ───────── */

const DEADLINE = '2026-05-15T23:59:00+01:00' // WAT — update to real deadline

const WHATSAPP_MSG = encodeURIComponent(
  'Hey! LookReal is running the Booked & Glowing Challenge — a creator competition where you can win up to ₦250,000 just for sharing your beauty experience on TikTok and Instagram. Check it out: https://lookreal.ng/challenge'
)

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

const RULES = [
  ['Video Length', '30–90 seconds'],
  ['Format', 'Vertical (9:16) only'],
  ['Resolution', 'Minimum 1080p'],
  ['Originality', 'Newly created for this campaign — no recycled content'],
  ['One Entry', 'One submission per person'],
  ['Both Platforms', 'Must post on TikTok AND Instagram'],
  ['TikTok', 'Post publicly. Tag @LookRealNG. Use #BookedAndGlowing #LookRealChallenge #LookRealNG #BeautyNearMe #LagosBeauty'],
  ['Instagram', 'Post as a Reel. Collab-invite @LookRealNG. Same hashtags.'],
  ['No Watermarks', 'Upload separately to each platform — no TikTok watermarks on IG'],
  ['LookReal Must Feature', 'The app must appear visually or be clearly referenced'],
  ['Caption', 'Minimum 50 words — tell your story'],
  ['Age & Location', '18+ and based in Lagos, Nigeria'],
  ['Eligibility', 'Open to all genders, all service categories'],
]

const FAQS: { q: string; a: string }[] = [
  { q: 'Who can enter the challenge?', a: 'Anyone 18 or older, based in Lagos, Nigeria. Both men and women are welcome. You don\'t need to be a professional creator — if you have a story to tell and a camera, you can enter.' },
  { q: 'Do I need to already be on LookReal?', a: 'You need to feature a LookReal booking in your video, so yes — you need to create an account and make at least one booking. Download the app at lookreal.beauty on iOS or Android.' },
  { q: 'What are the sponsored spots?', a: 'The first 30 creators who apply, pass our approval check, and sign a participation agreement will receive up to ₦20,000 in LookReal app credit to cover their service booking. Once those 30 spots are filled, all remaining participants are self-funded.' },
  { q: 'Do I really have to post on both TikTok AND Instagram?', a: 'Yes. Both platforms are required. An entry posted on only one platform will be disqualified. You can upload the same video to both, but do not cross-post the TikTok version with its watermark to Instagram — upload separately.' },
  { q: 'What is the Instagram Collab feature and how do I use it?', a: 'The Collab feature lets you co-author a post with another account. When posting your Reel, tap \'Invite Collaborator\' and search for @LookRealNG. Once we accept, the post will appear on both profiles. This is mandatory for all Instagram entries.' },
  { q: 'How are winners chosen?', a: 'An internal judging panel scores every entry against 8 criteria: hook strength, feature integration, brand clarity, authenticity, result/transformation, watchability, platform execution, and ad potential. Public engagement counts for 20 points out of 100. Your follower count does not determine the winner — your content does.' },
  { q: 'When will winners be announced?', a: 'Winners will be announced approximately 7 days after the submission deadline — on LookReal\'s TikTok and Instagram pages. All winners will also be notified privately via DM before the public announcement.' },
  { q: 'How and when are prizes paid?', a: 'Cash prizes are paid by bank transfer to a Nigerian account within 5 business days of the winner announcement. LookReal app credits are added to your account immediately. Retainership terms are formalised with the top 2 winners after the announcement.' },
  { q: 'Can I enter if my favourite vendor is not on LookReal yet?', a: 'Yes — and we encourage you to invite them to sign up as a vendor on LookReal before you book. Once they\'re on the platform, you can find them, communicate through the app, and book them properly.' },
  { q: 'What if I have more questions?', a: 'DM @LookRealNG on Instagram or TikTok and we will reply as quickly as possible. You can also check the full Creator Brief PDF linked above.' },
]

const SERVICES = [
  { emoji: '💇‍♀️', name: 'Hairstylists' },
  { emoji: '💅', name: 'Nail Technicians' },
  { emoji: '💄', name: 'Makeup Artists' },
  { emoji: '👁️', name: 'Lash Technicians' },
  { emoji: '✂️', name: 'Barbers' },
  { emoji: '🦶', name: 'Pedicurists' },
  { emoji: '💆', name: 'Massage Therapists' },
  { emoji: '🌿', name: 'Skincare Professionals' },
  { emoji: '🎨', name: 'Brow Technicians' },
  { emoji: '🧖', name: 'Wellness Professionals' },
]

const CONTENT_LANE_OPTIONS = [
  'Before & After', 'Booked on LookReal', 'No More DM Stress', 'Vendor Near Me',
  'Event Prep', 'Trust Testimonial', 'GRWM', 'Men Book Too',
  'Wellness & Body Care', 'The Negotiation', 'My Own Angle',
]

const SERVICE_OPTIONS = [
  'Hair', 'Nails', 'Makeup', 'Lashes', 'Brows', 'Barber',
  'Pedicure', 'Massage', 'Skincare', 'Wellness', 'Other',
]

/* ───────── main page ───────── */

export default function ChallengePage() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', whatsapp: '', city: '',
    tiktok: '', instagram: '', tiktokLink: '', igLink: '',
    contentLane: '', serviceCategory: '', story: '',
    sponsored: '', confirmFeatured: false, confirmPermission: false,
    confirmAge: false, confirmRules: false, optIn: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = (field: string, value: string | boolean) =>
    setFormData((p) => ({ ...p, [field]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.fullName.trim()) e.fullName = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required'
    if (!formData.whatsapp.trim()) e.whatsapp = 'Required'
    if (!formData.city.trim()) e.city = 'Required'
    if (!formData.tiktok.startsWith('@')) e.tiktok = 'Must start with @'
    if (!formData.instagram.startsWith('@')) e.instagram = 'Must start with @'
    if (!formData.tiktokLink.includes('tiktok.com')) e.tiktokLink = 'Must be a valid TikTok URL'
    if (!formData.igLink.includes('instagram.com')) e.igLink = 'Must be a valid Instagram URL'
    if (!formData.contentLane) e.contentLane = 'Required'
    if (!formData.serviceCategory) e.serviceCategory = 'Required'
    if (!formData.story.trim()) e.story = 'Required'
    if (formData.story.trim().split(/\s+/).length > 200) e.story = 'Max 200 words'
    if (!formData.sponsored) e.sponsored = 'Required'
    if (!formData.confirmFeatured) e.confirmFeatured = 'Required'
    if (!formData.confirmPermission) e.confirmPermission = 'Required'
    if (!formData.confirmAge) e.confirmAge = 'Required'
    if (!formData.confirmRules) e.confirmRules = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) setSubmitted(true)
  }

  const wordCount = formData.story.trim() ? formData.story.trim().split(/\s+/).length : 0

  /* ─── animation variants ─── */
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  } as const

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  } as const

  return (
    <main className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated bg */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-60" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-primary-light/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Nav */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-primary/20">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center max-w-7xl">
          <a href="/" className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="LookReal" className="w-10 h-10 rounded-xl" />
            <span className="text-2xl font-display font-bold">LookReal</span>
          </a>
          <a href="#submission-form" className="bg-gradient-to-r from-primary to-primary-light px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all text-sm">
            Enter Now
          </a>
        </div>
      </motion.nav>

      {/* ═══════ S1 — HERO ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
            LookReal presents
          </motion.p>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            Booked &amp; Glowing<br />Challenge
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-white/80 mb-3">
            Show us your LookReal experience. Win up to <span className="text-primary font-bold">₦250,000</span>.
          </motion.p>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="text-white/60 max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
            Create a short video showing how LookReal changed your beauty game — booking a vendor, finding someone nearby, getting the transformation. Post it on TikTok and Instagram. Win real money.
          </motion.p>
          <motion.a
            href="#submission-form"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-[#C2185B] text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all"
          >
            Enter the Challenge Now
          </motion.a>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="mt-5 text-yellow-400/90 text-sm font-medium">
            Sponsored spots for the first 30 entries only. Limited credits available.
          </motion.p>

          {/* Hero Stats */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }} className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { val: '₦500,000', label: 'Total Prize Pool' },
              { val: '21 Days', label: 'Campaign Window' },
              { val: 'TikTok + IG', label: 'Post on Both' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur rounded-xl py-4 px-2">
                <p className="text-lg md:text-xl font-bold text-primary">{s.val}</p>
                <p className="text-[11px] text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ S2 — PRIZES ═══════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <p className="text-primary uppercase tracking-widest text-sm mb-3">What You Can Win</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">₦500,000 in prizes. Real money. Real bookings. Real opportunity.</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {/* 1st */}
            <motion.div variants={fadeUp} className="bg-gradient-to-b from-amber-500/20 to-amber-900/10 border border-amber-500/30 rounded-2xl p-8 text-center">
              <p className="text-5xl mb-3">🥇</p>
              <p className="text-sm uppercase tracking-widest text-amber-400 mb-2">1st Place</p>
              <p className="text-4xl font-display font-bold mb-4">₦250,000</p>
              <div className="text-sm text-white/70 space-y-1">
                <p>₦200,000 Cash</p>
                <p>₦50,000 LookReal Credit</p>
                <p className="text-amber-400 font-semibold mt-2">+ Monthly Retainership</p>
              </div>
            </motion.div>
            {/* 2nd */}
            <motion.div variants={fadeUp} className="bg-gradient-to-b from-gray-400/20 to-gray-700/10 border border-gray-400/30 rounded-2xl p-8 text-center">
              <p className="text-5xl mb-3">🥈</p>
              <p className="text-sm uppercase tracking-widest text-gray-300 mb-2">2nd Place</p>
              <p className="text-4xl font-display font-bold mb-4">₦150,000</p>
              <div className="text-sm text-white/70 space-y-1">
                <p>₦100,000 Cash</p>
                <p>₦50,000 App Booking Credit</p>
                <p className="text-gray-300 font-semibold mt-2">+ Monthly Retainership</p>
              </div>
            </motion.div>
            {/* 3rd */}
            <motion.div variants={fadeUp} className="bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
              <p className="text-5xl mb-3">🥉</p>
              <p className="text-sm uppercase tracking-widest text-emerald-400 mb-2">3rd Place</p>
              <p className="text-4xl font-display font-bold mb-4">₦100,000</p>
              <div className="text-sm text-white/70 space-y-1">
                <p>₦70,000 Cash</p>
                <p>₦30,000 App Booking Credit</p>
                <p className="text-emerald-400 font-semibold mt-2">+ Creator Circle Invite</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-10 bg-white/5 rounded-xl p-6 text-sm text-white/70 space-y-3">
            <p><strong className="text-white">Retainership:</strong> Winners of 1st and 2nd place will be offered a paid monthly content creation contract with LookReal — 2 to 4 videos per month, minimum 3 months. Full terms confirmed after announcement.</p>
            <p><strong className="text-white">Credits:</strong> LookReal credits are redeemable for any beauty or wellness booking on the LookReal app. Cash prizes are paid by bank transfer to a Nigerian account within 5 business days of the winner announcement.</p>
          </motion.div>

          <div className="text-center mt-8">
            <a href="#submission-form" className="text-primary font-semibold hover:underline">Ready to compete? Enter below →</a>
          </div>
        </div>
      </section>

      {/* ═══════ S3 — HOW IT WORKS ═══════ */}
      <section className="relative z-10 py-20 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">How to Enter</h2>
            <p className="text-white/60">Four steps between you and ₦250,000.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
            {[
              { step: '01', title: 'Download LookReal', desc: 'Get the app on iOS or Android. Create your account or log in at lookreal.beauty. Find a beauty or wellness professional near you.' },
              { step: '02', title: 'Book Your Service', desc: 'Use the app to book a service — hair, makeup, nails, lashes, brows, barbershop, pedicure, massage, skincare, or any category on the platform. First 30 approved applicants get up to ₦20,000 in app credit to cover their service.' },
              { step: '03', title: 'Create Your Video', desc: 'Film a 30–90 second vertical video (9:16) about your LookReal experience. Pick any content style — before & after, booking walkthrough, vendor discovery, event prep, GRWM, testimonial, or your own creative angle. Make it real. Make it you.' },
              { step: '04', title: 'Post & Submit', desc: 'Post on TikTok (tag @LookRealNG, add #BookedAndGlowing #LookRealChallenge #LookRealNG). Post on Instagram as a Reel using the Collab feature to invite @LookRealNG. Then submit your video links using the form on this page.' },
            ].map((s) => (
              <motion.div key={s.step} variants={fadeUp} className="flex gap-6 items-start bg-white/5 rounded-2xl p-6">
                <span className="text-3xl md:text-4xl font-display font-bold text-primary shrink-0">{s.step}</span>
                <div>
                  <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ S4 — WHO CAN ENTER ═══════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">This challenge is for you if…</h2>
            <div className="space-y-4 mb-12">
              {[
                'You are 18 or older and based anywhere in Lagos, Nigeria.',
                'You create content on TikTok or Instagram — beauty, lifestyle, fashion, grooming, wellness, comedy, or any style that feels natural to you.',
                'You have or will have a real LookReal booking to document. (Sponsored credit available for the first 30 approved applicants.)',
                'You are comfortable on camera — or comfortable letting your screen recording do the talking.',
                'Your TikTok account is public and your Instagram can post Reels.',
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-primary mt-1 shrink-0">✓</span>
                  <p className="text-white/80 text-sm md:text-base">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-white/50 mb-6">Every service category on LookReal is eligible:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {SERVICES.map((s) => (
                <div key={s.name} className="bg-white/5 rounded-xl py-3 px-4 text-center text-sm">
                  <span className="text-lg">{s.emoji}</span>
                  <p className="text-white/70 mt-1 text-xs">{s.name}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-white/50 text-sm mt-6">
              Men are welcome. Women are welcome. Every service. Every creator style. If it happened on LookReal, we want to see it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ S5 — CONTENT INSPIRATION ═══════ */}
      <section className="relative z-10 py-20 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Not sure what to create? Here are 10 ideas.</h2>
            <p className="text-white/60 text-sm">Pick the one that fits your style. Make it yours.</p>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
            {CONTENT_LANES.map((lane) => (
              <motion.div
                key={lane.n}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 min-w-[280px] snap-center shrink-0 md:min-w-0 md:shrink"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-primary/20 text-primary font-display font-bold w-8 h-8 rounded-lg flex items-center justify-center text-sm">{lane.n}</span>
                  <h3 className="font-bold text-sm">{lane.name}</h3>
                </div>
                <p className="text-white/70 text-sm mb-3">{lane.desc}</p>
                <p className="text-primary/80 text-xs italic">{lane.hook}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ S6 — WHY LOOKREAL ═══════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Why LookReal?</h2>
            <p className="text-white/50 mb-6 text-sm">Because booking beauty in Lagos should not be this hard.</p>
            <p className="text-white/70 text-sm leading-relaxed max-w-xl mx-auto mb-10">
              LookReal is Nigeria&apos;s beauty and wellness booking marketplace. We connect you with trusted, nearby professionals — hair, makeup, nails, lashes, brows, barbers, massage, pedicure, skincare — all in one platform. No DM back-and-forth. No ghosting. No uncertainty. Just book.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { val: '10,000+', label: 'Active Users' },
                { val: '500+', label: 'Verified Vendors' },
                { val: '4.8 ⭐', label: 'App Rating' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 rounded-xl py-5">
                  <p className="text-xl md:text-2xl font-bold text-primary">{s.val}</p>
                  <p className="text-xs text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-sm mb-4">Available on iOS and Android | lookreal.beauty</p>
            <div className="flex gap-4 justify-center">
              <a href="#" className="bg-white text-black px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors">App Store</a>
              <a href="#" className="bg-white text-black px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors">Google Play</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ S7 — RULES ═══════ */}
      <section className="relative z-10 py-20 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">The Rules — Plain and Simple</h2>
            <div className="space-y-3">
              {RULES.map(([rule, detail]) => (
                <div key={rule} className="flex gap-4 bg-white/5 rounded-xl px-5 py-4 text-sm">
                  <span className="font-bold text-primary shrink-0 min-w-[120px]">{rule}</span>
                  <span className="text-white/70">{detail}</span>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-xs mt-6 text-center">
              By submitting, you grant LookReal a non-exclusive, royalty-free licence to repost and use your content for organic social media, with credit.
            </p>
            <p className="text-center mt-4">
              <a href="#" className="text-primary text-sm hover:underline">→ Read the full Terms &amp; Conditions</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ S8 — SUBMISSION FORM ═══════ */}
      <section id="submission-form" className="relative z-10 py-20 px-6 scroll-mt-24">
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-center">Submit Your Entry</h2>
            <p className="text-white/60 text-sm text-center mb-10">Fill in all required fields. Double-check your video links before submitting.</p>

            {submitted ? (
              <div className="bg-white/5 border border-primary/30 rounded-2xl p-10 text-center">
                <p className="text-4xl mb-4">🎉</p>
                <h3 className="text-xl font-bold mb-3">Your entry has been received!</h3>
                <p className="text-white/70 text-sm mb-8">We&apos;ll review your submission and be in touch. Good luck — Team LookReal.</p>

                <p className="text-white/50 text-sm mb-4">While you wait — share this challenge with a friend who should enter:</p>
                <div className="flex gap-3 justify-center">
                  <a
                    href={`https://api.whatsapp.com/send?text=${WHATSAPP_MSG}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
                  >
                    Share on WhatsApp
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText('https://lookreal.ng/challenge')}
                    className="bg-white/10 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Text inputs */}
                {[
                  { field: 'fullName', label: 'Full Name *', placeholder: 'Your legal name', type: 'text' },
                  { field: 'email', label: 'Email Address *', placeholder: 'your@email.com', type: 'email' },
                  { field: 'whatsapp', label: 'WhatsApp Number *', placeholder: '+234 xxx xxx xxxx', type: 'tel' },
                  { field: 'city', label: 'City / Area in Lagos *', placeholder: 'e.g. Lekki, Ikeja, Yaba, Surulere', type: 'text' },
                  { field: 'tiktok', label: 'TikTok Username *', placeholder: '@yourhandle', type: 'text' },
                  { field: 'instagram', label: 'Instagram Username *', placeholder: '@yourhandle', type: 'text' },
                  { field: 'tiktokLink', label: 'TikTok Video Link *', placeholder: 'Paste your TikTok video URL here', type: 'url' },
                  { field: 'igLink', label: 'Instagram Reel Link *', placeholder: 'Paste your Instagram Reel URL here', type: 'url' },
                ].map(({ field, label, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1.5">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={formData[field as keyof typeof formData] as string}
                      onChange={(e) => updateField(field, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
                  </div>
                ))}

                {/* Dropdowns */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Content Lane / Category *</label>
                  <select
                    value={formData.contentLane}
                    onChange={(e) => updateField('contentLane', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option value="" className="bg-slate-900">Select your content type</option>
                    {CONTENT_LANE_OPTIONS.map((o) => (
                      <option key={o} value={o} className="bg-slate-900">{o}</option>
                    ))}
                  </select>
                  {errors.contentLane && <p className="text-red-400 text-xs mt-1">{errors.contentLane}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Service Category Shown *</label>
                  <select
                    value={formData.serviceCategory}
                    onChange={(e) => updateField('serviceCategory', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option value="" className="bg-slate-900">Which LookReal service did you feature?</option>
                    {SERVICE_OPTIONS.map((o) => (
                      <option key={o} value={o} className="bg-slate-900">{o}</option>
                    ))}
                  </select>
                  {errors.serviceCategory && <p className="text-red-400 text-xs mt-1">{errors.serviceCategory}</p>}
                </div>

                {/* Story textarea */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Your Story (max 200 words) *</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your video in a few sentences — what happened, which vendor you booked, and what the experience was like."
                    value={formData.story}
                    onChange={(e) => updateField('story', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                  <p className={`text-xs mt-1 ${wordCount > 200 ? 'text-red-400' : 'text-white/40'}`}>{wordCount}/200 words</p>
                  {errors.story && <p className="text-red-400 text-xs mt-1">{errors.story}</p>}
                </div>

                {/* Sponsored radio */}
                <div>
                  <label className="block text-sm font-medium mb-2">Are you applying for a sponsored spot? *</label>
                  <div className="space-y-2">
                    <label className="flex gap-3 items-start bg-white/5 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors">
                      <input type="radio" name="sponsored" value="yes" checked={formData.sponsored === 'yes'} onChange={() => updateField('sponsored', 'yes')} className="mt-0.5 accent-primary" />
                      <span className="text-sm text-white/80">Yes — I am applying for the ₦20k service credit (first 30 spots)</span>
                    </label>
                    <label className="flex gap-3 items-start bg-white/5 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors">
                      <input type="radio" name="sponsored" value="no" checked={formData.sponsored === 'no'} onChange={() => updateField('sponsored', 'no')} className="mt-0.5 accent-primary" />
                      <span className="text-sm text-white/80">No — I am self-funded</span>
                    </label>
                  </div>
                  {errors.sponsored && <p className="text-red-400 text-xs mt-1">{errors.sponsored}</p>}
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  {[
                    { field: 'confirmFeatured', label: 'I confirm I have featured the LookReal app in my video *' },
                    { field: 'confirmPermission', label: 'I grant LookReal permission to repost and use my content for brand purposes *' },
                    { field: 'confirmAge', label: 'I confirm I am 18 or older and based in Lagos *' },
                    { field: 'confirmRules', label: 'I agree to the official competition rules and terms *' },
                  ].map(({ field, label }) => (
                    <label key={field} className="flex gap-3 items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[field as keyof typeof formData] as boolean}
                        onChange={(e) => updateField(field, e.target.checked)}
                        className="mt-0.5 accent-primary"
                      />
                      <span className="text-sm text-white/70">{label}</span>
                    </label>
                  ))}
                  <label className="flex gap-3 items-start cursor-pointer">
                    <input type="checkbox" checked={formData.optIn} onChange={(e) => updateField('optIn', e.target.checked)} className="mt-0.5 accent-primary" />
                    <span className="text-sm text-white/50">I&apos;d like to receive updates about future LookReal creator campaigns (optional)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C2185B] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a01548] transition-colors shadow-lg shadow-primary/30"
                >
                  Submit My Entry
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════ S9 — FAQ ═══════ */}
      <section className="relative z-10 py-20 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ S10 — TRUST BAR ═══════ */}
      <section className="relative z-10 py-8 px-6 bg-primary/10 border-y border-primary/20">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 items-center justify-center text-sm text-white/70 text-center">
          <span className="font-display font-bold text-white">LookReal</span>
          <span>10,000+ Active Users</span>
          <span>500+ Verified Vendors</span>
          <span>4.8-Star App Rating</span>
          <span>Available on iOS &amp; Android</span>
        </div>
        <p className="text-center text-xs text-white/40 mt-3">Follow us: @LookRealNG on TikTok &amp; Instagram | lookreal.beauty</p>
      </section>

      {/* ═══════ S11 — WHATSAPP SHARE ═══════ */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl font-display font-bold mb-3">Know someone who should enter?</h2>
            <p className="text-white/60 text-sm mb-6">Send them the link — ₦250,000 is a lot to keep to yourself.</p>
            <a
              href={`https://api.whatsapp.com/send?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-green-700 transition-colors"
            >
              📲 Share on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════ S12 — FOOTER CTA ═══════ */}
      <section className="relative z-10 py-20 px-6 bg-white/[0.02]">
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">Still reading? That means you should enter.</h2>
            <p className="text-white/60 text-sm mb-6">Submit your entry before the deadline. ₦250,000 is waiting.</p>

            <a
              href="#submission-form"
              className="inline-block bg-[#C2185B] text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all hover:scale-105"
            >
              Enter the Challenge Now
            </a>

            <div className="mt-10">
              <p className="text-white/50 text-sm mb-4">Submissions close:</p>
              <CountdownTimer deadline={DEADLINE} />
            </div>

            <div className="mt-10">
              <p className="text-white/50 text-sm mb-4">Download LookReal</p>
              <div className="flex gap-4 justify-center">
                <a href="#" className="bg-white text-black px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors">App Store</a>
                <a href="#" className="bg-white text-black px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors">Google Play</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-6 border-t border-white/10 text-center text-xs text-white/40">
        <p>#BookedAndGlowing | <a href="#" className="hover:text-primary">Official Rules</a> | <a href="#" className="hover:text-primary">Privacy Policy</a> | © LookReal Nigeria 2026 | lookreal.beauty</p>
      </footer>
    </main>
  )
}
