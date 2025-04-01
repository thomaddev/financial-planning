'use server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { getSession } from '@/auth'
import Providers from './providers'
import './globals.css'
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const Header = dynamic(() => import('@/components/Header'))

// **Encrypt the license key before passing it to the client**
const encryptLicenseKey = (licenseKey: string) => {
  const algorithm = 'aes-256-cbc'
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY!
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv)
  let encrypted = cipher.update(licenseKey, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return { iv: iv.toString('hex'), encryptedData: encrypted }
}

// Get Aggrid License from file in secret folder
const loadAgGridLicense = () => {
  try {
    if (process.env.AG_GRID_LICENSE_PATH) {
      const licensePath = path.resolve(process.cwd(), process.env.AG_GRID_LICENSE_PATH!) // Path inside Docker or server
      if (!fs.existsSync(licensePath)) throw new Error('License file not found')
      const licenseKey = fs.readFileSync(licensePath, 'utf8').trim()
      console.log('✅ AG Grid License Loaded on Server (File Path)')
      return licenseKey
    } else if (process.env.AG_GRID_LICENSE) {
      console.log('✅ AG Grid License Loaded on Server (Content)')
      return process.env.AG_GRID_LICENSE
    } else {
      return ''
    }
  } catch (error) {
    console.error('🚨 Failed to load AG Grid License:', error)
    return ''
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const rawLicenseKey = loadAgGridLicense()
  const encryptedLicense = encryptLicenseKey(rawLicenseKey)

  const session = await getSession()

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers session={session} licenseKey={encryptedLicense}>
          <NextIntlClientProvider messages={messages}>
            <Toaster />
            {children}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} position="left" />
            )}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
