<script setup>
import { RouterView } from 'vue-router'
import HeaderBar from './components/HeaderBar.vue'
</script>

<template>
  <div class="app">
    <HeaderBar />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
