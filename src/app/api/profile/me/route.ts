import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*, business_accounts(*)')
    .eq('clerk_user_id', userId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // Never return encrypted_private_key
  const { encrypted_private_key, ...safe } = data
  return NextResponse.json({ profile: safe })
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const updates = await req.json()
  const allowed = ['display_name', 'bio', 'avatar_url']
  const safeUpdates = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  )

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('clerk_user_id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const { encrypted_private_key, ...safe } = data
  return NextResponse.json({ profile: safe })
}
