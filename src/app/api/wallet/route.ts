import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWallet, encryptPrivateKey, decryptPrivateKey } from '@/lib/wallet/generate'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('wallet_address')
      .eq('clerk_user_id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ data: { address: profile.wallet_address } })
  } catch (error) {
    console.error('GET /api/wallet error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const encryptionKey = process.env.WALLET_ENCRYPTION_KEY
    if (!encryptionKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Generate a new wallet
    const wallet = generateWallet()
    const encryptedKey = encryptPrivateKey(wallet.privateKey, encryptionKey)

    return NextResponse.json({
      data: {
        address: wallet.address,
        encryptedPrivateKey: encryptedKey,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/wallet error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Export private key (requires explicit user confirmation)
export async function PUT(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    if (!body.confirmed) {
      return NextResponse.json({ error: 'User confirmation required' }, { status: 400 })
    }

    const encryptionKey = process.env.WALLET_ENCRYPTION_KEY
    if (!encryptionKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('encrypted_private_key')
      .eq('clerk_user_id', userId)
      .single()

    if (!profile?.encrypted_private_key) {
      return NextResponse.json({ error: 'No wallet found' }, { status: 404 })
    }

    const privateKey = decryptPrivateKey(profile.encrypted_private_key, encryptionKey)

    return NextResponse.json({ data: { privateKey } })
  } catch (error) {
    console.error('PUT /api/wallet error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
