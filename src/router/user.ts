import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user/homePage.vue'),
    meta: {
      title: 'User Profile',
      requiresAuth: true,
    },
  },
]

export default userRoutes
