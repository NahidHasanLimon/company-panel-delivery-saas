import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import Deliverymen from '../views/Deliverymen.vue'
import DeliveryInvitations from '../views/DeliveryInvitations.vue'
import Items from '../views/Items.vue'
import Customers from '../views/Customers.vue'
import Deliveries from '../views/Deliveries.vue'
import CreateDelivery from '../views/CreateDelivery.vue'
import Orders from '../views/Orders.vue'
import CreateOrder from '../views/CreateOrder.vue'
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
        path: '/delivery-invitations',
        name: 'DeliveryInvitations',
        component: DeliveryInvitations
      },
      {
        path: '/items',
        name: 'Items',
        component: Items
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
        path: '/orders',
        name: 'Orders',
        component: Orders
      },
      {
        path: '/orders/create',
        name: 'CreateOrder',
        component: CreateOrder
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
