import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const pageSize = parseInt(searchParams.get('pageSize') ?? '20')
    const filter = searchParams.get('filter') ?? 'all' // all | sent | received

    const supabase = await createClient()

    // Get the current user's profile id
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let query = supabase
      .from('transactions')
      .select(`
        *,
        from_profile:profiles!from_profile_id(id, username, display_name, avatar_url),
        to_profile:profiles!to_profile_id(id, username, display_name, avatar_url)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (filter === 'sent') {
      query = query.eq('from_profile_id', profile.id)
    } else if (filter === 'received') {
      query = query.eq('to_profile_id', profile.id)
    } else {
      query = query.or(`from_profile_id.eq.${profile.id},to_profile_id.eq.${profile.id}`)
    }

    const { data: transactions, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data: transactions,
      total: count ?? 0,
      page,
      pageSize,
      hasMore: (count ?? 0) > page * pageSize,
    })
  } catch (error) {
    console.error('GET /api/payments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      to_address,
      to_username,
      amount,
      currency = 'pathUSD',
      memo,
      tx_hash,
    } = body

    if (!to_address || !amount) {
      return NextResponse.json(
        { error: 'to_address and amount are required' },
        { status: 400 }
      )
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get sender profile
    const { data: fromProfile } = await supabase
      .from('profiles')
      .select('id, wallet_address')
      .eq('clerk_user_id', userId)
      .single()

    if (!fromProfile) {
      return NextResponse.json({ error: 'Sender profile not found' }, { status: 404 })
    }

    // Get recipient profile (if internal transfer)
    let toProfileId: string | null = null
    if (to_username) {
      const { data: toProfile } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', to_username)
        .maybeSingle()
      toProfileId = toProfile?.id ?? null
    } else {
      const { data: toProfile } = await supabase
        .from('profiles')
        .select('id')
        .ilike('wallet_address', to_address)
        .maybeSingle()
      toProfileId = toProfile?.id ?? null
    }

    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        from_profile_id: fromProfile.id,
        to_profile_id: toProfileId,
        from_address: fromProfile.wallet_address,
        to_address,
        amount: parseFloat(amount),
        currency,
        memo: memo ?? null,
        tx_hash: tx_hash ?? null,
        status: tx_hash ? 'confirmed' : 'pending',
        is_external: !toProfileId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data: transaction }, { status: 201 })
  } catch (error) {
    console.error('POST /api/payments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
