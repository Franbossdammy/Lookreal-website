'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

const CONTENT_LANE_OPTIONS = ['Before & After', 'Booked on LookReal', 'No More DM Stress', 'Vendor Near Me', 'Event Prep', 'Trust Testimonial', 'GRWM', 'Men Book Too', 'Wellness & Body Care', 'The Negotiation', 'My Own Angle']
const SERVICE_OPTIONS = ['Hair', 'Nails', 'Makeup', 'Lashes', 'Brows', 'Barber', 'Pedicure', 'Massage', 'Skincare', 'Wellness', 'Other']

/* ── Toast ── */
function Toast({ type, message, onClose }: { type: 'success' | 'error'; message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t) }, [onClose])
  return (
    <motion.div initial={{ opacity: 0, y: -60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -60 }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      className={`fixed top-6 right-4 sm:right-6 z-[400] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-[340px] border backdrop-blur-xl ${type === 'success' ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-50' : 'bg-red-950/95 border-red-500/30 text-red-50'}`}>
      <span className="text-xl shrink-0 mt-0.5">{type === 'success' ? '🎬' : '⚠️'}</span>
      <p className="text-sm leading-relaxed flex-1">{message}</p>
      <button onClick={onClose} className="shrink-0 text-white/40 hover:text-white text-xl leading-none mt-0.5">×</button>
    </motion.div>
  )
}

const inputCls = 'w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E91E8C]/60 focus:bg-white/[0.08] transition-all'
const selectCls = `${inputCls} appearance-none`

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-white/50">{children}</label>
)

