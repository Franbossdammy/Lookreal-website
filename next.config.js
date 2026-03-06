/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: '/share/vendor/:id', destination: '/share' },
      { source: '/share/product/:id', destination: '/share' },
    ];
  },
}

module.exports = nextConfig
