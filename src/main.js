import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initializeData } from './data/store'

initializeData()

createApp(App).use(router).mount('#app')
