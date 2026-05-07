import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = 'en' // Will be replaced by IP detection in Phase 7
  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default,
  }
})
