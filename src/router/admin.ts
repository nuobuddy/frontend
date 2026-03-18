import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/dashBoard.vue'),
    meta: {
      title: 'Admin',
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
]

export default adminRoutes
