<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="card profile-card">
    <div class="profile-header">
      <img class="avatar avatar-lg" :src="user.avatar" :alt="`${user.name} avatar`" />
      <div>
        <p class="profile-name">{{ user.name }}</p>
        <p class="profile-handle">@{{ user.handle }}</p>
      </div>
    </div>
    <p class="profile-bio">{{ user.bio }}</p>
  </article>
</template>
