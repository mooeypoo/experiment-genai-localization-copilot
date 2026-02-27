<script setup>
import { computed, watch } from 'vue'
import { useViewingUser } from '../composables/useViewingUser'

const props = defineProps({
  users: {
    type: Array,
    required: true
  }
})

const { viewingUserId, setViewingUser } = useViewingUser()

const selectedUser = computed({
  get: () => viewingUserId.value,
  set: (value) => setViewingUser(value)
})

const currentUser = computed(() => {
  return props.users.find((user) => user.id === viewingUserId.value)
})

watch(
  () => props.users,
  (next) => {
    if (!viewingUserId.value && next.length) {
      setViewingUser(next[0].id)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="viewing-selector">
    <label class="viewing-label">
      <span class="viewing-text">Viewing as</span>
      <select v-model="selectedUser" class="viewing-select">
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }} · @{{ user.handle }}
        </option>
      </select>
    </label>
    <div v-if="currentUser" class="viewing-avatar">
      <img :src="currentUser.avatar" :alt="`${currentUser.name} avatar`" />
    </div>
  </div>
</template>
