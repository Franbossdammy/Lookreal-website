'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '../_components/Nav'
import Footer from '../_components/Footer'
import { Reveal, Eyebrow } from '../_components/Primitives'

export default function AccountDeletion() {
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Deletion request:', { email, reason })
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

      <section className="relative pt-36 md:pt-44 pb-20 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <Eyebrow>Account</Eyebrow>
          <Reveal delay={0.1}>
            <h1 className="mt-5 font-display text-5xl md:text-7xl font-light leading-[0.95] tracking-tightest">
              Delete your <span className="serif-italic text-primary">account.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg text-ink/60 leading-relaxed">
              We&apos;re sorry to see you go. Follow the steps below to request deletion of your LookReal account and associated data.
            </p>
          </Reveal>

          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <Reveal delay={0.1}>
              <div className="bg-canvas-soft border border-line rounded-3xl p-8 h-full">
                <p className="eyebrow mb-6">How to delete</p>
                <ol className="space-y-5">
                  {[
                    { title: 'In-app deletion', desc: 'Profile → Settings → Account → Delete Account' },
                    { title: 'Email request', desc: <>Email <a href="mailto:support@lookreal.beauty" className="text-primary ulink">support@lookreal.beauty</a> with subject &ldquo;Account Deletion&rdquo;</> },
                    { title: 'Web form', desc: 'Submit the form on this page' },
                    { title: 'Verification', desc: 'We send a confirmation email to verify your identity' },
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="shrink-0 w-7 h-7 rounded-full border border-ink flex items-center justify-center font-mono text-xs">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-display text-lg tracking-tight">{step.title}</h3>
                        <p className="text-sm text-ink/60 mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-canvas-soft border border-line rounded-3xl p-8 h-full">
                <p className="eyebrow mb-6">What gets deleted</p>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-lg tracking-tight mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Immediately
                    </h3>
                    <ul className="space-y-1.5 text-sm text-ink/60 pl-4">
                      <li>— Personal profile information</li>
                      <li>— Account credentials</li>
                      <li>— Saved addresses &amp; preferences</li>
                      <li>— Chat messages</li>
                      <li>— Booking &amp; order history</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-display text-lg tracking-tight mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Retained 30–90 days
                    </h3>
                    <ul className="space-y-1.5 text-sm text-ink/60 pl-4">
                      <li>— Transaction records (tax/legal)</li>
                      <li>— Payment history (required by law)</li>
                      <li>— Dispute-related information</li>
                      <li>— Encrypted backups</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="mt-10 bg-white border border-line rounded-[2rem] p-8 md:p-12">
              <h2 className="font-display text-3xl md:text-4xl font-light tracking-tightest text-center">Request account deletion</h2>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h3 className="font-display text-2xl mb-3">Request submitted.</h3>
                  <p className="text-ink/60 mb-2">We&apos;ve received your deletion request. You&apos;ll receive a confirmation email shortly to verify your identity.</p>
                  <p className="text-sm text-ink/40">Your account will be deleted within 30 days after verification.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-10 space-y-6 max-w-xl mx-auto">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink/60">Email address *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="field" />
                    <p className="text-xs text-ink/40 mt-2">Must match the email on your LookReal account.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink/60">Reason (optional)</label>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Help us improve — tell us why you're leaving" rows={4} className="field resize-none" />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      <div className="text-sm">
                        <p className="font-semibold text-amber-900 mb-1">This can&apos;t be undone.</p>
                        <p className="text-amber-800/80 leading-relaxed">All your data will be deleted according to our retention policy.</p>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn-pill bg-red-600 text-white hover:bg-red-700 w-full py-4 text-base">
                    Submit deletion request
                  </button>

                  <p className="text-center text-xs text-ink/40">By submitting, you confirm you want to permanently delete your LookReal account.</p>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-14 text-center">
              <h3 className="font-display text-2xl mb-4">Need help?</h3>
              <p className="text-ink/60 mb-6">If you have questions about data deletion, our support team is here.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="mailto:support@lookreal.beauty" className="btn-pill btn-ghost">Email support</a>
                <Link href="/" className="btn-pill btn-primary">← Back to home</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
