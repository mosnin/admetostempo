import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { businessName, description, category, website, username } = await req.json()

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  // Check username
  const { data: existing } = await supabase
    .from('business_accounts')
    .select('id')
    .eq('username', username)
    .single()

  if (existing) return NextResponse.json({ error: 'Username taken' }, { status: 409 })

  const { data, error } = await supabase
    .from('business_accounts')
    .insert({ profile_id: profile.id, business_name: businessName, description, category, website, username })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ business: data })
}

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category')
  const search = req.nextUrl.searchParams.get('q')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')

  const supabase = await createClient()
  let query = supabase
    .from('business_accounts')
    .select('*, profile:profiles(username, display_name, avatar_url, wallet_address)')
    .limit(limit)

  if (category && category !== 'all') query = query.eq('category', category)
  if (search) query = query.ilike('business_name', `%${search}%`)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ businesses: data || [] })
}
