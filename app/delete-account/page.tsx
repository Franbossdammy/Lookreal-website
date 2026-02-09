'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function AccountDeletion() {
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send this to your backend
    console.log('Deletion request:', { email, reason })
    setSubmitted(true)
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-60" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-primary/20">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center max-w-7xl">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center font-display text-xl">
              S
            </div>
            <span className="text-2xl font-display font-bold">LookReal</span>
          </a>
          <a href="/" className="text-sm text-slate-400 hover:text-primary transition-colors">
            ← Back to Home
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Account <span className="text-gradient">Deletion</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We're sorry to see you go. Follow the steps below to request deletion of your LookReal account and associated data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Deletion Process */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border border-primary/20 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary-light/30 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">How to Delete Your Account</h2>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="font-semibold mb-1">In-App Deletion</h3>
                    <p className="text-sm text-slate-400">Open the LookReal app → Go to Profile → Settings → Account → Delete Account</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Request</h3>
                    <p className="text-sm text-slate-400">Send an email to <a href="mailto:support@lookreal.com" className="text-primary hover:underline">support@lookreal.com</a> with subject "Account Deletion Request"</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="font-semibold mb-1">Web Form</h3>
                    <p className="text-sm text-slate-400">Fill out the deletion request form on this page below</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h3 className="font-semibold mb-1">Verification</h3>
                    <p className="text-sm text-slate-400">We'll send a confirmation email to verify your identity before processing</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* What Gets Deleted */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border border-primary/20 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary-light/30 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Data Deletion Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Data Deleted Immediately
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>• Personal profile information</li>
                    <li>• Account credentials</li>
                    <li>• Saved addresses and preferences</li>
                    <li>• Chat messages and communications</li>
                    <li>• Service booking history</li>
                    <li>• Product order history</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Data Retained (30-90 Days)
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>• Transaction records (for legal/tax purposes)</li>
                    <li>• Payment history (required by law)</li>
                    <li>• Dispute-related information (if applicable)</li>
                    <li>• Backup copies (deleted within 90 days)</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Deletion Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 md:p-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Request Account Deletion</h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Request Submitted</h3>
                <p className="text-slate-300 mb-6">
                  We've received your account deletion request. You'll receive a confirmation email shortly to verify your identity.
                </p>
                <p className="text-sm text-slate-400">
                  Your account will be deleted within 30 days after verification.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-slate-900/50 border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Must match the email associated with your LookReal account
                  </p>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold mb-2">
                    Reason for Deletion (Optional)
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Help us improve by sharing why you're leaving..."
                    rows={4}
                    className="w-full bg-slate-900/50 border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex gap-3">
                    <svg className="w-6 h-6 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm">
                      <p className="font-semibold text-yellow-400 mb-1">Important Notice</p>
                      <p className="text-yellow-200/80">
                        This action is permanent and cannot be undone. All your data will be deleted according to our retention policy.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-red-500/30"
                >
                  Submit Deletion Request
                </button>

                <p className="text-center text-xs text-slate-400">
                  By submitting, you confirm that you want to permanently delete your LookReal account
                </p>
              </form>
            )}
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <h3 className="text-xl font-bold mb-4">Need Help?</h3>
            <p className="text-slate-300 mb-6">
              If you're experiencing issues or have questions about data deletion, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@lookreal.com"
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 px-6 py-3 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}