'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function KeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) return

      const isMac = navigator.platform.includes('Mac')
      const mod = isMac ? e.metaKey : e.ctrlKey

      if (mod) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault()
            router.push('/send')
            break
          case 'r':
            if (!e.shiftKey) { e.preventDefault(); router.push('/request') }
            break
          case 'b':
            e.preventDefault()
            router.push('/bridge')
            break
          case 'e':
            e.preventDefault()
            router.push('/explore')
            break
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router])

  return null
}
