<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

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

const formattedDate = computed(() => {
  if (!props.comment.createdAt) return ''
  const date = new Date(props.comment.createdAt)
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
})
</script>

<template>
  <article class="card comment-card">
    <div class="comment-header">
      <div>
        <p class="comment-author">
          <span v-if="author">
            {{ author.name }} · @{{ author.handle }}
            <span v-if="author.pronouns" class="comment-pronouns">({{ author.pronouns }})</span>
          </span>
          <span v-else>{{ t('comment.unknownAuthor') }}</span>
        </p>
        <p class="comment-date">{{ formattedDate }}</p>
      </div>
    </div>
    <p class="comment-body">{{ comment.body }}</p>
  </article>
</template>
