<template>
  <button
    class="language-toggle-button"
    @click="toggleLanguage"
    :title="$t('common.selectLanguage')"
  >
    <span class="flag">{{ nextLocale.flag }}</span>
  </button>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, availableLocales } from '../locales'

export default {
  name: 'LanguageSelector',
  setup() {
    const { locale } = useI18n()

    const currentLocale = computed(() => {
      return availableLocales.find(l => l.code === locale.value) || availableLocales[0]
    })

    // El idioma que se mostrará al hacer clic (el otro idioma)
    const nextLocale = computed(() => {
      const current = currentLocale.value.code
      return availableLocales.find(l => l.code !== current) || availableLocales[0]
    })

    const toggleLanguage = () => {
      setLocale(nextLocale.value.code)
    }

    return {
      nextLocale,
      toggleLanguage
    }
  }
}
</script>

<style scoped>
.language-toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(13, 13, 13, 0.8);
  border: 2px solid #d4af37;
  border-radius: 50%;
  color: #d4af37;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  padding: 0;
}

.language-toggle-button:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: #f4d777;
  box-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
  transform: scale(1.05);
}

.language-toggle-button:active {
  transform: scale(0.95);
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
}

.flag {
  font-size: 1.1rem;
  line-height: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .language-toggle-button {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .flag {
    font-size: 1rem;
  }
}
</style>