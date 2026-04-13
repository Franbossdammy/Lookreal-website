import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Booked & Glowing Challenge — Win ₦500,000 | LookReal',
  description: 'Create a short video showing your LookReal beauty experience and win up to ₦250,000. Post on TikTok and Instagram. Open to all creators in Lagos, Nigeria.',
  keywords: ['LookReal challenge', 'Booked and Glowing', 'beauty challenge Nigeria', 'Lagos creator competition', 'win money Nigeria'],
  openGraph: {
    title: 'Booked & Glowing Challenge — Win ₦500,000 | LookReal',
    description: 'Create a short video showing your LookReal beauty experience and win up to ₦250,000. Open to all Lagos creators.',
    type: 'website',
    url: 'https://lookreal.beauty/challenge',
    // ⚠️ Add a challenge-specific OG image (1200×630px recommended) to /public/assets/
    // images: [{ url: 'https://lookreal.beauty/assets/challenge-og.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Booked & Glowing Challenge — Win ₦500,000 | LookReal',
    description: 'Create a short video showing your LookReal beauty experience and win up to ₦250,000.',
  },
}

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
