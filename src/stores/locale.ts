import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { i18n, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
  // Initialize from the i18n instance (which already resolved initial locale)
  const locale = ref<SupportedLocale>(i18n.global.locale.value as SupportedLocale)

  const availableLocales = computed(() =>
    SUPPORTED_LOCALES.map((l) => ({
      value: l,
      label: l === 'zh-CN' ? '简体中文' : 'English',
    })),
  )

  /**
   * Switch the application locale.
   * Persists the selection to localStorage so it is remembered on next visit.
   */
  function setLocale(newLocale: SupportedLocale): void {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return
    locale.value = newLocale
    // Keep vue-i18n in sync
    i18n.global.locale.value = newLocale as never
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  }

  return { locale, availableLocales, setLocale }
})
