<script setup>
import { ref } from 'vue'
import { validateUser } from '../data/store'

const emit = defineEmits(['submit', 'error'])

const name = ref('')
const bio = ref('')
const errorMessage = ref('')

const handleSubmit = () => {
  errorMessage.value = ''
  
  const error = validateUser(name.value, bio.value)
  if (error) {
    errorMessage.value = error
    emit('error', error)
    return
  }
  
  emit('submit', {
    name: name.value.trim(),
    bio: bio.value.trim()
  })
  name.value = ''
  bio.value = ''
}
</script>

<template>
  <section class="card form-card">
    <header class="section-header">
      <h2>Create a user</h2>
      <p>Add a new voice to the demo feed.</p>
    </header>
    <form class="form" @submit.prevent="handleSubmit">
      <label class="form-field">
        <span>Display name</span>
        <input v-model="name" type="text" placeholder="Full name" required />
      </label>
      <label class="form-field">
        <span>Bio (optional)</span>
        <textarea v-model="bio" rows="3" placeholder="Short bio"></textarea>
      </label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" class="btn">Create user</button>
    </form>
  </section>
</template>
