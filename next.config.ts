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
  /* Build the project as a standalone app inside the Docker image */
  output: 'standalone',
}

export default withNextIntl(nextConfig)
