import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

export default async function PayPage({
  params, searchParams
}: {
  params: Promise<{ username: string }>
  searchParams: Promise<{ amount?: string; memo?: string }>
}) {
  const { username } = await params
  const { amount, memo } = await searchParams
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url, bio')
    .eq('username', username)
    .single()

  const sendUrl = `/send?to=${username}${amount ? `&amount=${amount}` : ''}${memo ? `&memo=${encodeURIComponent(memo)}` : ''}`

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #ede9fe 0%, #d1fae5 50%, #ffedd5 100%)'}}>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        {/* Logo */}
        <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-emerald-500 mb-6">admetos</p>

        {profile ? (
          <>
            <Avatar src={profile.avatar_url} name={profile.display_name || username} size="xl" className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800">{profile.display_name || `@${username}`}</h1>
            {profile.bio && <p className="text-slate-500 text-sm mt-1 mb-2">{profile.bio}</p>}
            <p className="text-slate-400 text-sm mb-6">@{username}</p>
            {amount && (
              <div className="bg-violet-50 rounded-2xl p-3 mb-4">
                <p className="text-3xl font-bold text-violet-700">${amount}</p>
                {memo && <p className="text-slate-500 text-sm mt-1">{memo}</p>}
              </div>
            )}
            <Link href={sendUrl} className="block">
              <Button variant="primary" className="w-full text-lg py-4">
                Pay {profile.display_name || `@${username}`}
              </Button>
            </Link>
            <p className="text-xs text-slate-400 mt-4">Powered by Admetos · Tempo blockchain</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">User not found</h2>
            <p className="text-slate-500 mb-6">@{username} doesn&apos;t exist on Admetos yet.</p>
            <Link href="/sign-up"><Button variant="primary" className="w-full">Join Admetos</Button></Link>
          </>
        )}
      </div>
    </div>
  )
}
