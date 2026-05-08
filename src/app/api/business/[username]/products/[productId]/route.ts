import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

type RouteParams = { params: Promise<{ username: string; productId: string }> }

// PATCH /api/business/[username]/products/[productId] — update a product (owner only)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { username, productId } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data: business } = await supabase
    .from('business_accounts')
    .select('id')
    .eq('username', username)
    .eq('profile_id', profile.id)
    .single()

  if (!business) return NextResponse.json({ error: 'Business not found or access denied' }, { status: 403 })

  const body = await req.json()
  const updates: Record<string, unknown> = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.description !== undefined) updates.description = body.description
  if (body.price !== undefined) updates.price = parseFloat(body.price)
  if (body.image_url !== undefined) updates.image_url = body.image_url
  if (body.available !== undefined) updates.is_active = body.available

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .eq('business_id', business.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const product = { ...data, available: data.is_active }
  return NextResponse.json({ product })
}

// DELETE /api/business/[username]/products/[productId] — delete a product (owner only)
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { username, productId } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data: business } = await supabase
    .from('business_accounts')
    .select('id')
    .eq('username', username)
    .eq('profile_id', profile.id)
    .single()

  if (!business) return NextResponse.json({ error: 'Business not found or access denied' }, { status: 403 })

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('business_id', business.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
