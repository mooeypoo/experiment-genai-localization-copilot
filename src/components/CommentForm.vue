<script setup>
import { ref } from 'vue'
import { useViewingUser } from '../composables/useViewingUser'
import { validateComment } from '../data/store'

const emit = defineEmits(['submit', 'error'])

const { viewingUserId } = useViewingUser()
const body = ref('')
const errorMessage = ref('')

const handleSubmit = () => {
  errorMessage.value = ''
  
  const error = validateComment(body.value, viewingUserId.value)
  if (error) {
    errorMessage.value = error
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
      <h2>Add a comment</h2>
      <p>Write as the selected viewing user.</p>
    </header>
    <form class="form" @submit.prevent="handleSubmit">
      <label class="form-field">
        <span>Message</span>
        <textarea v-model="body" rows="4" placeholder="Share a thought..." required></textarea>
      </label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" class="btn">Post comment</button>
    </form>
  </section>
</template>
