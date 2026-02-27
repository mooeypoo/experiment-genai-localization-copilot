<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['submit'])

const authorId = ref('')
const body = ref('')

watch(
  () => props.users,
  (next) => {
    if (!authorId.value && next.length) {
      authorId.value = next[0].id
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  const trimmed = body.value.trim()
  if (!trimmed || !authorId.value) {
    return
  }
  emit('submit', {
    authorId: authorId.value,
    body: trimmed
  })
  body.value = ''
}
</script>

<template>
  <section class="card form-card">
    <header class="section-header">
      <h2>Add a comment</h2>
      <p>Write as one of the seeded users.</p>
    </header>
    <form class="form" @submit.prevent="handleSubmit">
      <label class="form-field">
        <span>Author</span>
        <select v-model="authorId" required>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }} · @{{ user.handle }}
          </option>
        </select>
      </label>
      <label class="form-field">
        <span>Message</span>
        <textarea v-model="body" rows="4" placeholder="Share a thought..." required></textarea>
      </label>
      <button type="submit" class="btn">Post comment</button>
    </form>
  </section>
</template>
