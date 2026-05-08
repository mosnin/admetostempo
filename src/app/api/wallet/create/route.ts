import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { generateWallet, encryptPrivateKey } from '@/lib/wallet/generate'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await currentUser()
  const { username, displayName, bio, isBusiness } = await req.json()

  // Validate username (alphanumeric + underscore, 3-20 chars)
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 })
  }

  const supabase = await createClient()

  // Check username uniqueness
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (existing) return NextResponse.json({ error: 'Username taken' }, { status: 409 })

  // Generate wallet
  const wallet = generateWallet()
  const encryptedKey = encryptPrivateKey(
    wallet.privateKey,
    process.env.WALLET_ENCRYPTION_KEY!
  )

  // Save profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      clerk_user_id: userId,
      username,
      display_name: displayName || user?.firstName || username,
      bio: bio || null,
      avatar_url: user?.imageUrl || null,
      wallet_address: wallet.address,
      encrypted_private_key: encryptedKey,
      is_business: isBusiness ?? false,
      onboarding_complete: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    profile: { ...profile, encrypted_private_key: undefined },
    walletAddress: wallet.address,
  })
}
