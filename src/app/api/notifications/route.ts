import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('id').eq('clerk_user_id', userId).single()

  if (!profile) return NextResponse.json({ notifications: [] })

  // Derive notifications from recent transactions/requests
  const { data: received } = await supabase
    .from('transactions')
    .select('id, from_profile:profiles!from_profile_id(display_name, username), amount, currency, memo, created_at')
    .eq('to_profile_id', profile.id)
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: requests } = await supabase
    .from('payment_requests')
    .select('id, from_profile:profiles!from_profile_id(display_name, username), amount, memo, status, created_at')
    .eq('to_profile_id', profile.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)

  const notifications = [
    ...(received || []).map((t: any) => ({
      id: `tx-${t.id}`,
      type: 'received' as const,
      title: `${t.from_profile?.display_name || 'Someone'} sent you $${t.amount}`,
      body: t.memo || `${t.amount} ${t.currency}`,
      read: false,
      createdAt: t.created_at,
      href: `/history/${t.from_profile?.username}`,
    })),
    ...(requests || []).map((r: any) => ({
      id: `req-${r.id}`,
      type: 'request' as const,
      title: `${r.from_profile?.display_name || 'Someone'} requested $${r.amount}`,
      body: r.memo || 'Payment request',
      read: false,
      createdAt: r.created_at,
      href: `/request`,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({ notifications })
}