const SectionCard = ({ num, title, children }: { num: string; title: string; children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 sm:p-7 space-y-5">
    <div className="flex items-center gap-3 pb-1 border-b border-white/[0.06]">
      <span className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/20 text-primary text-sm font-black flex items-center justify-center shrink-0">{num}</span>
      <h2 className="font-bold text-white/90">{title}</h2>
    </div>
    {children}
  </motion.div>
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

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }))
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
      setToast({ type: 'success', msg: 'Entry received! Welcome to the Booked & Glowing Challenge. 🎬' })
    } catch { setToast({ type: 'error', msg: 'Something went wrong. Please try again or DM @lookreal on Instagram.' }) }
    setSubmitting(false)
  }

  /* ── Success screen ── */
  if (submitted) {
    return (
      <main className="min-h-screen bg-[#090d16] text-white flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        </div>
        <AnimatePresence>{toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}</AnimatePresence>
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 20 }}
          className="max-w-md w-full text-center relative z-10 bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 sm:p-12">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.15, damping: 12 }} className="text-6xl mb-5">🎬</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-display font-black mb-3">Entry Received!</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/55 text-sm leading-relaxed mb-8">
            Thank you for submitting your Booked &amp; Glowing entry. Our team will review it and be in touch. Good luck — Team LookReal.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-3">
            <a href="https://chat.whatsapp.com/DpCjCwqhleaJnnduUSBg2P?mode=gi_t" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#20b558] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Join the Challenge WhatsApp Group
            </a>
            <a href="/challenge" className="block w-full text-white/40 py-3 text-sm hover:text-white/70 transition-colors">← Back to Challenge Page</a>
          </motion.div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="relative bg-[#090d16] text-white min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence>{toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}</AnimatePresence>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] bg-[#090d16]/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
          <motion.a href="/challenge" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors group mb-5">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to Challenge
          </motion.a>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-primary font-black uppercase tracking-widest mb-1.5">Booked &amp; Glowing Challenge</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            className="text-2xl sm:text-3xl font-display font-black mb-2 leading-tight">Submit Your Entry</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}
            className="text-white/45 text-sm leading-relaxed">
            Fill in all required fields, double-check your video links, and claim your shot at ₦500,000.
          </motion.p>
        </div>
      </header>

      {/* Form */}
      <section className="relative z-10 py-8 px-4 sm:px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* 1 — Your Details */}
            <SectionCard num="1" title="Your Details">
              <div className="grid sm:grid-cols-2 gap-4">
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
                    <input type={type} placeholder={ph} value={form[k as keyof typeof form] as string}
                      onChange={e => set(k, e.target.value)} className={`${inputCls} ${errors[k] ? 'border-red-500/60' : ''}`} />
                    {errors[k] && <p className="text-red-400 text-xs mt-1" data-error>{errors[k]}</p>}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* 2 — Video Links */}
            <SectionCard num="2" title="Your Video Links">
              {[
                { k: 'tiktokLink', label: 'TikTok Video Link *', ph: 'https://www.tiktok.com/@yourhandle/video/...' },
                { k: 'igLink', label: 'Instagram Reel Link *', ph: 'https://www.instagram.com/reel/...' },
              ].map(({ k, label, ph }) => (
                <div key={k}>
                  <Label>{label}</Label>
                  <input type="url" placeholder={ph} value={form[k as keyof typeof form] as string}
                    onChange={e => set(k, e.target.value)} className={`${inputCls} ${errors[k] ? 'border-red-500/60' : ''}`} />
                  {errors[k] && <p className="text-red-400 text-xs mt-1" data-error>{errors[k]}</p>}
                </div>
              ))}

              {/* Photo upload */}
              <div>
                <Label>Before &amp; After Photo <span className="text-white/30 normal-case font-normal">(optional)</span></Label>
                <motion.div whileHover={{ borderColor: 'rgba(233,30,140,0.35)' }}
                  className="border-2 border-dashed border-white/[0.12] rounded-xl p-6 text-center cursor-pointer transition-colors hover:bg-white/[0.02]"
                  onClick={() => fileRef.current?.click()}>
                  {photoFile ? (
                    <div>
                      <p className="text-3xl mb-2">📸</p>
                      <p className="text-sm text-white/80 font-medium">{photoFile.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{(photoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button type="button" onClick={e => { e.stopPropagation(); setPhotoFile(null); if (fileRef.current) fileRef.current.value = '' }}
                        className="text-xs text-red-400 hover:underline mt-2 block mx-auto">Remove</button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl mb-2">📸</p>
                      <p className="text-sm text-white/50">Click to upload your before &amp; after photo</p>
                      <p className="text-xs text-white/30 mt-1">JPG or PNG · max 10 MB</p>
                    </div>
                  )}
                </motion.div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" onChange={handleFile} className="hidden" />
                {photoError && <p className="text-red-400 text-xs mt-1">{photoError}</p>}
              </div>
            </SectionCard>

            {/* 3 — Content */}
            <SectionCard num="3" title="About Your Content">
              <div>
                <Label>Content Lane / Category *</Label>
                <select value={form.contentLane} onChange={e => set('contentLane', e.target.value)} className={`${selectCls} ${errors.contentLane ? 'border-red-500/60' : ''}`}>
                  <option value="" className="bg-slate-900">Select your content type</option>
                  {CONTENT_LANE_OPTIONS.map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
                </select>
                {errors.contentLane && <p className="text-red-400 text-xs mt-1" data-error>{errors.contentLane}</p>}
              </div>

              <div>
                <Label>Service Category Shown *</Label>
                <select value={form.serviceCategory} onChange={e => set('serviceCategory', e.target.value)} className={`${selectCls} ${errors.serviceCategory ? 'border-red-500/60' : ''}`}>
                  <option value="" className="bg-slate-900">Which LookReal service did you feature?</option>
                  {SERVICE_OPTIONS.map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
                </select>
                {errors.serviceCategory && <p className="text-red-400 text-xs mt-1" data-error>{errors.serviceCategory}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Your Story (max 200 words) *</Label>
                  <span className={`text-xs tabular-nums ${wordCount > 200 ? 'text-red-400' : 'text-white/30'}`}>{wordCount}/200</span>
                </div>
                <textarea rows={5} placeholder="Tell us about your video — what happened, which vendor you booked, what the experience was like."
                  value={form.story} onChange={e => set('story', e.target.value)} className={`${inputCls} resize-none ${errors.story ? 'border-red-500/60' : ''}`} />
                {errors.story && <p className="text-red-400 text-xs mt-1" data-error>{errors.story}</p>}
              </div>

              <div>
                <Label>Applying for sponsored spot? *</Label>
                <div className="space-y-2">
                  {[{ v: 'yes', l: 'Yes — applying for the ₦20k service credit (first 30 spots)' }, { v: 'no', l: 'No — I am self-funded' }].map(opt => (
                    <label key={opt.v} className={`flex gap-3 items-start rounded-xl px-4 py-3 cursor-pointer transition-all border ${form.sponsored === opt.v ? 'bg-primary/10 border-primary/30 text-white' : 'bg-white/[0.03] border-white/[0.08] text-white/65 hover:border-white/20'}`}>
                      <input type="radio" name="sponsored" value={opt.v} checked={form.sponsored === opt.v} onChange={() => set('sponsored', opt.v)} className="mt-0.5 accent-primary shrink-0" />
                      <span className="text-sm">{opt.l}</span>
                    </label>
                  ))}
                </div>
                {errors.sponsored && <p className="text-red-400 text-xs mt-1" data-error>{errors.sponsored}</p>}
              </div>
            </SectionCard>

            {/* 4 — Consent */}
            <SectionCard num="4" title="Consent & Declaration">
              {[
                { k: 'consent1', req: true, label: 'I confirm I have featured the LookReal app in my video, and I grant LookReal permission to repost and use my content for brand and promotional purposes.' },
                { k: 'consent2', req: true, label: 'I confirm I am 18 or older, based in Lagos, and I agree to the official Booked & Glowing Challenge competition rules and terms.' },
                { k: 'consent3', req: false, label: 'I\'d like to receive updates about future LookReal creator campaigns and opportunities.' },
              ].map(({ k, req, label }) => (
                <div key={k}>
                  <label className={`flex gap-3 items-start cursor-pointer rounded-xl p-3 transition-colors border ${form[k as keyof typeof form] ? 'bg-primary/8 border-primary/20' : 'border-transparent hover:bg-white/[0.03]'}`}>
                    <input type="checkbox" checked={form[k as keyof typeof form] as boolean} onChange={e => set(k, e.target.checked)} className="mt-0.5 accent-primary shrink-0 w-4 h-4" />
                    <span className={`text-sm leading-relaxed ${req ? 'text-white/80' : 'text-white/45'}`}>
                      {label} {req && <span className="text-primary font-bold">*</span>}
                    </span>
                  </label>
                  {errors[k] && <p className="text-red-400 text-xs mt-1 ml-3" data-error>{errors[k]}</p>}
                </div>
              ))}
            </SectionCard>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-3 pt-2">
              <motion.button type="submit" disabled={submitting} whileTap={{ scale: submitting ? 1 : 0.97 }}
                className="w-full bg-[#E91E8C] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#c2185b] transition-all shadow-2xl shadow-[#E91E8C]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {submitting ? (
                  <><svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/></svg>Submitting…</>
                ) : 'Submit My Entry 🎬'}
              </motion.button>
              <p className="text-center text-xs text-white/30">By submitting, you confirm all statements above are true and accurate.</p>
            </motion.div>
          </form>
        </div>
      </section>

      <footer className="relative z-10 py-5 px-4 border-t border-white/[0.05] text-center text-xs text-white/25">
        <a href="/challenge" className="hover:text-primary transition-colors">← Back to Challenge Page</a>
        <span className="mx-3">·</span>© LookReal Nigeria 2026
      </footer>
    </main>
  )
}
