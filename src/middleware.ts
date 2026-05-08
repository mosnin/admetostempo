import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['en','zh','es','hi','ar','bn','pt','ru','ja','pa','de','fr','ko','tr','vi','id']
const DEFAULT_LOCALE = 'en'

// Map of country codes to preferred language
const COUNTRY_TO_LOCALE: Record<string, string> = {
  CN: 'zh', TW: 'zh', HK: 'zh',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es', CL: 'es',
  IN: 'hi',
  SA: 'ar', AE: 'ar', EG: 'ar', JO: 'ar', IQ: 'ar', MA: 'ar',
  BD: 'bn',
  BR: 'pt', PT: 'pt',
  RU: 'ru', BY: 'ru',
  JP: 'ja',
  DE: 'de', AT: 'de', CH: 'de',
  FR: 'fr', BE: 'fr',
  KR: 'ko',
  TR: 'tr',
  VN: 'vi',
  ID: 'id',
  PK: 'pa',
}

function detectLocale(req: NextRequest): string {
  // 1. Check cookie preference
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) return cookieLocale

  // 2. Use Vercel/Cloudflare geo header (country code)
  const country = req.headers.get('x-vercel-ip-country') ||
                  req.headers.get('cf-ipcountry') ||
                  req.headers.get('x-country-code')
  if (country && COUNTRY_TO_LOCALE[country]) return COUNTRY_TO_LOCALE[country]

  // 3. Accept-Language header fallback
  const acceptLang = req.headers.get('accept-language') || ''
  for (const lang of acceptLang.split(',')) {
    const code = lang.trim().split(';')[0].split('-')[0].toLowerCase()
    if (SUPPORTED_LOCALES.includes(code)) return code
  }

  return DEFAULT_LOCALE
}

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/explore(.*)',
  '/api/webhook(.*)',
  '/api/agent(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Detect locale and set header for next-intl
  const locale = detectLocale(req)
  const response = NextResponse.next({
    headers: { 'x-detected-locale': locale },
  })

  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  return response
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
