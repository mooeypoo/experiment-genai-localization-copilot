<script setup>
import { RouterView } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
</script>

<template>
  <div class="app">
    <NavigationBar />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
