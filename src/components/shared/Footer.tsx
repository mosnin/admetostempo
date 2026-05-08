import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-16 pb-8 text-center">
      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400 mb-3">admetos</div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400 mb-4">
        <Link href="/about" className="hover:text-violet-500 transition-colors">About</Link>
        <Link href="/help" className="hover:text-violet-500 transition-colors">Help</Link>
        <Link href="/terms" className="hover:text-violet-500 transition-colors">Terms</Link>
        <Link href="/privacy" className="hover:text-violet-500 transition-colors">Privacy</Link>
        <a href="mailto:support@admetos.xyz" className="hover:text-violet-500 transition-colors">Contact</a>
      </div>
      <p className="text-xs text-gray-300">© 2025 Admetos · Built on Tempo blockchain · v0.1.0</p>
    </footer>
  )
}
