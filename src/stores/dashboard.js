import { defineStore } from 'pinia'
import { fetchDashboardData } from '../api/dashboard'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      totalDeliveries: 0,
      activeDeliverymen: 0,
      totalCustomers: 0,
      pendingDeliveries: 0,
      completedToday: 0,
      revenue: 0
    },
    deliverymen: [],
    customers: [],
    deliveries: [],
    recentActivity: [],
    // API integration state
    apiData: {
      summary: null,
      recentDeliveries: [],
      recentActivity: [],
      topPerformers: [],
      loading: false,
      error: null
    },
    // Detailed delivery status counts from API
    deliveryStatusCounts: {
      pending: 0,
      assigned: 0,
      in_progress: 0,
      delivered: 0,
      cancelled: 0
    }
  }),
  
  getters: {
    activeDeliveries: (state) => state.deliveries.filter(d => d.status !== 'completed' && d.status !== 'delivered'),
    completedDeliveries: (state) => state.deliveries.filter(d => d.status === 'completed' || d.status === 'delivered'),
    averageRating: (state) => {
      if (state.deliverymen.length === 0) return 0
      const totalRating = state.deliverymen.reduce((sum, dm) => sum + dm.rating, 0)
      return (totalRating / state.deliverymen.length).toFixed(1)
    },
    // API-based getters
    totalActiveDeliveries: (state) => {
      return state.deliveryStatusCounts.pending + 
             state.deliveryStatusCounts.assigned + 
             state.deliveryStatusCounts.in_progress
    },
    deliveryCompletionRate: (state) => {
      const total = state.stats.totalDeliveries
      const delivered = state.deliveryStatusCounts.delivered
      return total > 0 ? ((delivered / total) * 100).toFixed(1) : 0
    }
  },
  
  actions: {
    async loadDashboard() {
      // Check if user is authenticated before making API call
      const token = localStorage.getItem('access_token')
      if (!token) {
        this.apiData.error = 'No authentication token found. Please log in.'
        return
      }

      this.apiData.loading = true
      this.apiData.error = null
      try {
        const res = await fetchDashboardData()
        if (res.data.success) {
          this.apiData.summary = res.data.data.summary
          this.apiData.recentDeliveries = res.data.data.recent_deliveries
          this.apiData.recentActivity = res.data.data.recent_activity
          this.apiData.topPerformers = res.data.data.top_performers
          
          // Update stats with API data
          this.stats.totalDeliveries = res.data.data.summary.total_deliveries
          this.stats.activeDeliverymen = res.data.data.summary.active_deliverymen
          this.stats.totalCustomers = res.data.data.summary.total_customers
          this.stats.pendingDeliveries = res.data.data.summary.delivery_status_counts.pending
          this.stats.completedToday = res.data.data.summary.delivered_today
          this.stats.revenue = res.data.data.summary.revenue_today
          
          // Update detailed delivery status counts
          this.deliveryStatusCounts = res.data.data.summary.delivery_status_counts
        } else {
          this.apiData.error = res.data.message || 'Failed to fetch dashboard data.'
        }
      } catch (e) {
        if (e.response && e.response.status === 401) {
          this.apiData.error = 'Authentication failed. Please log in again.'
          // Clear the invalid token
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          // Redirect to login
          window.location.href = '/login'
        } else {
          this.apiData.error = e.response?.data?.message || e.message || 'Failed to fetch dashboard data.'
        }
        console.error('Dashboard API error:', e)
      } finally {
        this.apiData.loading = false
      }
    },
    
    addDeliveryman(deliveryman) {
      const newId = this.deliverymen.length > 0 ? Math.max(...this.deliverymen.map(d => d.id)) + 1 : 1
      this.deliverymen.push({
        ...deliveryman,
        id: newId,
        totalDeliveries: 0,
        rating: 5.0,
        joinedDate: new Date().toISOString().split('T')[0]
      })
      this.stats.activeDeliverymen++
    },
    
    updateDeliveryman(id, updates) {
      const index = this.deliverymen.findIndex(d => d.id === id)
      if (index !== -1) {
        this.deliverymen[index] = { ...this.deliverymen[index], ...updates }
      }
    },
    
    addCustomer(customer) {
      const newId = this.customers.length > 0 ? Math.max(...this.customers.map(c => c.id)) + 1 : 1
      this.customers.push({
        ...customer,
        id: newId,
        totalOrders: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active'
      })
      this.stats.totalCustomers++
    },
    
    updateCustomer(id, updates) {
      const index = this.customers.findIndex(c => c.id === id)
      if (index !== -1) {
        this.customers[index] = { ...this.customers[index], ...updates }
      }
    },
    
    updateDeliveryStatus(deliveryId, newStatus) {
      const delivery = this.deliveries.find(d => d.id === deliveryId)
      if (delivery) {
        delivery.status = newStatus
        if (newStatus === 'completed') {
          this.stats.completedToday++
          this.stats.pendingDeliveries--
        }
      }
    },
    
    assignDelivery(deliveryId, deliverymanId) {
      const delivery = this.deliveries.find(d => d.id === deliveryId)
      const deliveryman = this.deliverymen.find(d => d.id === deliverymanId)
      if (delivery && deliveryman) {
        delivery.deliverymanName = deliveryman.name
        delivery.status = 'assigned'
      }
    }
  }
})