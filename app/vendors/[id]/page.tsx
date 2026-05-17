import type { Metadata } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sharplook-backend-production.onrender.com'
const APP_STORE_URL = 'https://apps.apple.com/ng/app/lookreal/id6749508043'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.inuud.sharplook'
const SITE_URL = 'https://lookreal.beauty'

interface VendorProfile {
  _id: string
  firstName: string
  lastName: string
  avatar?: string
  isOnline: boolean
  vendorProfile: {
    businessName: string
    businessDescription?: string
    vendorType: string
    rating: number
    totalRatings: number
    completedBookings: number
    isVerified: boolean
    categories: Array<{ _id: string; name: string }>
    location?: { address: string; city: string; state: string }
  }
}

interface VendorPageData {
  vendor: VendorProfile
  services: Array<{ _id: string; name: string; basePrice: number; duration?: number; description?: string }>
  stats: { totalServices: number; totalReviews: number }
}

async function fetchVendorData(id: string): Promise<VendorPageData | null> {
  // Two attempts — handles Render free-tier cold starts (first req can 503/timeout)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)

      const res = await fetch(`${API_URL}/api/v1/users/vendors/${id}`, {
        next: { revalidate: 300 },
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (res.status === 404) return null          // vendor genuinely doesn't exist
      if (!res.ok) {
        if (attempt === 0) continue                 // retry once on server errors
        return null
      }

      const json = await res.json()
      return (json.data as VendorPageData) ?? null
    } catch {
      if (attempt === 0) continue                   // retry once on network errors
    }
  }
  return null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const data = await fetchVendorData(id)

  if (!data) {
    return {
      title: 'Vendor Not Found | LookReal',
      description: 'This vendor profile could not be found.',
    }
  }

  const { vendor } = data
  const name = vendor.vendorProfile.businessName
  const description = vendor.vendorProfile.businessDescription
    || `Book ${name} on LookReal — ${vendor.vendorProfile.vendorType === 'home_service' ? 'Home service' : 'In-shop service'} in ${vendor.vendorProfile.location?.city || 'Nigeria'}.`

  return {
    title: `${name} | LookReal`,
    description,
    openGraph: {
      title: `${name} on LookReal`,
      description,
      type: 'profile',
      siteName: 'LookReal',
      images: vendor.avatar ? [{ url: vendor.avatar, width: 400, height: 400, alt: name }] : [],
      url: `${SITE_URL}/vendors/${id}`,
    },
    twitter: {
      card: 'summary',
      title: `${name} on LookReal`,
      description,
      images: vendor.avatar ? [vendor.avatar] : [],
    },
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: 16, letterSpacing: 2 }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  )
}

