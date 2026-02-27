<script setup>
const props = defineProps({
  post: {
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
  <article class="card post-card">
    <div class="post-header">
      <div>
        <p class="post-title">{{ post.title }}</p>
        <p class="post-meta">
          <span v-if="author">{{ author.name }} · @{{ author.handle }}</span>
          <span v-else>Unknown author</span>
          <span aria-hidden="true">·</span>
          <span>{{ formatDate(post.createdAt) }}</span>
        </p>
      </div>
      <div class="post-tagset">
        <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
      </div>
    </div>
    <p class="post-body">{{ post.body }}</p>
  </article>
</template>
