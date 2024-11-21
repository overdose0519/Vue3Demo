import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/controller',
    component: Home,
    children: [
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/pages/login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
