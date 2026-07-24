import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../lib/auth'

export const metadata: Metadata = {
  title: 'VastraWise – Rental Manager',
  description: 'Modern clothing rental management platform for tracking outfits, billing, customers, and analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}