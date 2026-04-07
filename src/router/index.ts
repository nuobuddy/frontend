import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './auth'
import chatRoutes from './chat'
import adminRoutes from './admin'
import userRoutes from './user'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/chat',
    },
    ...authRoutes,
    ...chatRoutes,
    ...adminRoutes,
    ...userRoutes,
  ],
})

// Navigation guard for authentication and authorization
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // Guest routes (login, register, forgot-password) - redirect if already authenticated
  if (to.meta.guest && authStore.isAuthenticated) {
    return next('/chat')
  }

  // Protected routes - redirect to login if not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Exception: allow shared access to chat sessions without auth
    if (to.meta.allowShare && to.query.share === '1') {
      return next()
    }
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  // Admin routes - check role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/chat')
  }

  next()
})

export default router
