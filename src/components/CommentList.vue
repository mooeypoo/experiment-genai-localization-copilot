<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CommentItem from './CommentItem.vue'

const { t } = useI18n()

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
      <h2>{{ t('post.conversation') }}</h2>
      <p>{{ t('post.commentsCount', props.comments.length) }}</p>
    </header>
    <div v-if="comments.length" class="stack">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :author="resolveAuthor(comment)"
      />
    </div>
    <p v-else class="empty-state">{{ t('post.noComments') }}</p>
  </section>
</template>
