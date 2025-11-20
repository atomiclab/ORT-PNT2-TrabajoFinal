import { createI18n } from 'vue-i18n'
import es from './es.js'
import en from './en.js'

// Función para obtener el idioma preferido del usuario
function getDefaultLocale() {
  // Primero intentar obtener desde localStorage
  const saved = localStorage.getItem('user-locale')
  if (saved) {
    return saved
  }
  
  // Después intentar obtener del navegador
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang.startsWith('en')) {
    return 'en'
  }
  
  // Por defecto español
  return 'en'
}

// Configuración de i18n
const i18n = createI18n({
  legacy: false, // Usar Composition API
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    es,
    en
  }
})

// Función para cambiar idioma
export function setLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('user-locale', locale)
  document.documentElement.lang = locale
}

// Función para obtener idioma actual
export function getCurrentLocale() {
  return i18n.global.locale.value
}

// Idiomas disponibles
export const availableLocales = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

export default i18n