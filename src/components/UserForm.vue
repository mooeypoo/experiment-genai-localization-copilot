<script setup>
import { ref, computed } from 'vue'
import { validateUser } from '../data/store'

const emit = defineEmits(['submit', 'error'])

const BIO_MAX_LENGTH = 160

const name = ref('')
const pronouns = ref('they/them')
const bio = ref('')
const errorMessage = ref('')

const bioLength = computed(() => bio.value.length)
const bioRemaining = computed(() => BIO_MAX_LENGTH - bioLength.value)
const bioCounterClass = computed(() => {
  if (bioLength.value > BIO_MAX_LENGTH) return 'char-counter--over'
  if (bioLength.value >= BIO_MAX_LENGTH - 20) return 'char-counter--warning'
  return ''
})

const handleSubmit = () => {
  errorMessage.value = ''
  
  const error = validateUser(name.value, bio.value, pronouns.value)
  if (error) {
    errorMessage.value = error
    emit('error', error)
    return
  }
  
  emit('submit', {
    name: name.value.trim(),
    pronouns: pronouns.value,
    bio: bio.value.trim()
  })
  name.value = ''
  pronouns.value = 'they/them'
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
        <span>Pronouns</span>
        <select v-model="pronouns" required>
          <option value="she/her">she/her</option>
          <option value="he/him">he/him</option>
          <option value="they/them">they/them</option>
          <option value="any">any pronouns</option>
        </select>
      </label>
      <label class="form-field">
        <span>Bio (optional)</span>
        <textarea 
          v-model="bio" 
          rows="3" 
          placeholder="Short bio"
          :maxlength="BIO_MAX_LENGTH"
        ></textarea>
        <span class="char-counter" :class="bioCounterClass">
          {{ bioLength }} / {{ BIO_MAX_LENGTH }}
          <span v-if="bioRemaining < 0" class="char-counter-hint"> ({{ Math.abs(bioRemaining) }} over)</span>
          <span v-else-if="bioRemaining <= 20" class="char-counter-hint"> ({{ bioRemaining }} remaining)</span>
        </span>
      </label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" class="btn">Create user</button>
    </form>
  </section>
</template>
