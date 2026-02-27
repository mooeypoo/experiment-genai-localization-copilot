import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import he from './locales/he.json'
import ar from './locales/ar.json'
import fa from './locales/fa.json'

const messages = {
  en,
  fr,
  es,
  he,
  ar,
  fa
}

const savedLocale = localStorage.getItem('locale') || 'en'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages
})

export const setLocale = (locale) => {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  updatePageDirection(locale)
}

export const getLocale = () => {
  return i18n.global.locale.value
}

export const isRTL = (locale = getLocale()) => {
  return ['he', 'ar', 'fa'].includes(locale)
}

export const updatePageDirection = (locale) => {
  const direction = isRTL(locale) ? 'rtl' : 'ltr'
  document.documentElement.dir = direction
  document.documentElement.lang = locale
}

// Set initial direction on load
updatePageDirection(savedLocale)
