import type { Metadata } from 'next'
import Link from 'next/link'

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
  services: Array<{ _id: string; name: string; basePrice: number; duration?: number; description?: string; images?: string[] }>
  stats: { totalServices: number; totalReviews: number }
}

async function fetchVendorData(id: string): Promise<VendorPageData | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(`${API_URL}/api/v1/users/vendors/${id}`, { next: { revalidate: 300 }, signal: controller.signal })
      clearTimeout(timeout)
      if (res.status === 404) return null
      if (!res.ok) { if (attempt === 0) continue; return null }
      const json = await res.json()
      return (json.data as VendorPageData) ?? null
    } catch {
      if (attempt === 0) continue
    }
  }
  return null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const data = await fetchVendorData(id)
  if (!data) return { title: 'Vendor not found | LookReal', description: 'This vendor profile could not be found.' }
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
  const r = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < r ? 'text-amber-500' : 'text-line'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
        </svg>
      ))}
    </span>
  )
}

export default async function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchVendorData(id)

  if (!data) {
    return (
      <main className="min-h-screen bg-canvas text-ink flex items-center justify-center px-5 py-16">
        <div className="max-w-md w-full text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2.5 mb-10 group">
            <img src="/assets/logo.png" alt="LookReal" className="w-11 h-11 rounded-2xl" />
          </Link>
          <h1 className="font-display text-4xl font-light tracking-tightest mb-4">
            <span className="serif-italic text-primary">look</span>real
          </h1>
          <p className="text-ink/60 leading-relaxed mb-8">
            This vendor profile is available in the LookReal app. Download the app to view and book their services.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href={APP_STORE_URL} className="btn-pill btn-ghost">App Store</a>
            <a href={PLAY_STORE_URL} className="btn-pill btn-ghost">Google Play</a>
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
    vendor.vendorProfile.vendorType === 'home_service' ? 'Home service'
    : vendor.vendorProfile.vendorType === 'in_shop' ? 'In-shop'
    : 'Home & In-shop'

  return (
    <main className="relative bg-canvas text-ink min-h-screen">
      <header className="border-b border-line bg-canvas/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/assets/logo.png" alt="LookReal" className="w-8 h-8 rounded-lg" />
            <span className="font-display text-lg tracking-tight">lookreal</span>
          </Link>
          <a href={deepLink} className="text-sm text-primary ulink font-semibold">Open in app →</a>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-5 py-10 md:py-14">
        {/* Avatar + Name */}
        <div className="text-center mb-10">
          {vendor.avatar ? (
            <img
              src={vendor.avatar}
              alt={name}
              className="w-28 h-28 rounded-full object-cover border-2 border-primary mx-auto mb-5"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-canvas-soft border border-line text-primary font-display text-5xl flex items-center justify-center mx-auto mb-5">
              {name.charAt(0)}
            </div>
          )}

          <div className="inline-flex items-center gap-2 mb-2 flex-wrap justify-center">
            <h1 className="font-display text-4xl md:text-5xl font-light tracking-tightest">{name}</h1>
            {vendor.vendorProfile.isVerified && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">✓ Verified</span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mt-3">
            <StarRating rating={vendor.vendorProfile.rating} />
            <span className="text-sm text-ink/60">
              {vendor.vendorProfile.rating.toFixed(1)} <span className="text-ink/40">({vendor.vendorProfile.totalRatings})</span>
            </span>
          </div>

          <div className="mt-3 flex gap-4 justify-center flex-wrap text-sm text-ink/50">
            <span>{vendor.vendorProfile.location?.city}, {vendor.vendorProfile.location?.state}</span>
            <span>·</span>
            <span>{vendorTypeLabel}</span>
            {vendor.isOnline && <><span>·</span><span className="text-emerald-600 inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Online</span></>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: 'Bookings', value: vendor.vendorProfile.completedBookings },
            { label: 'Services', value: stats?.totalServices ?? 0 },
            { label: 'Reviews', value: stats?.totalReviews ?? 0 },
          ].map((s) => (
            <div key={s.label} className="bg-canvas-soft border border-line rounded-2xl py-5 px-3 text-center">
              <div className="font-display text-2xl md:text-3xl text-ink">{s.value}</div>
              <div className="text-[10px] text-ink/50 mt-1.5 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        {vendor.vendorProfile.businessDescription && (
          <div className="bg-canvas-soft border border-line rounded-3xl p-6 mb-10">
            <p className="eyebrow mb-3">About</p>
            <p className="text-ink/70 leading-relaxed">{vendor.vendorProfile.businessDescription}</p>
          </div>
        )}

        {/* Services */}
        {services && services.length > 0 && (
          <div className="mb-10">
            <p className="eyebrow mb-4">Services</p>
            <div className="grid grid-cols-2 gap-3">
              {services.slice(0, 6).map((service) => (
                <div key={service._id} className="bg-canvas-soft border border-line rounded-2xl overflow-hidden">
                  {service.images && service.images.length > 0 ? (
                    <div className="relative w-full aspect-square">
                      <img src={service.images[0]} alt={service.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-white border-b border-line flex items-center justify-center">
                      <span className="font-display text-3xl text-ink/20">◇</span>
                    </div>
                  )}
                  <div className="px-3 py-3">
                    <div className="font-medium text-sm leading-tight line-clamp-2">{service.name}</div>
                    <div className="mt-2 flex justify-between items-center gap-2">
                      {service.duration && <div className="text-[10px] text-ink/40 uppercase tracking-wider">{service.duration} min</div>}
                      <div className="text-primary font-bold text-sm bg-primary/10 px-2.5 py-1 rounded-full">
                        ₦{service.basePrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {services.length > 6 && (
                <p className="col-span-2 text-center text-sm text-ink/40 pt-2">
                  +{services.length - 6} more in the app
                </p>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-ink text-white rounded-[2rem] p-8 text-center mb-5">
          <p className="font-display text-2xl mb-2">Ready to book {name}?</p>
          <p className="text-white/60 text-sm mb-6">Open in the LookReal app to book, message, and pay securely.</p>
          <a href={deepLink} className="btn-pill btn-accent w-full mb-3">
            Open in LookReal app →
          </a>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <a href={APP_STORE_URL} className="btn-pill bg-white/10 text-white hover:bg-white hover:text-ink border border-white/15">App Store</a>
            <a href={PLAY_STORE_URL} className="btn-pill bg-white/10 text-white hover:bg-white hover:text-ink border border-white/15">Google Play</a>
          </div>
        </div>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill w-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white"
        >
          Share on WhatsApp
        </a>

        {/* Categories */}
        {vendor.vendorProfile.categories?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 justify-center">
            {vendor.vendorProfile.categories.map((cat) => (
              <span key={cat._id} className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-3 py-1.5 rounded-full">
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-center text-ink/30 text-xs mt-10">
          Powered by{' '}
          <a href="https://lookreal.beauty" className="text-primary/70 hover:text-primary ulink">LookReal</a>
        </p>
      </section>
    </main>
  )
}
