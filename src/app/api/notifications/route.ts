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

  // Return recent transactions as notifications (since we may not have a dedicated notifications table yet)
  const { data: received } = await supabase
    .from('transactions')
    .select('*, from_profile:profiles!transactions_from_profile_id_fkey(username, display_name, avatar_url)')
    .eq('to_profile_id', profile.id)
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: requests } = await supabase
    .from('payment_requests')
    .select('*, from_profile:profiles!payment_requests_from_profile_id_fkey(username, display_name, avatar_url)')
    .eq('to_profile_id', profile.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(10)

  const notifications = [
    ...(received || []).map((tx: Record<string, unknown>) => ({
      id: `tx-${tx.id}`,
      type: 'payment_received',
      title: 'Payment received',
      message: `${(tx.from_profile as Record<string, unknown>)?.display_name || 'Someone'} sent you $${tx.amount}${tx.memo ? ` · ${tx.memo}` : ''}`,
      avatar: (tx.from_profile as Record<string, unknown>)?.avatar_url,
      username: (tx.from_profile as Record<string, unknown>)?.username,
      amount: tx.amount,
      read: false,
      created_at: tx.created_at,
      href: `/history`,
    })),
    ...(requests || []).map((req: Record<string, unknown>) => ({
      id: `req-${req.id}`,
      type: 'payment_request',
      title: 'Payment request',
      message: `${(req.from_profile as Record<string, unknown>)?.display_name || 'Someone'} is requesting $${req.amount}${req.memo ? ` · ${req.memo}` : ''}`,
      avatar: (req.from_profile as Record<string, unknown>)?.avatar_url,
      username: (req.from_profile as Record<string, unknown>)?.username,
      amount: req.amount,
      read: false,
      created_at: req.created_at,
      href: `/request`,
    })),
  ].sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())

  return NextResponse.json({ notifications, unreadCount: notifications.filter((n) => !n.read).length })
}
