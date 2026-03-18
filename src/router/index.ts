import { createRouter, createWebHistory } from 'vue-router'
import chatRoutes from './chat'
import adminRoutes from './admin'
import userRoutes from './user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/chat',
    },
    ...chatRoutes,
    ...adminRoutes,
    ...userRoutes,
  ],
})

export default router
