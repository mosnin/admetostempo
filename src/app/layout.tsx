import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admetos — Pay with Style',
  description: 'The next-generation payment platform built on Tempo blockchain',
  keywords: ['payments', 'crypto', 'tempo blockchain', 'stablecoin', 'send money'],
  authors: [{ name: 'Admetos' }],
  openGraph: {
    title: 'Admetos — Pay with Style',
    description: 'The next-generation payment platform built on Tempo blockchain',
    type: 'website',
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
