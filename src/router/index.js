import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Deliverymen from '../views/Deliverymen.vue'
import Customers from '../views/Customers.vue'
import Deliveries from '../views/Deliveries.vue'
import CreateDelivery from '../views/CreateDelivery.vue'
import Analytics from '../views/Analytics.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: '/deliverymen',
        name: 'Deliverymen',
        component: Deliverymen
      },
      {
        path: '/customers',
        name: 'Customers',
        component: Customers
      },
      {
        path: '/deliveries',
        name: 'Deliveries',
        component: Deliveries
      },
      {
        path: '/deliveries/create',
        name: 'CreateDelivery',
        component: CreateDelivery
      },
      {
        path: '/analytics',
        name: 'Analytics',
        component: Analytics
      },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for auth
router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('access_token')

  if (authRequired && !loggedIn) {
    return next('/login')
  }
  if (to.path === '/login' && loggedIn) {
    return next('/')
  }
  next()
})

export default router