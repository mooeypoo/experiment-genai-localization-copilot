<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const getPronounWord = (pronouns) => {
  const map = {
    'she/her': t('user.pronounsOptions.sheHer'),
    'he/him': t('user.pronounsOptions.heHim'),
    'they/them': t('user.pronounsOptions.theyThem'),
    'any': t('user.pronounsOptions.any')
  }
  return map[pronouns] || t('user.pronounsOptions.theyThem')
}

const activityText = computed(() => {
  if (!props.user.pronouns) return ''
  return t('profile.viewActivity', { pronoun: getPronounWord(props.user.pronouns) })
})
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
      {{ activityText }}
    </p>
  </article>
</template>
