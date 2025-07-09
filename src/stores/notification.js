import { defineStore } from 'pinia'
import notificationService from '../services/notificationService'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    isSupported: false,
    permission: 'default',
    token: null,
    isInitialized: false,
    notifications: [],
    unreadCount: 0
  }),

  getters: {
    canShowNotifications: (state) => state.permission === 'granted' && state.isSupported,
    hasToken: (state) => !!state.token
  },

  actions: {
    async initialize() {
      if (this.isInitialized) return

      try {
        // Check if notifications are supported
        this.isSupported = 'Notification' in window && 'serviceWorker' in navigator

        if (!this.isSupported) {
          console.log('Push notifications are not supported')
          return false
        }

        // Get current permission status
        this.permission = Notification.permission

        // Initialize notification service
        const success = await notificationService.initialize()
        
        if (success) {
          this.token = notificationService.getToken()
          this.isInitialized = true
          console.log('Notification service initialized successfully')
        }

        return success
      } catch (error) {
        console.error('Failed to initialize notifications:', error)
        return false
      }
    },

    async requestPermission() {
      if (!this.isSupported) {
        throw new Error('Notifications are not supported')
      }

      try {
        const token = await notificationService.requestPermission()
        
        if (token) {
          this.token = token
          this.permission = 'granted'
          return token
        } else {
          this.permission = Notification.permission
          return null
        }
      } catch (error) {
        console.error('Failed to request notification permission:', error)
        throw error
      }
    },

    addNotification(notification) {
      const newNotification = {
        id: Date.now(),
        timestamp: new Date(),
        read: false,
        ...notification
      }
      
      this.notifications.unshift(newNotification)
      this.unreadCount++
      
      // Keep only last 50 notifications
      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(0, 50)
      }
    },

    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        notification.read = true
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      }
    },

    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true
      })
      this.unreadCount = 0
    },

    clearNotifications() {
      this.notifications = []
      this.unreadCount = 0
    }
  }
})
