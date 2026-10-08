'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const SCHEME = 'LookReal'
const APP_STORE_URL = 'https://apps.apple.com/ng/app/lookreal/id6749508043'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.inuud.sharplook'

function getShareInfo() {
  if (typeof window === 'undefined') return { type: '', id: '' }
  const parts = window.location.pathname.split('/').filter(Boolean)
  return { type: parts[1] || '', id: parts[2] || '' }
}

function getDeepLink(type: string, id: string) {
  return `${SCHEME}://share/${type}/${id}`
}

function getMobileOS() {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent || ''
  if (/android/i.test(ua)) return 'android'
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
  return 'desktop'
}

export default function SharePage() {
  const [info, setInfo] = useState({ type: '', id: '' })
  const [attempted, setAttempted] = useState(false)
  const [os, setOs] = useState('unknown')

  useEffect(() => {
    const { type, id } = getShareInfo()
    setInfo({ type, id })
    setOs(getMobileOS())

    if (type && id) {
      const deepLink = getDeepLink(type, id)
      window.location.href = deepLink

      setTimeout(() => {
        if (type === 'vendor' && id) {
          window.location.replace(`/vendors/${id}`)
          return
        }
        setAttempted(true)
      }, 2500)
    } else {
      setAttempted(true)
    }
  }, [])

  const typeLabel = info.type === 'vendor' ? 'Vendor profile' : info.type === 'product' ? 'Product' : 'Content'

  return (
    <main className="min-h-screen bg-canvas text-ink flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-2.5 mb-10 group">
          <img src="/assets/logo.png" alt="LookReal" className="w-11 h-11 rounded-2xl transition-transform group-hover:scale-105" />
        </Link>

        <h1 className="font-display text-5xl font-light tracking-tightest leading-[0.95]">
          <span className="serif-italic text-primary">look</span>real
        </h1>

        {!attempted ? (
          <>
            <p className="text-ink/60 mt-8">
              Opening {typeLabel.toLowerCase()} in the app…
            </p>
            <div className="w-10 h-10 border-2 border-line border-t-ink rounded-full animate-spin mx-auto mt-8" />
          </>
        ) : (
          <>
            <p className="text-ink/70 mt-8 text-lg">
              {info.type && info.id
                ? `Someone shared a ${typeLabel.toLowerCase()} with you.`
                : 'Discover and book services, shop products, and connect with local vendors.'}
            </p>
            <p className="text-ink/50 text-sm mt-2 mb-10">Download LookReal to view it.</p>

            {info.type && info.id && (
              <a href={getDeepLink(info.type, info.id)} className="btn-pill btn-accent w-full mb-3">
                Open in app →
              </a>
            )}

            <div className="flex gap-3 justify-center mt-4">
              {(os === 'ios' || os === 'desktop') && (
                <a href={APP_STORE_URL} className="btn-pill btn-ghost">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                  App Store
                </a>
              )}
              {(os === 'android' || os === 'desktop') && (
                <a href={PLAY_STORE_URL} className="btn-pill btn-ghost">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.54c.44.58 1.12.69 1.67.38L22.69 12.8c.56-.31.56-1.29 0-1.6L4.85.08c-.55-.31-1.23-.2-1.67.38C3.06.62 3 .82 3 1.03v21.94c0 .21.06.41.18.57zM5 3.04L15.11 12 5 20.96V3.04z" /></svg>
                  Google Play
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
