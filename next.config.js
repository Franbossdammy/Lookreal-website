/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Generate the share page so hosting can rewrite to it
  trailingSlash: true,
}

module.exports = nextConfig
