'use client'

import { useEffect, useState } from 'react'

const SCHEME = 'LookReal'
const APP_STORE_URL = 'https://apps.apple.com/app/lookreal/id6740804522'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.inuud.sharplook'

function getShareInfo() {
  if (typeof window === 'undefined') return { type: '', id: '' }
  // URL format: /share/vendor/abc123 or /share/product/abc123
  const parts = window.location.pathname.split('/').filter(Boolean)
  // parts = ['share', 'vendor', 'abc123']
  const type = parts[1] || ''
  const id = parts[2] || ''
  return { type, id }
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
      // Try to open the app
      const deepLink = getDeepLink(type, id)
      window.location.href = deepLink

      // After a delay, if still here, user doesn't have the app
      setTimeout(() => setAttempted(true), 2500)
    } else {
      setAttempted(true)
    }
  }, [])

  const typeLabel = info.type === 'vendor' ? 'Vendor Profile' : info.type === 'product' ? 'Product' : 'Content'

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a14 50%, #0f0f1a 100%)',
      fontFamily: "'Outfit', system-ui, sans-serif",
      padding: '24px',
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
      }}>
        {/* Logo */}
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, #D73870, #FF5B96)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 36, fontWeight: 800,
          boxShadow: '0 8px 32px rgba(215, 56, 112, 0.3)',
        }}>
          L
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          LookReal
        </h1>

        {!attempted ? (
          <>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 32 }}>
              Opening {typeLabel} in the app...
            </p>
            <div style={{
              width: 40, height: 40, border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#D73870', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto',
            }} />
          </>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 8 }}>
              {info.type && info.id
                ? `Someone shared a ${typeLabel.toLowerCase()} with you!`
                : 'Discover and book services, shop products, and connect with local vendors.'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 32 }}>
              Download LookReal to view it
            </p>

            {/* Try opening app again */}
            {info.type && info.id && (
              <a
                href={getDeepLink(info.type, info.id)}
                style={{
                  display: 'block', padding: '14px 24px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #D73870, #FF5B96)',
                  color: '#fff', fontWeight: 600, fontSize: 16,
                  textDecoration: 'none', marginBottom: 12,
                  boxShadow: '0 4px 16px rgba(215, 56, 112, 0.4)',
                }}
              >
                Open in App
              </a>
            )}

            {/* Store buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
              {(os === 'ios' || os === 'desktop') && (
                <a
                  href={APP_STORE_URL}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 20px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff', fontWeight: 500, fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </a>
              )}
              {(os === 'android' || os === 'desktop') && (
                <a
                  href={PLAY_STORE_URL}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 20px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff', fontWeight: 500, fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.54c.44.58 1.12.69 1.67.38L22.69 12.8c.56-.31.56-1.29 0-1.6L4.85.08c-.55-.31-1.23-.2-1.67.38C3.06.62 3 .82 3 1.03v21.94c0 .21.06.41.18.57zM5 3.04L15.11 12 5 20.96V3.04z"/>
                  </svg>
                  Google Play
                </a>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  )
}
