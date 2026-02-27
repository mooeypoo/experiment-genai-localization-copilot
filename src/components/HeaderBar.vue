<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import NavigationBar from './NavigationBar.vue'
import ViewingAsSelector from './ViewingAsSelector.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <header class="app-header">
    <div class="nav-brand">
      <p class="nav-kicker">{{ t('app.brand.kicker') }}</p>
      <h1 class="nav-title">{{ t('app.brand.title') }}</h1>
      <p class="nav-subtitle">{{ t('app.brand.subtitle') }}</p>
    </div>
    <div class="header-actions">
      <LanguageSwitcher />
      <ViewingAsSelector v-if="users.length" :users="users" />
      <NavigationBar />
    </div>
  </header>
</template>
