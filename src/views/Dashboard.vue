<template>
  <div class="space-y-6">
    <!-- Notification Permission Banner -->
    <NotificationPermissionBanner />
    
    <!-- Loading State -->
    <div v-if="store.apiData.loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-400">Loading dashboard data...</span>
    </div>

    <!-- Error State -->
    <div v-if="store.apiData.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">API Error</h3>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ store.apiData.error }}</p>
          <div class="mt-3 flex space-x-2">
            <button 
              @click="retryLogin"
              class="text-sm bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              Go to Login
            </button>
            <button 
              @click="store.loadDashboard()"
              class="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl card-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Package class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deliveries</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.stats.totalDeliveries }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl card-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
            <UserCheck class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Deliverymen</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.stats.activeDeliverymen }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl card-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Users class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.stats.totalCustomers }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl card-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
            <Clock class="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.stats.pendingDeliveries }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl card-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <CheckCircle class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Today</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ store.stats.completedToday }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl card-shadow">
        <div class="flex items-center">
          <div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <DollarSign class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ store.stats.revenue.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Deliveries -->
      <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Deliveries</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div 
              v-for="delivery in displayDeliveries" 
              :key="delivery.id"
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Package class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ delivery.tracking_number }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ delivery.customer ? delivery.customer.name : '' }} {{ delivery.customer ? delivery.customer.mobile_no : ''  }}</p>
                </div>
              </div>
              <div class="text-right">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusColor(delivery.status)"
                >
                  {{ delivery.status }}
                </span>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${{ delivery.amount }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div 
              v-for="activity in displayActivity" 
              :key="activity.id || activity.message"
              class="flex items-start space-x-3"
            >
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <component :is="getActivityIcon(activity.type || activity.action)" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900 dark:text-white">{{ activity.description || activity.message }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatTime(activity.created_at) || activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Performers -->
    <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Deliverymen</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="performer in displayTopPerformers" 
            :key="performer.id"
            class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User class="h-8 w-8 text-white" />
            </div>
            <h4 class="font-semibold text-gray-900 dark:text-white">{{ performer.name }}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {{ performer.delivered_deliveries || performer.totalDeliveries || 0 }} deliveries
            </p>
            <div class="flex items-center justify-center space-x-1 mb-2">
              <Star class="h-4 w-4 text-yellow-400 fill-current" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ performer.on_time_rate || performer.rating || 0 }}{{ performer.on_time_rate !== undefined ? '%' : '' }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ performer.mobile_no || performer.phone || 'N/A' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDashboardStore } from '../stores/dashboard'
import NotificationPermissionBanner from '../components/NotificationPermissionBanner.vue'
import { 
  Package, 
  UserCheck, 
  Users, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  User, 
  Star,
  Truck
} from 'lucide-vue-next'
import { onMounted, computed } from 'vue'

export default {
  name: 'Dashboard',
  components: {
    NotificationPermissionBanner,
    Package,
    UserCheck,
    Users,
    Clock,
    CheckCircle,
    DollarSign,
    User,
    Star,
    Truck
  },
  setup() {
    const store = useDashboardStore()
    
    const displayDeliveries = computed(() => {
      if (store.apiData.recentDeliveries.length > 0) {
        return store.apiData.recentDeliveries.slice(0, 5)
      }
      return store.deliveries.slice(0, 5)
    })
    
    const displayActivity = computed(() => {
      if (store.apiData.recentActivity.length > 0) {
        return store.apiData.recentActivity.slice(0, 5)
      }
      return store.recentActivity.slice(0, 5)
    })
    
    const displayTopPerformers = computed(() => {
      if (store.apiData.topPerformers.length > 0) {
        return store.apiData.topPerformers.slice(0, 3)
      }
      return store.deliverymen.slice(0, 3)
    })
    
    onMounted(() => {
      // Debug: Check token
      const token = localStorage.getItem('access_token')
      console.log('Token exists:', !!token)
      if (token) {
        console.log('Token preview:', token.substring(0, 20) + '...')
      }
      
      // Try to load dashboard data from API, but don't break if it fails
      store.loadDashboard().catch(console.error)
    })
    
    return { 
      store, 
      displayDeliveries,
      displayActivity,
      displayTopPerformers
    }
  },
  methods: {
    getStatusColor(status) {
      const colors = {
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'assigned': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'in-transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'in_progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }
      return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    getActivityIcon(type) {
      const icons = {
        'delivery': 'Package',
        'customer': 'Users',
        'deliveryman': 'UserCheck',
        'delivery_man_linked': 'UserCheck',
        'delivery_man_assigned': 'UserCheck'
      }
      return icons[type] || 'Package'
    },
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      
      if (diffInMinutes < 60) {
        return `${diffInMinutes} min ago`
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)} hours ago`
      } else {
        return `${Math.floor(diffInMinutes / 1440)} days ago`
      }
    },
    retryLogin() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>