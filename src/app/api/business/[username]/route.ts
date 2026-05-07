import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/business/[username] — get a single business by username (public)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const supabase = await createClient()

  const { data: business, error } = await supabase
    .from('business_accounts')
    .select('*, profile:profiles(username, display_name, avatar_url, wallet_address)')
    .eq('username', username)
    .single()

  if (error || !business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  return NextResponse.json({ business })
}
