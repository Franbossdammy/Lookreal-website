'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Footer from '../../_components/Footer'
import { Reveal, Eyebrow } from '../../_components/Primitives'

const CONTENT_LANE_OPTIONS = ['Before & After', 'Booked on LookReal', 'No More DM Stress', 'Vendor Near Me', 'Event Prep', 'Trust Testimonial', 'GRWM', 'Men Book Too', 'Wellness & Body Care', 'The Negotiation', 'My Own Angle']
const SERVICE_OPTIONS = ['Hair', 'Nails', 'Makeup', 'Lashes', 'Brows', 'Barber', 'Pedicure', 'Massage', 'Skincare', 'Wellness', 'Other']

function Toast({ type, message, onClose }: { type: 'success' | 'error'; message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t) }, [onClose])
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      className={`fixed top-6 right-4 sm:right-6 z-[400] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl max-w-[360px] border bg-white ${type === 'success' ? 'border-emerald-200' : 'border-red-200'}`}
    >
      <span className="text-xl shrink-0 mt-0.5">{type === 'success' ? '✓' : '⚠'}</span>
      <p className={`text-sm leading-relaxed flex-1 ${type === 'success' ? 'text-emerald-900' : 'text-red-900'}`}>{message}</p>
      <button onClick={onClose} className="shrink-0 text-ink/30 hover:text-ink text-xl leading-none">×</button>
    </motion.div>
  )
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink/60">{children}</label>
)

const SectionCard = ({ num, title, children }: { num: string; title: string; children: React.ReactNode }) => (
  <Reveal>
    <div className="bg-canvas-soft border border-line rounded-3xl p-6 sm:p-9 space-y-6">
      <div className="flex items-center gap-4 pb-5 border-b border-line">
        <span className="w-10 h-10 rounded-full bg-ink text-white font-mono text-sm flex items-center justify-center shrink-0">{num}</span>
        <h2 className="font-display text-2xl tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  </Reveal>
)