export default async function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchVendorData(id)

  if (!data) {
    // Show a soft fallback — don't 404, just tell them to use the app
    return (
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a14 50%, #0f0f1a 100%)',
        fontFamily: "'Outfit', system-ui, sans-serif",
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div style={{ maxWidth: 400, textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #D73870, #FF5B96)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 800,
          }}>L</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>LookReal</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
            This vendor profile is available in the LookReal app. Download the app to view and book their services.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={APP_STORE_URL} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '12px 20px', borderRadius: 12,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontWeight: 500, fontSize: 14, textDecoration: 'none',
            }}>App Store</a>
            <a href={PLAY_STORE_URL} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '12px 20px', borderRadius: 12,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontWeight: 500, fontSize: 14, textDecoration: 'none',
            }}>Google Play</a>
          </div>
        </div>
      </main>
    )
  }

  const { vendor, services, stats } = data
  const name = vendor.vendorProfile.businessName
  const vendorUrl = `${SITE_URL}/vendors/${id}`
  const deepLink = `LookReal://share/vendor/${id}`
  const whatsappText = encodeURIComponent(`Check out ${name} on LookReal! Book now: ${vendorUrl}`)
  const vendorTypeLabel =
    vendor.vendorProfile.vendorType === 'home_service' ? 'Home Service'
    : vendor.vendorProfile.vendorType === 'in_shop' ? 'In-Shop'
    : 'Home & In-Shop'

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a14 50%, #0f0f1a 100%)',
      fontFamily: "'Outfit', system-ui, sans-serif",
      color: '#fff',
      padding: '0',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #D73870, #FF5B96)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 18,
        }}>L</div>
        <span style={{ fontWeight: 700, fontSize: 18 }}>LookReal</span>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* Vendor Avatar + Name */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {vendor.avatar ? (
            <img
              src={vendor.avatar}
              alt={name}
              style={{
                width: 100, height: 100, borderRadius: '50%',
                objectFit: 'cover', border: '3px solid #D73870',
                margin: '0 auto 16px',
                display: 'block',
              }}
            />
          ) : (
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, #D73870, #FF5B96)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 42, fontWeight: 800, color: 'rgba(255,255,255,0.9)',
              margin: '0 auto 16px',
            }}>
              {name.charAt(0)}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{name}</h1>
            {vendor.vendorProfile.isVerified && (
              <span style={{
                background: 'rgba(16,185,129,0.15)', color: '#10B981',
                border: '1px solid rgba(16,185,129,0.3)',
                fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
              }}>✓ Verified</span>
            )}
          </div>

          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <StarRating rating={vendor.vendorProfile.rating} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {vendor.vendorProfile.rating.toFixed(1)} ({vendor.vendorProfile.totalRatings} reviews)
            </span>
          </div>

          <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span>📍 {vendor.vendorProfile.location?.city}, {vendor.vendorProfile.location?.state}</span>
            <span>🏪 {vendorTypeLabel}</span>
            {vendor.isOnline && <span style={{ color: '#10B981' }}>● Online</span>}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12, marginBottom: 28,
        }}>
          {[
            { label: 'Bookings', value: vendor.vendorProfile.completedBookings },
            { label: 'Services', value: stats?.totalServices ?? 0 },
            { label: 'Reviews', value: stats?.totalReviews ?? 0 },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, padding: '14px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        {vendor.vendorProfile.businessDescription && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 18, marginBottom: 24,
          }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {vendor.vendorProfile.businessDescription}
            </p>
          </div>
        )}

        {/* Services */}
        {services && services.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'rgba(255,255,255,0.9)' }}>
              Services
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {services.slice(0, 5).map((service) => (
                <div key={service._id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: '14px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{service.name}</div>
                    {service.duration && (
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                        {service.duration} mins
                      </div>
                    )}
                  </div>
                  <div style={{
                    color: '#D73870', fontWeight: 700, fontSize: 15,
                    background: 'rgba(215,56,112,0.12)', padding: '4px 12px', borderRadius: 8,
                  }}>
                    ₦{service.basePrice.toLocaleString()}
                  </div>
                </div>
              ))}
              {services.length > 5 && (
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '4px 0 0' }}>
                  +{services.length - 5} more services in the app
                </p>
              )}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div style={{
          background: 'rgba(215,56,112,0.08)',
          border: '1px solid rgba(215,56,112,0.2)',
          borderRadius: 20, padding: 24, textAlign: 'center', marginBottom: 20,
        }}>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'rgba(255,255,255,0.9)' }}>
            Ready to book {name}?
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
            Open in the LookReal app to book, message, and pay securely.
          </p>

          {/* Deep link — opens app if installed */}
          <a
            href={deepLink}
            style={{
              display: 'block', padding: '15px 24px', borderRadius: 14,
              background: 'linear-gradient(135deg, #D73870, #FF5B96)',
              color: '#fff', fontWeight: 700, fontSize: 16,
              textDecoration: 'none', marginBottom: 12,
              boxShadow: '0 4px 20px rgba(215,56,112,0.35)',
            }}
          >
            Open in LookReal App
          </a>

          {/* App store buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <a
              href={APP_STORE_URL}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '11px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontWeight: 500, fontSize: 13, textDecoration: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '11px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontWeight: 500, fontSize: 13, textDecoration: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.54c.44.58 1.12.69 1.67.38L22.69 12.8c.56-.31.56-1.29 0-1.6L4.85.08c-.55-.31-1.23-.2-1.67.38C3.06.62 3 .82 3 1.03v21.94c0 .21.06.41.18.57zM5 3.04L15.11 12 5 20.96V3.04z"/>
              </svg>
              Google Play
            </a>
          </div>
        </div>

        {/* WhatsApp Share */}
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '14px 24px', borderRadius: 14,
            background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)',
            color: '#25D366', fontWeight: 600, fontSize: 15, textDecoration: 'none',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Share on WhatsApp
        </a>

        {/* Categories */}
        {vendor.vendorProfile.categories?.length > 0 && (
          <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {vendor.vendorProfile.categories.map((cat) => (
              <span key={cat._id} style={{
                background: 'rgba(215,56,112,0.12)', border: '1px solid rgba(215,56,112,0.2)',
                color: '#D73870', fontSize: 12, fontWeight: 600,
                padding: '4px 12px', borderRadius: 20,
              }}>{cat.name}</span>
            ))}
          </div>
        )}

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 32 }}>
          Powered by <a href="https://lookreal.beauty" style={{ color: 'rgba(215,56,112,0.6)', textDecoration: 'none' }}>LookReal</a>
        </p>
      </div>
    </main>
  )
}
