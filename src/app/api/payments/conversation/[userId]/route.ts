// GET conversation-style history between two users
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient()
  const [{ data: me }, { data: other }] = await Promise.all([
    supabase.from('profiles').select('id').eq('clerk_user_id', userId).single(),
    supabase.from('profiles').select('id, username, display_name, avatar_url, wallet_address').eq('id', params.userId).single(),
  ])

  if (!me || !other) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .or(`and(from_profile_id.eq.${me.id},to_profile_id.eq.${other.id}),and(from_profile_id.eq.${other.id},to_profile_id.eq.${me.id})`)
    .order('created_at', { ascending: true })

  return NextResponse.json({ transactions: transactions || [], otherUser: other })
}
