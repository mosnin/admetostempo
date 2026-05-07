import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { sendPayment } from '@/lib/tempo/payments'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { toUsername, toAddress, amount, memo, currency } = await req.json()

  if (!amount || parseFloat(amount) <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const supabase = await createClient()

  // Get sender profile with encrypted key
  const { data: sender, error: senderErr } = await supabase
    .from('profiles')
    .select('id, wallet_address, encrypted_private_key, username')
    .eq('clerk_user_id', userId)
    .single()

  if (senderErr || !sender) {
    return NextResponse.json({ error: 'Sender not found' }, { status: 404 })
  }

  // Resolve recipient
  let recipientAddress = toAddress
  let recipientProfile = null

  if (toUsername) {
    const { data: recipient } = await supabase
      .from('profiles')
      .select('id, wallet_address, username, display_name')
      .eq('username', toUsername)
      .single()

    if (!recipient) return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
    recipientAddress = recipient.wallet_address
    recipientProfile = recipient
  }

  if (!recipientAddress) {
    return NextResponse.json({ error: 'No recipient specified' }, { status: 400 })
  }

  // Create pending transaction record
  const { data: txRecord } = await supabase
    .from('transactions')
    .insert({
      from_profile_id: sender.id,
      to_profile_id: recipientProfile?.id || null,
      from_address: sender.wallet_address,
      to_address: recipientAddress,
      amount: parseFloat(amount),
      currency: currency || 'pathUSD',
      memo: memo || null,
      status: 'pending',
      is_external: !recipientProfile,
    })
    .select()
    .single()

  try {
    // Execute blockchain transaction
    const { hash } = await sendPayment({
      fromEncryptedKey: sender.encrypted_private_key,
      toAddress: recipientAddress,
      amount,
      memo,
    })

    // Update transaction record
    await supabase
      .from('transactions')
      .update({ tx_hash: hash, status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', txRecord!.id)

    // Send notification if recipient is on Admetos
    if (recipientProfile) {
      await supabase.from('notifications').insert({
        user_id: recipientProfile.id,
        type: 'payment_received',
        title: 'Payment received',
        message: `${sender.username} sent you ${amount} ${currency || 'pathUSD'}${memo ? ': ' + memo : ''}`,
        related_transaction_id: txRecord!.id,
      })
    }

    return NextResponse.json({ hash, transactionId: txRecord!.id })
  } catch (err: unknown) {
    await supabase
      .from('transactions')
      .update({ status: 'failed' })
      .eq('id', txRecord!.id)

    const errorMessage = err instanceof Error ? err.message : 'Transaction failed'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
