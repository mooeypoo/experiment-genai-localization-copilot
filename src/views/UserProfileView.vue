<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getUser } from '../data/store'
import UserProfileCard from '../components/UserProfileCard.vue'

const { t } = useI18n()
const route = useRoute()

const user = computed(() => getUser(route.params.id))
</script>

<template>
  <section class="view">
    <UserProfileCard v-if="user" :user="user" />
    <p v-else class="empty-state">{{ t('profile.notFound') }}</p>
  </section>
</template>
