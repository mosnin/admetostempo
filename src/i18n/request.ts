import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'

const SUPPORTED_LOCALES = ['en','zh','es','hi','ar','bn','pt','ru','ja','pa','de','fr','ko','tr','vi','id']

export default getRequestConfig(async () => {
  const headersList = await headers()
  const detectedLocale = headersList.get('x-detected-locale') || 'en'
  const locale = SUPPORTED_LOCALES.includes(detectedLocale) ? detectedLocale : 'en'

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default,
  }
})
