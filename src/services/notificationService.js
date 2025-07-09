import { messaging, getToken, onMessage } from '../firebase/config'

class NotificationService {
  constructor() {
    this.vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
    this.token = null
    
    // Debug: Log ALL environment variables for troubleshooting
    console.log('All Vite env vars:', import.meta.env)
    console.log('VAPID Key loaded:', this.vapidKey ? `${this.vapidKey.substring(0, 10)}...` : 'NOT FOUND')
    console.log('VAPID Key length:', this.vapidKey?.length || 0)
    console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
    
    // Validate VAPID key
    if (!this.vapidKey || this.vapidKey === 'YOUR_VAPID_KEY_HERE') {
      console.warn('Firebase VAPID key not configured. Please set VITE_FIREBASE_VAPID_KEY in your .env file.')
    }
  }

  // Request permission and get FCM token
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        console.log('Notification permission granted.')
        
        // Get registration token
        const token = await getToken(messaging, {
          vapidKey: this.vapidKey?.trim()
        })
        
        if (token) {
          console.log('FCM Token:', token)
          this.token = token
          
          // Send token to your server
          this.sendTokenToServer(token)
          
          return token
        } else {
          console.log('No registration token available.')
          return null
        }
      } else {
        console.log('Unable to get permission to notify.')
        return null
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error)
      return null
    }
  }

  // Send token to your backend server
  async sendTokenToServer(token) {
    try {
      // Replace with your API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          fcm_token: token,
          device_type: 'web'
        })
      })
      
      if (response.ok) {
        console.log('Token sent to server successfully')
      } else {
        console.error('Failed to send token to server')
      }
    } catch (error) {
      console.error('Error sending token to server:', error)
    }
  }

  // Listen for foreground messages
  setupForegroundMessageListener() {
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload)
      
      // Show notification when app is in foreground
      this.showNotification(payload)
    })
  }

  // Show browser notification
  showNotification(payload) {
    const { title, body, icon } = payload.notification || {}
    
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title || 'New Notification', {
        body: body || 'You have a new message',
        icon: icon || '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: payload.data?.tag || 'delivery-notification',
        data: payload.data,
        requireInteraction: true
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
        
        // Handle notification click - navigate to specific page if needed
        if (payload.data?.url) {
          window.location.href = payload.data.url
        }
      }

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)
    }
  }

  // Initialize the service
  async initialize() {
    if ('serviceWorker' in navigator) {
      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        console.log('Service Worker registered:', registration)
        
        // Request permission and get token
        await this.requestPermission()
        
        // Setup foreground message listener
        this.setupForegroundMessageListener()
        
        return true
      } catch (error) {
        console.error('Service Worker registration failed:', error)
        return false
      }
    } else {
      console.log('Service Worker not supported')
      return false
    }
  }

  // Get current token
  getToken() {
    return this.token
  }
}

export default new NotificationService()
