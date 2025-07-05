<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
      <p class="text-gray-600 dark:text-gray-400">Performance insights and reports</p>
    </div>

    <!-- Key Metrics Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl card-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Delivery Success Rate</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">94.2%</p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <CheckCircle class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl card-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Average Delivery Time</p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">32 min</p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Clock class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl card-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Satisfaction</p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">4.7/5</p>
          </div>
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Star class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl card-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Deliverymen</p>
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ store.stats.activeDeliverymen }}</p>
          </div>
          <div class="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
            <UserCheck class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Deliveryman Performance</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Deliveries</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Success Rate</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avg. Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="deliveryman in store.deliverymen" :key="deliveryman.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User class="h-4 w-4 text-white" />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ deliveryman.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ deliveryman.totalDeliveries }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ Math.floor(Math.random() * 10) + 90 }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ Math.floor(Math.random() * 20) + 25 }} min
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Star class="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span class="text-sm text-gray-900 dark:text-white">{{ deliveryman.rating }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="deliveryman.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                >
                  {{ deliveryman.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { useDashboardStore } from '../stores/dashboard'
import { CheckCircle, Clock, Star, UserCheck, User } from 'lucide-vue-next'

export default {
  name: 'Analytics',
  components: {
    CheckCircle,
    Clock,
    Star,
    UserCheck,
    User
  },
  setup() {
    const store = useDashboardStore()
    return { store }
  }
}
</script>