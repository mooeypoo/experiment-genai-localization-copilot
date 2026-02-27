<script setup>
import { useI18n } from 'vue-i18n'
import { setLocale } from '../i18n'

const { locale } = useI18n()

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'he', name: 'עברית' },
  { code: 'ar', name: 'العربية' },
  { code: 'fa', name: 'فارسی' }
]

const handleChange = (event) => {
  setLocale(event.target.value)
}
</script>

<template>
  <div class="language-selector">
    <label class="language-label">
      <select :value="locale" @change="handleChange" class="language-select">
        <option v-for="lang in languages" :key="lang.code" :value="lang.code">
          {{ lang.name }}
        </option>
      </select>
    </label>
  </div>
</template>
