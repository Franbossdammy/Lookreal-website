/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ]
  },
  async rewrites() {
    return [
      { source: '/share/vendor/:id', destination: '/share' },
      { source: '/share/product/:id', destination: '/share' },
    ];
  },
}

module.exports = nextConfig
