import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendPayment } from '@/lib/tempo/payments'

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey?.startsWith('admetos_agent_')) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  const { toAddress, toUsername, amount, memo } = await req.json()

  // In production: validate API key against DB, get profile
  // For now, return structured response demonstrating the protocol
  return NextResponse.json({
    status: 'queued',
    message: 'Agent payment protocol — connect API key to profile to enable',
    protocol: 'MPP',
    amount,
    to: toAddress || toUsername,
    memo,
  }, { status: 202 })
}
