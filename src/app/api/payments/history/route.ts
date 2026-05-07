// GET /api/payments/history?page=1&limit=20
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return NextResponse.json({ transactions: [], hasMore: false })

  const { data, count } = await supabase
    .from('transactions')
    .select('*, from_profile:profiles!from_profile_id(id, username, display_name, avatar_url), to_profile:profiles!to_profile_id(id, username, display_name, avatar_url)', { count: 'exact' })
    .or(`from_profile_id.eq.${profile.id},to_profile_id.eq.${profile.id}`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return NextResponse.json({
    transactions: data || [],
    total: count || 0,
    hasMore: (count || 0) > offset + limit,
  })
}
