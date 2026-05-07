import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Admetos', template: '%s | Admetos' },
  description: 'Pay with style on the Tempo blockchain. Send, receive, and request stablecoin payments with memos.',
  manifest: '/manifest.json',
  themeColor: '#8B5CF6',
  openGraph: {
    title: 'Admetos',
    description: 'Pay with style on the Tempo blockchain',
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admetos',
    description: 'Pay with style on the Tempo blockchain',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
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
