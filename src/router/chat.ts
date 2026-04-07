import type { RouteRecordRaw } from 'vue-router'

const chatRoutes: RouteRecordRaw[] = [
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/chat/chatPage.vue'),
    meta: {
      title: 'Chat',
      requiresAuth: true,
    },
  },
  {
    path: '/chat/:id',
    name: 'ChatSession',
    component: () => import('@/views/chat/chatPage.vue'),
    meta: {
      title: 'Chat Session',
      requiresAuth: true,
      allowShare: true, // Allow shared access without auth via ?share=1
    },
  },
  {
    path: '/chat/settings',
    name: 'ChatSettings',
    component: () => import('@/views/chat/chatSettings.vue'),
    meta: {
      title: 'Chat Settings',
      requiresAuth: true,
    },
  },
]

export default chatRoutes
