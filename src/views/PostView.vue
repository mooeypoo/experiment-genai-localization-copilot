<script setup>
import { onMounted, ref } from 'vue'
import { getPost, getUser, getUsers, getComments, createComment } from '../data/store'
import PostCard from '../components/PostCard.vue'
import CommentList from '../components/CommentList.vue'
import CommentForm from '../components/CommentForm.vue'

const postId = 'p1'

const post = ref(null)
const author = ref(null)
const users = ref([])
const comments = ref([])

const loadData = () => {
  post.value = getPost(postId)
  author.value = post.value ? getUser(post.value.authorId) : null
  users.value = getUsers()
  comments.value = getComments(postId)
}

const handleCommentSubmit = ({ authorId, body }) => {
  try {
    createComment({
      postId,
      authorId,
      body
    })
    comments.value = getComments(postId)
  } catch (error) {
    console.error('Failed to create comment:', error.message)
  }
}

onMounted(loadData)
</script>

<template>
  <section class="view">
    <PostCard v-if="post" :post="post" :author="author" />
    <CommentForm @submit="handleCommentSubmit" />
    <CommentList :comments="comments" :users="users" />
  </section>
</template>
