<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="card user-card">
    <img class="avatar" :src="user.avatar" :alt="`${user.name} avatar`" />
    <div>
      <p class="user-name">{{ user.name }}</p>
      <p class="user-handle">@{{ user.handle }}</p>
      <p class="user-bio">{{ user.bio }}</p>
      <p v-if="user.location" class="user-location">{{ user.location }}</p>
    </div>
  </article>
</template>
