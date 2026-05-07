import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { TopNav } from '@/components/navigation/TopNav'
import { FloatingDock } from '@/components/navigation/FloatingDock'

export const metadata = {
  title: 'Explore — Admetos',
  description: 'Discover businesses and people on Admetos',
}

export default async function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-gradient-pastel">
      <TopNav />
      <main className="max-w-2xl mx-auto px-4 pt-20 pb-32">
        {children}
      </main>
      <FloatingDock />
    </div>
  )
}