export default function SubmitPage() {
  const [form, setForm] = useState({ fullName: '', email: '', whatsapp: '', cityLagos: '', tiktok: '', instagram: '', tiktokLink: '', igLink: '', contentLane: '', serviceCategory: '', story: '', sponsored: '', consent1: false, consent2: false, consent3: false })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }))
  const wordCount = form.story.trim() ? form.story.trim().split(/\s+/).length : 0

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setPhotoError('')
    if (!f) { setPhotoFile(null); return }
    if (!['image/jpeg', 'image/png'].includes(f.type)) { setPhotoError('Only JPG or PNG files are accepted.'); return }
    if (f.size > 10 * 1024 * 1024) { setPhotoError('File must be under 10 MB.'); return }
    setPhotoFile(f)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.whatsapp.trim()) e.whatsapp = 'Required'
    if (!form.cityLagos.trim()) e.cityLagos = 'Required'
    if (!form.tiktok.trim()) e.tiktok = 'Required'
    if (!form.instagram.trim()) e.instagram = 'Required'
    if (!form.tiktokLink.trim() || !/^https?:\/\/.+/.test(form.tiktokLink)) e.tiktokLink = 'Valid URL required'
    if (!form.igLink.trim() || !/^https?:\/\/.+/.test(form.igLink)) e.igLink = 'Valid URL required'
    if (!form.contentLane) e.contentLane = 'Required'
    if (!form.serviceCategory) e.serviceCategory = 'Required'
    if (!form.story.trim()) e.story = 'Required'
    if (wordCount > 200) e.story = 'Maximum 200 words'
    if (!form.sponsored) e.sponsored = 'Required'
    if (!form.consent1) e.consent1 = 'This consent is required'
    if (!form.consent2) e.consent2 = 'This consent is required'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) { document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    setSubmitting(true)
    try {
      const payload = new FormData()
      Object.entries(form).forEach(([k, v]) => payload.append(k, String(v)))
      if (photoFile) payload.append('photo', photoFile)
      const res = await fetch('/api/submit', { method: 'POST', body: payload })
      if (!res.ok) throw new Error('failed')
      setSubmitted(true)
      setToast({ type: 'success', msg: 'Entry received! Welcome to the Booked & Glowing Challenge.' })
    } catch { setToast({ type: 'error', msg: 'Something went wrong. Please try again or DM @lookreal on Instagram.' }) }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-canvas flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        </div>
        <AnimatePresence>{toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}</AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 22 }}
          className="max-w-md w-full text-center relative z-10 bg-canvas-soft border border-line rounded-[2.5rem] p-10 sm:p-14"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15, damping: 14 }} className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-7">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.div>
          <h1 className="font-display text-4xl font-light leading-tight tracking-tightest mb-4">Entry received.</h1>
          <p className="text-ink/60 leading-relaxed mb-8">
            Thank you for submitting your Booked &amp; Glowing entry. Our team will review it and be in touch. Good luck — Team LookReal.
          </p>
          <div className="space-y-3">
            <a href="https://chat.whatsapp.com/DpCjCwqhleaJnnduUSBg2P?mode=gi_t" target="_blank" rel="noopener noreferrer" className="btn-pill bg-[#25D366] text-white hover:bg-[#20b558] w-full">
              Join the WhatsApp group
            </a>
            <Link href="/challenge" className="block text-ink/40 py-3 text-sm hover:text-ink transition-colors ulink">← Back to challenge</Link>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="relative bg-canvas text-ink min-h-screen">
      <AnimatePresence>{toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}</AnimatePresence>

      <header className="relative border-b border-line bg-canvas/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-5">
          <Link href="/challenge" className="inline-flex items-center gap-2 text-ink/50 hover:text-ink text-sm transition-colors group mb-5">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to challenge
          </Link>
          <Eyebrow>Booked &amp; Glowing Challenge</Eyebrow>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-light leading-tight tracking-tightest">Submit your entry.</h1>
          <p className="text-ink/60 text-base leading-relaxed mt-3 max-w-xl">
            Fill in all required fields, double-check your video links, and claim your shot at ₦500,000.
          </p>
        </div>
      </header>

      <section className="relative py-10 md:py-14 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* 1 — Details */}
            <SectionCard num="01" title="Your details">
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { k: 'fullName', label: 'Full Name *', ph: 'Your full name', type: 'text' },
                  { k: 'email', label: 'Email Address *', ph: 'your@email.com', type: 'email' },
                  { k: 'whatsapp', label: 'WhatsApp Number *', ph: '+234 xxx xxx xxxx', type: 'tel' },
                  { k: 'cityLagos', label: 'City / Area in Lagos *', ph: 'e.g. Lekki, Ikeja, Yaba', type: 'text' },
                  { k: 'tiktok', label: 'TikTok Username *', ph: '@yourhandle', type: 'text' },
                  { k: 'instagram', label: 'Instagram Username *', ph: '@yourhandle', type: 'text' },
                ].map(({ k, label, ph, type }) => (
                  <div key={k}>
                    <Label>{label}</Label>
                    <input type={type} placeholder={ph} value={form[k as keyof typeof form] as string} onChange={(e) => set(k, e.target.value)} className={`field ${errors[k] ? 'border-red-400' : ''}`} />
                    {errors[k] && <p className="text-red-500 text-xs mt-1.5" data-error>{errors[k]}</p>}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* 2 — Video Links */}
            <SectionCard num="02" title="Your video links">
              {[
                { k: 'tiktokLink', label: 'TikTok Video Link *', ph: 'https://www.tiktok.com/@yourhandle/video/...' },
                { k: 'igLink', label: 'Instagram Reel Link *', ph: 'https://www.instagram.com/reel/...' },
              ].map(({ k, label, ph }) => (
                <div key={k}>
                  <Label>{label}</Label>
                  <input type="url" placeholder={ph} value={form[k as keyof typeof form] as string} onChange={(e) => set(k, e.target.value)} className={`field ${errors[k] ? 'border-red-400' : ''}`} />
                  {errors[k] && <p className="text-red-500 text-xs mt-1.5" data-error>{errors[k]}</p>}
                </div>
              ))}

              <div>
                <Label>Before &amp; After Photo <span className="text-ink/40 normal-case font-normal tracking-normal">(optional)</span></Label>
                <motion.div
                  whileHover={{ borderColor: 'rgba(10,10,10,0.4)' }}
                  className="border-2 border-dashed border-line rounded-2xl p-7 text-center cursor-pointer transition-colors hover:bg-white"
                  onClick={() => fileRef.current?.click()}
                >
                  {photoFile ? (
                    <div>
                      <p className="font-display text-2xl mb-2 text-ink">✓</p>
                      <p className="text-sm text-ink font-medium">{photoFile.name}</p>
                      <p className="text-xs text-ink/40 mt-0.5">{(photoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setPhotoFile(null); if (fileRef.current) fileRef.current.value = '' }} className="text-xs text-red-500 ulink mt-3 inline-block">Remove</button>
                    </div>
                  ) : (
                    <div>
                      <p className="font-display text-3xl text-ink/40 mb-2">+</p>
                      <p className="text-sm text-ink/70">Click to upload your before &amp; after photo</p>
                      <p className="text-xs text-ink/40 mt-1">JPG or PNG · max 10 MB</p>
                    </div>
                  )}
                </motion.div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" onChange={handleFile} className="hidden" />
                {photoError && <p className="text-red-500 text-xs mt-1.5">{photoError}</p>}
              </div>
            </SectionCard>

            {/* 3 — Content */}
            <SectionCard num="03" title="About your content">
              <div>
                <Label>Content Lane / Category *</Label>
                <select value={form.contentLane} onChange={(e) => set('contentLane', e.target.value)} className={`field appearance-none ${errors.contentLane ? 'border-red-400' : ''}`}>
                  <option value="">Select your content type</option>
                  {CONTENT_LANE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.contentLane && <p className="text-red-500 text-xs mt-1.5" data-error>{errors.contentLane}</p>}
              </div>

              <div>
                <Label>Service Category Shown *</Label>
                <select value={form.serviceCategory} onChange={(e) => set('serviceCategory', e.target.value)} className={`field appearance-none ${errors.serviceCategory ? 'border-red-400' : ''}`}>
                  <option value="">Which LookReal service did you feature?</option>
                  {SERVICE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.serviceCategory && <p className="text-red-500 text-xs mt-1.5" data-error>{errors.serviceCategory}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Your Story (max 200 words) *</Label>
                  <span className={`text-xs tabular-nums font-mono ${wordCount > 200 ? 'text-red-500' : 'text-ink/40'}`}>{wordCount}/200</span>
                </div>
                <textarea rows={5} placeholder="Tell us about your video — what happened, which vendor you booked, what the experience was like."
                  value={form.story} onChange={(e) => set('story', e.target.value)} className={`field resize-none ${errors.story ? 'border-red-400' : ''}`} />
                {errors.story && <p className="text-red-500 text-xs mt-1.5" data-error>{errors.story}</p>}
              </div>

              <div>
                <Label>Applying for sponsored spot? *</Label>
                <div className="space-y-2">
                  {[{ v: 'yes', l: 'Yes — applying for the ₦20k service credit (first 30 spots)' }, { v: 'no', l: 'No — I am self-funded' }].map((opt) => (
                    <label key={opt.v} className={`flex gap-3 items-start rounded-xl px-4 py-3 cursor-pointer transition-all border ${form.sponsored === opt.v ? 'bg-primary/5 border-primary/40' : 'bg-white border-line hover:border-ink/40'}`}>
                      <input type="radio" name="sponsored" value={opt.v} checked={form.sponsored === opt.v} onChange={() => set('sponsored', opt.v)} className="mt-0.5 accent-primary shrink-0" />
                      <span className="text-sm text-ink/80">{opt.l}</span>
                    </label>
                  ))}
                </div>
                {errors.sponsored && <p className="text-red-500 text-xs mt-1.5" data-error>{errors.sponsored}</p>}
              </div>
            </SectionCard>

            {/* 4 — Consent */}
            <SectionCard num="04" title="Consent & declaration">
              {[
                { k: 'consent1', req: true, label: 'I confirm I have featured the LookReal app in my video, and I grant LookReal permission to repost and use my content for brand and promotional purposes.' },
                { k: 'consent2', req: true, label: 'I confirm I am 18 or older, based in Lagos, and I agree to the official Booked & Glowing Challenge competition rules and terms.' },
                { k: 'consent3', req: false, label: 'I\'d like to receive updates about future LookReal creator campaigns and opportunities.' },
              ].map(({ k, req, label }) => (
                <div key={k}>
                  <label className={`flex gap-3 items-start cursor-pointer rounded-xl p-3 transition-colors border ${form[k as keyof typeof form] ? 'bg-primary/5 border-primary/30' : 'border-transparent hover:bg-white'}`}>
                    <input type="checkbox" checked={form[k as keyof typeof form] as boolean} onChange={(e) => set(k, e.target.checked)} className="mt-0.5 accent-primary shrink-0 w-4 h-4" />
                    <span className={`text-sm leading-relaxed ${req ? 'text-ink/80' : 'text-ink/50'}`}>
                      {label} {req && <span className="text-primary font-bold">*</span>}
                    </span>
                  </label>
                  {errors[k] && <p className="text-red-500 text-xs mt-1.5 ml-3" data-error>{errors[k]}</p>}
                </div>
              ))}
            </SectionCard>

            {/* Submit */}
            <Reveal>
              <div className="space-y-3 pt-2">
                <motion.button
                  type="submit" disabled={submitting} whileTap={{ scale: submitting ? 1 : 0.97 }}
                  className="btn-pill btn-accent w-full py-5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>
                      Submitting…
                    </>
                  ) : 'Submit my entry →'}
                </motion.button>
                <p className="text-center text-xs text-ink/40">By submitting, you confirm all statements above are true and accurate.</p>
              </div>
            </Reveal>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
