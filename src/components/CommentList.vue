<script setup>
import { computed } from 'vue'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  comments: {
    type: Array,
    required: true
  },
  users: {
    type: Array,
    required: true
  }
})

const userMap = computed(() => {
  const map = new Map()
  props.users.forEach((user) => map.set(user.id, user))
  return map
})

const resolveAuthor = (comment) => userMap.value.get(comment.authorId) || null
</script>

<template>
  <section class="stack">
    <header class="section-header">
      <h2>Conversation</h2>
      <p>{{ comments.length }} comments</p>
    </header>
    <div v-if="comments.length" class="stack">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :author="resolveAuthor(comment)"
      />
    </div>
    <p v-else class="empty-state">No comments yet. Be the first to add one.</p>
  </section>
</template>
