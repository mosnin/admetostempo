import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { getBalance } from '@/lib/tempo/payments'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_address')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return NextResponse.json({ balance: '0' })

  try {
    const balance = await getBalance(profile.wallet_address)
    return NextResponse.json({ balance })
  } catch {
    return NextResponse.json({ balance: '0' })
  }
}
