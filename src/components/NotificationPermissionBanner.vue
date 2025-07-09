<template>
  <div v-if="!notificationStore.canShowNotifications" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0">
        <Bell class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">Enable Notifications</h3>
        <p class="text-sm text-blue-700 dark:text-blue-300 mt-1">
          Get real-time updates about deliveries, assignments, and important events.
        </p>
        <div class="mt-3">
          <button 
            @click="requestPermission"
            :disabled="loading"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Bell class="h-4 w-4 mr-2" />
            {{ loading ? 'Enabling...' : 'Enable Notifications' }}
          </button>
        </div>
      </div>
      <button 
        @click="dismiss"
        class="flex-shrink-0 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script>
import { Bell, X } from 'lucide-vue-next'
import { useNotificationStore } from '../stores/notification'

export default {
  name: 'NotificationPermissionBanner',
  components: {
    Bell,
    X
  },
  setup() {
    const notificationStore = useNotificationStore()
    return { notificationStore }
  },
  data() {
    return {
      loading: false,
      dismissed: false
    }
  },
  methods: {
    async requestPermission() {
      if (this.loading) return
      
      this.loading = true
      try {
        await this.notificationStore.requestPermission()
        console.log('Notification permission granted')
      } catch (error) {
        console.error('Failed to request notification permission:', error)
        alert('Failed to enable notifications. Please check your browser settings.')
      } finally {
        this.loading = false
      }
    },
    dismiss() {
      this.dismissed = true
      // Save dismissed state to localStorage
      localStorage.setItem('notificationBannerDismissed', 'true')
    }
  },
  mounted() {
    // Check if banner was previously dismissed
    this.dismissed = localStorage.getItem('notificationBannerDismissed') === 'true'
  }
}
</script>
