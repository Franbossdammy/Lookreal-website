'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.lookreal.com'

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
          setMessage('Your email has been verified successfully! You can now log in to your account.')
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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Righteous', sans-serif" }}>LookReal</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#CC0000] rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Your Email</h2>
              <p className="text-gray-500">Please wait while we verify your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500">You can now close this page and open the LookReal app to log in.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-[#CC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500">Please open the LookReal app and request a new verification email.</p>
            </div>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">&copy; {new Date().getFullYear()} LookReal. All rights reserved.</p>
      </div>
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#CC0000] rounded-full animate-spin" />
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
