'use client'
import { useState } from 'react'
import { Globe } from 'lucide-react'
import { SUPPORTED_LOCALES } from '@/lib/i18n/locales'

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false)

  function setLocale(code: string) {
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-lavender-700 hover:bg-lavender-50">
        <Globe size={16} />
        <span className="text-sm">Language</span>
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-0 glass rounded-2xl shadow-pastel-lg p-2 min-w-48 max-h-64 overflow-y-auto z-50">
          {SUPPORTED_LOCALES.map(locale => (
            <button key={locale.code} onClick={() => setLocale(locale.code)}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-lavender-50 text-sm flex items-center justify-between">
              <span>{locale.nativeName}</span>
              <span className="text-lavender-400 text-xs">{locale.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
