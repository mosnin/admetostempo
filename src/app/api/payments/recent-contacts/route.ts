import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('id').eq('clerk_user_id', userId).single()

  if (!profile) return NextResponse.json({ contacts: [] })

  // Get most recently transacted profiles (excluding self)
  const { data: sentTx } = await supabase
    .from('transactions')
    .select('to_profile_id, created_at, amount, to_profile:profiles!transactions_to_profile_id_fkey(id, username, display_name, avatar_url)')
    .eq('from_profile_id', profile.id)
    .eq('is_external', false)
    .not('to_profile_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(30)

  // Deduplicate by profile_id, keeping most recent
  const seen = new Set<string>()
  const contacts: Array<{
    profile_id: string
    username: string
    display_name: string
    avatar_url: string | null
    last_paid_at: string
    total_paid: number
  }> = []

  for (const tx of (sentTx || [])) {
    const p = tx.to_profile as { id: string; username: string; display_name: string; avatar_url: string | null } | null
    if (!p || seen.has(p.id)) continue
    seen.add(p.id)
    contacts.push({
      profile_id: p.id,
      username: p.username,
      display_name: p.display_name,
      avatar_url: p.avatar_url,
      last_paid_at: tx.created_at,
      total_paid: tx.amount,
    })
    if (contacts.length >= 8) break
  }

  return NextResponse.json({ contacts })
}
