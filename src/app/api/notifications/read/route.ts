import { NextResponse } from 'next/server'
export async function POST() {
  // In production, store read state in DB
  return NextResponse.json({ ok: true })
}
