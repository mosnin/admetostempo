import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { TopNav } from '@/components/navigation/TopNav'
import { FloatingDock } from '@/components/navigation/FloatingDock'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { KeyboardShortcuts } from '@/components/ui/KeyboardShortcuts'
import { ShortcutsModal } from '@/components/ui/ShortcutsModal'
import { NetworkStatus } from '@/components/ui/NetworkStatus'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-gradient-pastel">
      {/* Fixed top navigation bar */}
      <TopNav />

      {/* Main content — padded to clear nav (pt-20) and dock (pb-32) */}
      <main className="max-w-2xl mx-auto px-4 pt-20 pb-32">
        {children}
      </main>

      {/* Floating bottom dock */}
      <FloatingDock />

      {/* Global command palette — available on all dashboard pages */}
      <CommandPalette />
      <KeyboardShortcuts />
      <ShortcutsModal />
      <NetworkStatus />
    </div>
  )
}
