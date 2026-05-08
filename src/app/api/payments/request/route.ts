// POST: create a payment request
// GET: list payment requests for current user
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { toUsername, amount, memo } = await req.json()

  const supabase = await createClient()

  const [{ data: requester }, { data: target }] = await Promise.all([
    supabase.from('profiles').select('id').eq('clerk_user_id', userId).single(),
    supabase.from('profiles').select('id, username, display_name').eq('username', toUsername).single(),
  ])

  if (!requester || !target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('payment_requests')
    .insert({
      from_profile_id: requester.id,
      to_profile_id: target.id,
      amount: parseFloat(amount),
      memo: memo || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify target
  await supabase.from('notifications').insert({
    user_id: target.id,
    type: 'payment_request',
    title: 'Payment requested',
    message: `Someone requested ${amount} pathUSD from you${memo ? ': ' + memo : ''}`,
    related_request_id: data.id,
  })

  return NextResponse.json({ request: data })
}

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return NextResponse.json({ requests: [] })

  const { data } = await supabase
    .from('payment_requests')
    .select('*, from_profile:profiles!from_profile_id(username, display_name, avatar_url), to_profile:profiles!to_profile_id(username, display_name, avatar_url)')
    .or(`from_profile_id.eq.${profile.id},to_profile_id.eq.${profile.id}`)
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ requests: data || [] })
}
