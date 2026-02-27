<script setup>
import { onMounted, ref } from 'vue'
import { getUsers, createUser } from '../data/store'
import UserForm from '../components/UserForm.vue'
import UserList from '../components/UserList.vue'

const users = ref([])

const loadData = () => {
  users.value = getUsers()
}

const handleCreateUser = (payload) => {
  createUser(payload)
  loadData()
}

onMounted(loadData)
</script>

<template>
  <section class="view">
    <UserForm @submit="handleCreateUser" />
    <UserList :users="users" />
  </section>
</template>
