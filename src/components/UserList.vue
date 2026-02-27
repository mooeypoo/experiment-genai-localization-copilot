<script setup>
import { RouterLink } from 'vue-router'
import UserCard from './UserCard.vue'

const props = defineProps({
  users: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <section class="stack">
    <header class="section-header">
      <h2>Community</h2>
      <p>{{ users.length }} people in the room</p>
    </header>
    <div class="grid">
      <RouterLink
        v-for="user in users"
        :key="user.id"
        class="user-link"
        :to="`/users/${user.id}`"
      >
        <UserCard :user="user" />
      </RouterLink>
    </div>
  </section>
</template>
