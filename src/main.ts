import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/global.scss'

const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
})
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
