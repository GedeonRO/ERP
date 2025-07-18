import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
        },
        {
          path: '/clients',
          name: 'clients',
          component: () => import('@/views/sales/ClientsView.vue'),
        },
        {
          path: '/clients',
          name: 'clients',
          component: () => import('@/views/sales/ClientsView.vue'),
        },
        {
          path: '/clients/:id',
          name: 'client-detail',
          component: () => import('@/views/sales/ClientDetailView.vue'),
        },
        {
          path: '/quotes',
          name: 'quotes',
          component: () => import('@/views/sales/QuotesView.vue'),
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('@/views/sales/OrdersView.vue'),
        },
        {
          path: '/invoices',
          name: 'invoices',
          component: () => import('@/views/sales/InvoicesView.vue'),
        },
        {
          path: '/suppliers',
          name: 'suppliers',
          component: () => import('@/views/sales/SuppliersView.vue'),
        },
      ],
    },
  ],
})
/* 
// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
}) */

export default router
