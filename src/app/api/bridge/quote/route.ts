import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getBridgeQuote } from '@/lib/tempo/bridge-client'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  try {
    const quotes = await getBridgeQuote(body)
    return NextResponse.json({ quotes })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to get quote'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
