<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getUser } from '../data/store'
import UserProfileCard from '../components/UserProfileCard.vue'

const route = useRoute()

const user = computed(() => getUser(route.params.id))
</script>

<template>
  <section class="view">
    <UserProfileCard v-if="user" :user="user" />
    <p v-else class="empty-state">We could not find that profile.</p>
  </section>
</template>
