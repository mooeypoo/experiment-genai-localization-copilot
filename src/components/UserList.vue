<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import UserCard from './UserCard.vue'

const { t, locale } = useI18n()

const props = defineProps({
  users: {
    type: Array,
    required: true
  }
})

const sortedUsers = computed(() => {
  const collator = new Intl.Collator(locale.value, {
    sensitivity: 'base',
    numeric: true
  })
  return [...props.users].sort((a, b) => collator.compare(a.name, b.name))
})

const formatNumber = (value) => {
  return new Intl.NumberFormat(locale.value).format(value)
}

const formattedCommunityCount = computed(() => {
  const count = props.users.length
  return t('user.communityCount', count, { count: formatNumber(count) })
})
</script>

<template>
  <section class="stack">
    <header class="section-header">
      <h2>{{ t('user.communityTitle') }}</h2>
      <p>{{ formattedCommunityCount }}</p>
    </header>
    <div class="grid">
      <RouterLink
        v-for="user in sortedUsers"
        :key="user.id"
        class="user-link"
        :to="`/users/${user.id}`"
      >
        <UserCard :user="user" />
      </RouterLink>
    </div>
  </section>
</template>
