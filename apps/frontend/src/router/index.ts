import { createRouter, createWebHistory } from 'vue-router'
import CreateRoom from '../views/createRoom.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CreateRoom,
    },
  ],
})

export default router
