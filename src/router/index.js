import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/note-edit',
    name: 'NoteEdit',
    component: () => import('@/views/NoteEdit.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router