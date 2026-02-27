<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const name = ref('')
const handle = ref('')
const bio = ref('')
const location = ref('')

const handleSubmit = () => {
  const trimmedName = name.value.trim()
  const trimmedHandle = handle.value.trim()
  if (!trimmedName || !trimmedHandle) {
    return
  }
  emit('submit', {
    name: trimmedName,
    handle: trimmedHandle,
    bio: bio.value.trim(),
    location: location.value.trim()
  })
  name.value = ''
  handle.value = ''
  bio.value = ''
  location.value = ''
}
</script>

<template>
  <section class="card form-card">
    <header class="section-header">
      <h2>Create a user</h2>
      <p>Add a new voice to the demo feed.</p>
    </header>
    <form class="form" @submit.prevent="handleSubmit">
      <div class="form-row">
        <label class="form-field">
          <span>Name</span>
          <input v-model="name" type="text" placeholder="Full name" required />
        </label>
        <label class="form-field">
          <span>Handle</span>
          <input v-model="handle" type="text" placeholder="shortname" required />
        </label>
      </div>
      <label class="form-field">
        <span>Bio</span>
        <textarea v-model="bio" rows="3" placeholder="Short bio"></textarea>
      </label>
      <label class="form-field">
        <span>Location</span>
        <input v-model="location" type="text" placeholder="City, Region" />
      </label>
      <button type="submit" class="btn">Create user</button>
    </form>
  </section>
</template>
