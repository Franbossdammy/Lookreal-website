'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Nav from '../_components/Nav'
import Footer from '../_components/Footer'
import { Reveal, Eyebrow, Magnetic } from '../_components/Primitives'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mailto = `mailto:support@lookreal.beauty?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`
    window.location.href = mailto
    setSubmitted(true)
  }

  return (
    <main className="relative bg-canvas text-ink min-h-screen">
      <Nav
        links={[
          { href: '/#features', label: 'Features' },
          { href: '/blog', label: 'Blog' },
          { href: '/contact', label: 'Contact' },
        ]}
      />

      <section className="relative pt-36 md:pt-44 pb-16 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 right-0 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <Eyebrow>Get in touch</Eyebrow>
          <Reveal delay={0.1}>
            <h1 className="mt-5 font-display text-5xl md:text-8xl font-light leading-[0.95] tracking-tightest">
              Say <span className="serif-italic text-primary">hello.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lg md:text-xl text-ink/60 leading-relaxed">
              Questions, feedback, press, partnerships — anything at all. We read every message.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="bg-canvas-soft border border-line rounded-[2rem] p-8 md:p-12">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h3 className="font-display text-3xl mb-3">Message sent.</h3>
                  <p className="text-ink/60 mb-6">Your email client should have opened. If not, write to us at support@lookreal.beauty.</p>
                  <button onClick={() => setSubmitted(false)} className="text-primary ulink">Send another</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink/60">Your name</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="field" placeholder="Jola Oni" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink/60">Email</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="field" placeholder="jola@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink/60">Subject</label>
                    <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="field" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink/60">Message</label>
                    <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="field resize-none" placeholder="Tell us more…" />
                  </div>
                  <Magnetic>
                    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-pill btn-primary w-full py-4 text-base">
                      Send message →
                    </motion.button>
                  </Magnetic>
                </form>
              )}
            </div>
          </Reveal>

          {/* Info */}
          <div className="lg:col-span-5 space-y-5">
            {[
              { eyebrow: 'Email', label: 'support@lookreal.beauty', href: 'mailto:support@lookreal.beauty', note: 'Replies within 24 hours.' },
              { eyebrow: 'Phone', label: '+234 706 696 5448', href: 'tel:+2347066965448', note: 'Mon–Fri, 9am–6pm WAT.' },
              { eyebrow: 'In-app', label: 'Chat with support', href: '#', note: 'Fastest option for account-related questions.' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={0.15 + i * 0.08}>
                <a href={item.href} className="group block bg-white border border-line hover:border-ink/30 rounded-3xl p-7 transition-all">
                  <p className="eyebrow mb-2">{item.eyebrow}</p>
                  <p className="font-display text-2xl group-hover:text-primary transition-colors">{item.label}</p>
                  <p className="text-ink/50 text-sm mt-2">{item.note}</p>
                </a>
              </Reveal>
            ))}

            <Reveal delay={0.4}>
              <div className="bg-ink text-white rounded-3xl p-7">
                <p className="eyebrow text-white/50 mb-4">Follow us</p>
                <div className="flex gap-2">
                  {[
                    { label: 'Instagram', href: 'https://www.instagram.com/lookrealapp?igsh=MWZubWVndmczeGtuNQ==' },
                    { label: 'TikTok', href: 'https://www.tiktok.com/@lookrealapp?_r=1&_t=ZS-94NvbHGg5NS' },
                    { label: 'Facebook', href: 'https://www.facebook.com/share/1DEJ4uzgDX/?mibextid=wwXIfr' },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full border border-white/15 text-sm hover:bg-white hover:text-ink transition-colors">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
