import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: [
      'ag-grid-community',
      'ag-grid-react',
      'ag-grid-enterprise',
      '@tanstack/react-query',
      'dhtmlx-gantt',
    ],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Enable image optimization
  images: {
    domains: [], // Add any external image domains you need here
  },
  // Enable production source maps for better debugging
  productionBrowserSourceMaps: true,
}

export default withNextIntl(nextConfig)
