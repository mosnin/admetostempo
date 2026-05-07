import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/business/[username]/products — list products for a business
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const supabase = await createClient()

  const { data: business, error: bErr } = await supabase
    .from('business_accounts')
    .select('id')
    .eq('username', username)
    .single()

  if (bErr || !business) return NextResponse.json({ products: [] })

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: data || [] })
}

// POST /api/business/[username]/products — add a product (owner only)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { username } = await params
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
  const { name, description, price, image_url, available } = body

  if (!name || price === undefined) {
    return NextResponse.json({ error: 'name and price are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      business_id: business.id,
      name,
      description: description || null,
      price: parseFloat(price),
      currency: 'pathUSD',
      image_url: image_url || null,
      is_active: available ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Normalize field names for the client (uses `available` not `is_active`)
  const product = { ...data, available: data.is_active }
  return NextResponse.json({ product }, { status: 201 })
}
