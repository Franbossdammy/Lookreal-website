import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LookReal - Connect, Book & Shop with Local Vendors',
  description: 'Discover and book services, shop products, and connect with trusted local vendors. Features bookings, marketplace, escrow payments, and real-time communication.',
  keywords: ['marketplace', 'vendor booking', 'local services', 'product ordering', 'escrow payment', 'mobile app', 'iOS', 'Android'],
  openGraph: {
    title: 'LookReal - Connect, Book & Shop with Local Vendors',
    description: 'Discover and book services, shop products, and connect with trusted local vendors.',
    type: 'website',
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
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Righteous&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
