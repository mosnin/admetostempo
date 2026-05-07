import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Admetos — Pay with Style', template: '%s | Admetos' },
  description: 'The next-generation payment platform built on Tempo blockchain. Send stablecoins instantly with style.',
  keywords: ['payments', 'stablecoins', 'crypto', 'Tempo', 'blockchain', 'Venmo'],
  authors: [{ name: 'Admetos' }],
  creator: 'Admetos',
  metadataBase: new URL('https://admetos.xyz'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://admetos.xyz',
    title: 'Admetos — Pay with Style',
    description: 'Stablecoin payments on Tempo blockchain',
    siteName: 'Admetos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admetos — Pay with Style',
    description: 'Stablecoin payments on Tempo blockchain',
    creator: '@admetos',
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Admetos' },
  formatDetection: { telephone: false },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#c4b5fd' },
    { media: '(prefers-color-scheme: dark)', color: '#7c3aed' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
