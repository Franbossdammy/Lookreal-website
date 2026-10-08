import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  title: 'LookReal — Book beauty & wellness, locally.',
  description: 'LookReal is the marketplace for booking trusted beauty and wellness professionals near you. Secure payments, in-app messaging, and verified vendors.',
  keywords: ['marketplace', 'vendor booking', 'local services', 'product ordering', 'escrow payment', 'mobile app', 'iOS', 'Android'],
  icons: {
    icon: '/favicon.png',
    apple: '/assets/logo.png',
  },
  openGraph: {
    title: 'LookReal — Book beauty & wellness, locally.',
    description: 'Discover and book services, shop products, and connect with trusted local vendors.',
    type: 'website',
    images: [{ url: '/assets/logo.png', width: 512, height: 512 }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..900,0..100,0..1;1,9..144,300..900,0..100,0..1&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}</Script>
        </>
      )}
      <body className="font-sans antialiased bg-canvas text-ink">{children}</body>
    </html>
  )
}
