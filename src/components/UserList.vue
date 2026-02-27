<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import UserCard from './UserCard.vue'

const { t } = useI18n()

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
      <h2>{{ t('user.communityTitle') }}</h2>
      <p>{{ t('user.communityCount', props.users.length) }}</p>
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
