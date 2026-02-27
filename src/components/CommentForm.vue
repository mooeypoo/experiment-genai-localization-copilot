<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useViewingUser } from '../composables/useViewingUser'
import { validateComment } from '../data/store'

const { t } = useI18n()
const emit = defineEmits(['submit', 'error'])

const { viewingUserId } = useViewingUser()
const body = ref('')
const errorMessage = ref('')

const handleSubmit = () => {
  errorMessage.value = ''
  
  const error = validateComment(body.value, viewingUserId.value)
  if (error) {
    errorMessage.value = t(error)
    emit('error', error)
    return
  }
  
  emit('submit', {
    authorId: viewingUserId.value,
    body: body.value.trim()
  })
  body.value = ''
}
</script>

<template>
  <section class="card form-card">
    <header class="section-header">
      <h2>{{ t('comment.addTitle') }}</h2>
      <p>{{ t('comment.addSubtitle') }}</p>
    </header>
    <form class="form" @submit.prevent="handleSubmit">
      <label class="form-field">
        <span>{{ t('comment.messageLabel') }}</span>
        <textarea v-model="body" rows="4" :placeholder="t('comment.messagePlaceholder')" required></textarea>
      </label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" class="btn">{{ t('comment.submitButton') }}</button>
    </form>
  </section>
</template>
