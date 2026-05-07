import { redirect } from 'next/navigation'

// The home feed lives at /dashboard — redirect bare / to there.
export default function RootDashboardPage() {
  redirect('/dashboard')
}
