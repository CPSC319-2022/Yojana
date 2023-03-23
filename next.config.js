/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Set cache-control header for JSON files
        source: '/(.*)\\.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=15552000' // 6 months
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
module.exports = withBundleAnalyzer(nextConfig)
