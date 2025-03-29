// in app/providers.tsx

'use client'

import { SessionProvider, signIn } from 'next-auth/react'
import theme from '@/lib/mui/theme'
import { ThemeProvider } from '@mui/material/styles'
import type { Session } from 'next-auth'
import { FrappeAPIProvider } from '@vise/kit'
import { useEffect, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LicenseManager } from 'ag-grid-enterprise'
import crypto from 'crypto'


export default function Providers({
  session,
  children,
  licenseKey
}: {
  session: Session | null
  children: React.ReactNode
  licenseKey: {iv: string, encryptedData: string}
}) {
  const [isLicenseSet, setIsLicenseSet] = useState<boolean>(false)

  // setting Aggid License from RootLayout Props
  useEffect(() => {
    console.log('🔄 Checking AG Grid License...');
    try {
      // **Decrypt the license key**
      const decryptLicenseKey = (encryptedData: string, iv: string) => {
        const algorithm = 'aes-256-cbc';
        const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY!; // Use the same secret key
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      };

      // Decrypt and set license
      const deLicenseKey = decryptLicenseKey(licenseKey.encryptedData, licenseKey.iv);
      LicenseManager.setLicenseKey(deLicenseKey);
      console.log('✅ AG Grid License Set in Successful');
      setIsLicenseSet(true);
    } catch (error) {
      console.error('❌ Failed to decrypt license key:', error);
    }
  }, [licenseKey]);


  const queryClient = useMemo(() => new QueryClient(), [])

  const onHandleError = (_err: string) => {
    signIn()
  }

  return (
    <QueryClientProvider client={queryClient}>
      <FrappeAPIProvider
        session={session}
        onError={onHandleError}
        getFieldMetaUrl="vise_budget_planning.api.v1.base.get_doctype_fields"
      >
        <SessionProvider session={session}>
          <ThemeProvider theme={theme}>{isLicenseSet && children}</ThemeProvider>
        </SessionProvider>
      </FrappeAPIProvider>
    </QueryClientProvider>
  )
}
