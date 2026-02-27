<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CommentItem from './CommentItem.vue'

const { t, locale, n } = useI18n()

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

const formatNumber = (value) => {
  return new Intl.NumberFormat(locale.value).format(value)
}

const formattedCommentsCount = computed(() => {
  const count = props.comments.length
  return t('post.commentsCount', count, { count: formatNumber(count) })
})
</script>

<template>
  <section class="stack">
    <header class="section-header">
      <h2>{{ t('post.conversation') }}</h2>
      <p>{{ formattedCommentsCount }}</p>
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
