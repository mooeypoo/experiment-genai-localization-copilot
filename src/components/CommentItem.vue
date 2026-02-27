<script setup>
const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  author: {
    type: Object,
    default: null
  }
})

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}
</script>

<template>
  <article class="card comment-card">
    <div class="comment-header">
      <div>
        <p class="comment-author">
          <span v-if="author">{{ author.name }} · @{{ author.handle }}</span>
          <span v-else>Unknown author</span>
        </p>
        <p class="comment-date">{{ formatDate(comment.createdAt) }}</p>
      </div>
    </div>
    <p class="comment-body">{{ comment.body }}</p>
  </article>
</template>
