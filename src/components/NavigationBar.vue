<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <nav class="nav-bar">
    <RouterLink to="/">{{ t('app.nav.post') }}</RouterLink>
    <RouterLink to="/users">{{ t('app.nav.users') }}</RouterLink>
  </nav>
</template>
