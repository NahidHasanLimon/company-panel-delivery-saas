<template>
  <div class="space-y-6">
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
              v-for="delivery in store.deliveries.slice(0, 5)" 
              :key="delivery.id"
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Package class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ delivery.id }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ delivery.customerName }}</p>
                </div>
              </div>
              <div class="text-right">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusColor(delivery.status)"
                >
                  {{ delivery.status }}
                </span>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${{ delivery.orderValue }}</p>
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
              v-for="activity in store.recentActivity" 
              :key="activity.message"
              class="flex items-start space-x-3"
            >
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900 dark:text-white">{{ activity.message }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ activity.time }}</p>
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
            v-for="deliveryman in store.deliverymen.slice(0, 3)" 
            :key="deliveryman.id"
            class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User class="h-8 w-8 text-white" />
            </div>
            <h4 class="font-semibold text-gray-900 dark:text-white">{{ deliveryman.name }}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ deliveryman.totalDeliveries }} deliveries</p>
            <div class="flex items-center justify-center space-x-1">
              <Star class="h-4 w-4 text-yellow-400 fill-current" />
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ deliveryman.rating }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDashboardStore } from '../stores/dashboard'
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

export default {
  name: 'Dashboard',
  components: {
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
    return { store }
  },
  methods: {
    getStatusColor(status) {
      const colors = {
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'assigned': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'in-transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }
      return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    getActivityIcon(type) {
      const icons = {
        'delivery': 'Package',
        'customer': 'Users',
        'deliveryman': 'UserCheck'
      }
      return icons[type] || 'Package'
    }
  }
}
</script>