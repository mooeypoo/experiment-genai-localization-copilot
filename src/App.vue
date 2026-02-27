<script setup>
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import HeaderBar from './components/HeaderBar.vue'
import { getUsers } from './data/store'

const users = ref([])

onMounted(() => {
  users.value = getUsers()
})
</script>

<template>
  <div class="app">
    <HeaderBar :users="users" />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
