import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export type BridgeProvider = 'layerzero' | 'relay'

interface BridgeQuoteRequest {
  provider: BridgeProvider
  fromChain: string
  toChain: string
  fromToken: string
  toToken: string
  amount: string
  fromAddress: string
}

// GET /api/bridge?provider=layerzero&fromChain=...&toChain=...&amount=...
export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const provider = (searchParams.get('provider') ?? 'layerzero') as BridgeProvider
    const fromChain = searchParams.get('fromChain')
    const toChain = searchParams.get('toChain')
    const fromToken = searchParams.get('fromToken')
    const amount = searchParams.get('amount')

    if (!fromChain || !toChain || !fromToken || !amount) {
      return NextResponse.json(
        { error: 'fromChain, toChain, fromToken, and amount are required' },
        { status: 400 }
      )
    }

    // TODO: Integrate with actual LayerZero Stargate SDK / Relay API
    // For now, return a mock quote structure
    const mockFee = (parseFloat(amount) * 0.001).toFixed(6)
    const mockOutput = (parseFloat(amount) - parseFloat(mockFee)).toFixed(6)

    const quote = {
      provider,
      fromChain,
      toChain,
      fromToken,
      toToken: fromToken, // same stablecoin on destination
      inputAmount: amount,
      outputAmount: mockOutput,
      fee: mockFee,
      estimatedTime: provider === 'layerzero' ? '~2-5 minutes' : '~30 seconds',
    }

    return NextResponse.json({ data: quote })
  } catch (error) {
    console.error('GET /api/bridge error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: BridgeQuoteRequest = await request.json()
    const { provider, fromChain, toChain, fromToken, toToken, amount, fromAddress } = body

    if (!provider || !fromChain || !toChain || !fromToken || !amount || !fromAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // TODO: Implement actual bridge transaction via LayerZero / Relay SDK
    // This would:
    // 1. Build the bridge transaction calldata
    // 2. Return it to the client for signing
    // 3. Client broadcasts the signed tx
    // 4. We poll/webhook for confirmation

    return NextResponse.json({
      data: {
        status: 'quote_generated',
        message: 'Bridge integration coming soon. SDK integration required.',
        provider,
        fromChain,
        toChain,
        fromToken,
        toToken: toToken ?? fromToken,
        amount,
      },
    })
  } catch (error) {
    console.error('POST /api/bridge error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
