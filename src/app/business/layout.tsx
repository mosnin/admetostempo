import { TopNav } from '@/components/navigation/TopNav'
import { FloatingDock } from '@/components/navigation/FloatingDock'

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
