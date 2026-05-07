import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile not found — user needs onboarding
        return NextResponse.json({ data: null, needsOnboarding: true })
      }
      throw error
    }

    return NextResponse.json({ data: profile })
  } catch (error) {
    console.error('GET /api/profile error:', error)
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
    const { username, display_name, bio, avatar_url, wallet_address, encrypted_private_key, is_business } = body

    if (!username || !display_name || !wallet_address) {
      return NextResponse.json(
        { error: 'username, display_name, and wallet_address are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check username availability
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', username)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        clerk_user_id: userId,
        username,
        display_name,
        bio: bio ?? null,
        avatar_url: avatar_url ?? null,
        wallet_address,
        encrypted_private_key: encrypted_private_key ?? null,
        is_business: is_business ?? false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data: profile }, { status: 201 })
  } catch (error) {
    console.error('POST /api/profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const allowedFields = ['display_name', 'bio', 'avatar_url', 'username']
    const updates: Record<string, unknown> = {}

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('clerk_user_id', userId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data: profile })
  } catch (error) {
    console.error('PATCH /api/profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
