'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.lookreal.com'

function Spinner() {
  return <div className="w-12 h-12 border-2 border-line border-t-ink rounded-full animate-spin" />
}

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'form' | 'loading' | 'success' | 'error'>('form')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No reset token provided. Please check your email link.')
    }
  }, [token])

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password must be at least 8 characters.'
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter.'
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter.'
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number.'
    if (!/[@$!%*?&]/.test(pwd)) return 'Password must contain at least one special character (@$!%*?&).'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')
    const pwdError = validatePassword(password)
    if (pwdError) { setValidationError(pwdError); return }
    if (password !== confirmPassword) { setValidationError('Passwords do not match.'); return }
    setStatus('loading')
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        setMessage('Your password has been reset. You can now log in with your new password.')
      } else {
        setStatus('form')
        setValidationError(data.message || 'Failed to reset password. The link may have expired.')
      }
    } catch {
      setStatus('form')
      setValidationError('Something went wrong. Please try again.')
    }
  }

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
          {status === 'form' && (
            <>
              <div className="text-center mb-7">
                <div className="w-14 h-14 bg-white border border-line rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h1 className="font-display text-3xl font-light tracking-tightest">Reset your password</h1>
                <p className="text-ink/50 text-sm mt-2">Enter a new password below.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink/60">New password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setValidationError('') }}
                      className="field pr-11"
                      placeholder="Enter new password"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink">
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2 text-ink/60">Confirm password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setValidationError('') }}
                    className="field"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {validationError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700">{validationError}</p>
                  </div>
                )}

                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-pill btn-primary w-full py-4 mt-2">
                  Reset password
                </motion.button>
              </form>

              <div className="mt-5 p-4 bg-white border border-line rounded-xl">
                <p className="text-xs text-ink/50 leading-relaxed">
                  <span className="font-semibold text-ink">Password rules —</span> Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.
                </p>
              </div>
            </>
          )}

          {status === 'loading' && (
            <div className="text-center py-10">
              <div className="w-14 h-14 border-2 border-line border-t-ink rounded-full animate-spin mx-auto mb-5" />
              <h2 className="font-display text-2xl font-light">Resetting password…</h2>
              <p className="text-ink/50 text-sm mt-2">Please wait.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14 }} className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </motion.div>
              <h2 className="font-display text-3xl font-light tracking-tightest mb-3">Password reset.</h2>
              <p className="text-ink/70 mb-5">{message}</p>
              <p className="text-sm text-ink/40">You can now close this page and open the LookReal app to log in.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <h2 className="font-display text-3xl font-light tracking-tightest mb-3">Invalid link.</h2>
              <p className="text-ink/70 mb-5">{message}</p>
              <p className="text-sm text-ink/40">Open the LookReal app and request a new password reset.</p>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs text-ink/40 mt-6">© {new Date().getFullYear()} LookReal</p>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-canvas"><Spinner /></main>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
