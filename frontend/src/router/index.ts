import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/chat', name: 'AIChat', component: () => import('../views/AIChat.vue') },
  { path: '/agent/:id', name: 'AgentDetail', component: () => import('../views/AgentDetail.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

export default router
