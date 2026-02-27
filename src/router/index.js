import { createRouter, createWebHashHistory } from 'vue-router'
import PostView from '../views/PostView.vue'
import UsersView from '../views/UsersView.vue'
import UserProfileView from '../views/UserProfileView.vue'

const routes = [
  {
    path: '/',
    name: 'post',
    component: PostView
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView
  },
  {
    path: '/users/:id',
    name: 'user-profile',
    component: UserProfileView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
