import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | LookReal - Tips, Insights & Stories',
  description: 'Read the latest articles about local services, beauty tips, vendor success stories, and marketplace insights from LookReal.',
  keywords: ['blog', 'beauty tips', 'local services', 'vendor stories', 'marketplace insights', 'LookReal blog', 'beauty industry', 'entrepreneurship'],
  openGraph: {
    title: 'Blog | LookReal - Tips, Insights & Stories',
    description: 'Read the latest articles about local services, beauty tips, vendor success stories, and marketplace insights.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | LookReal',
    description: 'Tips, insights, and stories about local services, beauty, and entrepreneurship.',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
