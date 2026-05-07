import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { businessId, name, description, price, currency, imageUrl, isActive } = await req.json()

  if (!businessId || !name || !price) {
    return NextResponse.json({ error: 'businessId, name, and price are required' }, { status: 400 })
  }

  if (parseFloat(price) <= 0) {
    return NextResponse.json({ error: 'Price must be greater than 0' }, { status: 400 })
  }

  const supabase = await createClient()

  // Verify ownership: the requesting user must own the business
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data: business } = await supabase
    .from('business_accounts')
    .select('id')
    .eq('id', businessId)
    .eq('profile_id', profile.id)
    .single()

  if (!business) return NextResponse.json({ error: 'Business not found or access denied' }, { status: 403 })

  const { data, error } = await supabase
    .from('products')
    .insert({
      business_id: businessId,
      name,
      description: description || null,
      price: parseFloat(price),
      currency: currency || 'pathUSD',
      image_url: imageUrl || null,
      is_active: isActive ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('business_id')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')
  const activeOnly = req.nextUrl.searchParams.get('active') !== 'false'

  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*, business:business_accounts(id, business_name, username)')
    .limit(limit)
    .order('created_at', { ascending: false })

  if (businessId) query = query.eq('business_id', businessId)
  if (activeOnly) query = query.eq('is_active', true)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: data || [] })
}
