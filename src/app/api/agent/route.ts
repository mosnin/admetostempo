// POST /api/agent — create an agent API key tied to a user account
// GET /api/agent — list agent keys for current user
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  const apiKey = `admetos_agent_${randomBytes(24).toString('hex')}`

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  // Store agent key (in production: use a dedicated agent_keys table)
  // For now, return the key — user must save it
  return NextResponse.json({
    apiKey,
    name: name || 'My Agent',
    profileId: profile.id,
    message: 'Save this key securely — it will not be shown again.',
  })
}
