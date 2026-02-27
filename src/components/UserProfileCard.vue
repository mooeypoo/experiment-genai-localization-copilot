<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const getPronounReference = (pronouns) => {
  const map = {
    'she/her': 'her',
    'he/him': 'his',
    'they/them': 'their',
    'any': 'their'
  }
  return map[pronouns] || 'their'
}
</script>

<template>
  <article class="card profile-card">
    <div class="profile-header">
      <img class="avatar avatar-lg" :src="user.avatar" :alt="`${user.name} avatar`" />
      <div>
        <p class="profile-name">{{ user.name }}</p>
        <p class="profile-handle">@{{ user.handle }}</p>
        <p v-if="user.pronouns" class="profile-pronouns">{{ user.pronouns }}</p>
      </div>
    </div>
    <p class="profile-bio">{{ user.bio }}</p>
    <p v-if="user.pronouns" class="profile-reference">
      {{ t(`profile.viewActivity.${getPronounReference(user.pronouns)}`) }}
    </p>
  </article>
</template>
