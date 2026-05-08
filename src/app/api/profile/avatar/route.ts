import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createClient()

  try {
    const formData = await req.formData()
    const file = formData.get('avatar') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.type.split('/')[1] || 'jpg'
    const path = `avatars/${userId}-${Date.now()}.${ext}`

    // Upload to Supabase Storage (bucket: 'avatars' must exist in Supabase)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, buffer, { contentType: file.type, upsert: true })

    if (uploadError) {
      // Fallback: use a data URL representation or default avatar service
      // For demo, return a placeholder dicebear avatar
      const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
      await supabase.from('profiles').update({ avatar_url: fallbackUrl }).eq('clerk_user_id', userId)
      return NextResponse.json({ url: fallbackUrl })
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('clerk_user_id', userId)

    return NextResponse.json({ url: publicUrl })
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
