<script setup>
import NavigationBar from './NavigationBar.vue'
import ViewingAsSelector from './ViewingAsSelector.vue'

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
      <p class="nav-kicker">Signal</p>
      <h1 class="nav-title">Pulseboard</h1>
      <p class="nav-subtitle">A tiny social demo built for fast experiments.</p>
    </div>
    <div class="header-actions">
      <ViewingAsSelector v-if="users.length" :users="users" />
      <NavigationBar />
    </div>
  </header>
</template>
