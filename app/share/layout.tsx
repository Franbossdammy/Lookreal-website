import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Someone shared something with you on LookReal',
  description: 'Open this link to view this vendor or product on the LookReal app. Discover and book services, shop products, and connect with local vendors.',
  openGraph: {
    title: 'Check this out on LookReal!',
    description: 'Tap to view this vendor or product on the LookReal app.',
    type: 'website',
    siteName: 'LookReal',
  },
  twitter: {
    card: 'summary',
    title: 'Check this out on LookReal!',
    description: 'Tap to view this vendor or product on the LookReal app.',
  },
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
