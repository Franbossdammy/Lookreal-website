'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.lookreal.com'

function Spinner() {
  return <div className="w-12 h-12 border-2 border-line border-t-ink rounded-full animate-spin" />
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided. Please check your email link.')
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setStatus('success')
          setMessage('Your email has been verified. You can now log in to your account.')
        } else {
          setStatus('error')
          setMessage(data.message || 'Invalid or expired verification token. Please request a new one.')
        }
      } catch {
        setStatus('error')
        setMessage('Something went wrong. Please try again later.')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10 group">
          <img src="/assets/logo.png" alt="LookReal" className="w-9 h-9 rounded-xl transition-transform group-hover:scale-105" />
          <span className="font-display text-xl tracking-tight">lookreal</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-canvas-soft border border-line rounded-[2rem] p-8 md:p-10"
        >
          {status === 'loading' && (
            <div className="text-center py-10">
              <div className="w-14 h-14 border-2 border-line border-t-ink rounded-full animate-spin mx-auto mb-5" />
              <h2 className="font-display text-2xl font-light tracking-tightest">Verifying…</h2>
              <p className="text-ink/50 text-sm mt-2">Checking your email verification.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14 }} className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </motion.div>
              <h2 className="font-display text-3xl font-light tracking-tightest mb-3">Email verified.</h2>
              <p className="text-ink/70 mb-5">{message}</p>
              <p className="text-sm text-ink/40">You can now close this page and open the LookReal app.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <h2 className="font-display text-3xl font-light tracking-tightest mb-3">Verification failed.</h2>
              <p className="text-ink/70 mb-5">{message}</p>
              <p className="text-sm text-ink/40">Open the LookReal app and request a new verification email.</p>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs text-ink/40 mt-6">© {new Date().getFullYear()} LookReal</p>
      </div>
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-canvas"><Spinner /></main>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
