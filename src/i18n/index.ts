import { createI18n } from 'vue-i18n'

import en from '@/locales/en'
import zhCN from '@/locales/zh-CN'

export const SUPPORTED_LOCALES = ['zh-CN', 'en'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_STORAGE_KEY = 'nuobuddy-locale'

/**
 * Determine the initial locale based on:
 * 1. User's saved preference in localStorage
 * 2. Browser/system language
 * 3. Default to 'zh-CN'
 */
function getInitialLocale(): SupportedLocale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
    return stored as SupportedLocale
  }

  const browserLang = navigator.language

  if (SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale
  }

  // Match by language prefix, e.g. 'zh-HK' -> 'zh-CN', 'en-US' -> 'en'
  const prefix = browserLang.split('-')[0] ?? ''
  const matched = SUPPORTED_LOCALES.find((l) => prefix !== '' && l.startsWith(prefix))
  if (matched) return matched

  return 'zh-CN'
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    en,
  },
})
