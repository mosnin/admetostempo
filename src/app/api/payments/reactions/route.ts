import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { transaction_id, emoji } = await req.json()
  // In production: store in a reactions table (transaction_id, user_id, emoji)
  // For now just acknowledge
  return NextResponse.json({ ok: true, transaction_id, emoji })
}
