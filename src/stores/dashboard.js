import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      totalDeliveries: 1247,
      activeDeliverymen: 45,
      totalCustomers: 892,
      pendingDeliveries: 23,
      completedToday: 89,
      revenue: 15670
    },
    deliverymen: [
      {
        id: 1,
        name: 'John Martinez',
        email: 'john.martinez@email.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        totalDeliveries: 156,
        rating: 4.8,
        joinedDate: '2024-01-15',
        currentLocation: 'Downtown Area'
      },
      {
        id: 2,
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        phone: '+1 (555) 234-5678',
        status: 'active',
        totalDeliveries: 203,
        rating: 4.9,
        joinedDate: '2023-11-20',
        currentLocation: 'North District'
      },
      {
        id: 3,
        name: 'Michael Johnson',
        email: 'michael.j@email.com',
        phone: '+1 (555) 345-6789',
        status: 'inactive',
        totalDeliveries: 98,
        rating: 4.6,
        joinedDate: '2024-02-28',
        currentLocation: 'West Side'
      },
      {
        id: 4,
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        phone: '+1 (555) 456-7890',
        status: 'active',
        totalDeliveries: 134,
        rating: 4.7,
        joinedDate: '2024-01-08',
        currentLocation: 'East Side'
      },
      {
        id: 5,
        name: 'David Kim',
        email: 'david.kim@email.com',
        phone: '+1 (555) 567-8901',
        status: 'active',
        totalDeliveries: 89,
        rating: 4.5,
        joinedDate: '2024-02-15',
        currentLocation: 'South District'
      }
    ],
    customers: [
      {
        id: 1,
        name: 'Alice Wilson',
        email: 'alice.wilson@email.com',
        phone: '+1 (555) 111-2222',
        address: '123 Oak Street, Downtown',
        totalOrders: 45,
        joinedDate: '2023-08-15',
        status: 'active'
      },
      {
        id: 2,
        name: 'Bob Thompson',
        email: 'bob.thompson@email.com',
        phone: '+1 (555) 333-4444',
        address: '456 Pine Avenue, Uptown',
        totalOrders: 23,
        joinedDate: '2023-10-22',
        status: 'active'
      },
      {
        id: 3,
        name: 'Carol Davis',
        email: 'carol.davis@email.com',
        phone: '+1 (555) 555-6666',
        address: '789 Maple Drive, Suburbs',
        totalOrders: 67,
        joinedDate: '2023-06-10',
        status: 'active'
      },
      {
        id: 4,
        name: 'Daniel Brown',
        email: 'daniel.brown@email.com',
        phone: '+1 (555) 777-8888',
        address: '321 Elm Street, Midtown',
        totalOrders: 12,
        joinedDate: '2024-01-05',
        status: 'active'
      },
      {
        id: 5,
        name: 'Eva Martinez',
        email: 'eva.martinez@email.com',
        phone: '+1 (555) 999-0000',
        address: '654 Cedar Lane, Westside',
        totalOrders: 38,
        joinedDate: '2023-09-18',
        status: 'active'
      }
    ],
    deliveries: [
      {
        id: 'DEL-001',
        customerName: 'Alice Wilson',
        customerPhone: '+1 (555) 111-2222',
        deliverymanName: 'John Martinez',
        pickupAddress: 'Downtown Mall',
        deliveryAddress: '123 Oak Street',
        status: 'in-transit',
        priority: 'high',
        orderValue: 89.50,
        estimatedTime: '25 min',
        createdAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 'DEL-002',
        customerName: 'Bob Thompson',
        customerPhone: '+1 (555) 333-4444',
        deliverymanName: 'Sarah Chen',
        pickupAddress: 'Central Restaurant',
        deliveryAddress: '456 Pine Avenue',
        status: 'pending',
        priority: 'medium',
        orderValue: 65.25,
        estimatedTime: '45 min',
        createdAt: '2024-01-20T09:15:00Z'
      },
      {
        id: 'DEL-003',
        customerName: 'Carol Davis',
        customerPhone: '+1 (555) 555-6666',
        deliverymanName: 'Michael Johnson',
        pickupAddress: 'Tech Store',
        deliveryAddress: '789 Maple Drive',
        status: 'completed',
        priority: 'low',
        orderValue: 145.80,
        estimatedTime: 'Completed',
        createdAt: '2024-01-20T08:00:00Z'
      },
      {
        id: 'DEL-004',
        customerName: 'Daniel Brown',
        customerPhone: '+1 (555) 777-8888',
        deliverymanName: 'Emily Rodriguez',
        pickupAddress: 'Fashion Store',
        deliveryAddress: '321 Elm Street',
        status: 'assigned',
        priority: 'medium',
        orderValue: 78.90,
        estimatedTime: '35 min',
        createdAt: '2024-01-20T11:45:00Z'
      },
      {
        id: 'DEL-005',
        customerName: 'Eva Martinez',
        customerPhone: '+1 (555) 999-0000',
        deliverymanName: 'David Kim',
        pickupAddress: 'Electronics Hub',
        deliveryAddress: '654 Cedar Lane',
        status: 'in-transit',
        priority: 'high',
        orderValue: 234.50,
        estimatedTime: '20 min',
        createdAt: '2024-01-20T12:15:00Z'
      },
      {
        id: 'DEL-006',
        customerName: 'Alice Wilson',
        customerPhone: '+1 (555) 111-2222',
        deliverymanName: '',
        pickupAddress: 'Grocery Store',
        deliveryAddress: '123 Oak Street',
        status: 'pending',
        priority: 'low',
        orderValue: 45.30,
        estimatedTime: '40 min',
        createdAt: '2024-01-20T13:00:00Z'
      },
      {
        id: 'DEL-007',
        customerName: 'Bob Thompson',
        customerPhone: '+1 (555) 333-4444',
        deliverymanName: 'John Martinez',
        pickupAddress: 'Pharmacy',
        deliveryAddress: '456 Pine Avenue',
        status: 'completed',
        priority: 'high',
        orderValue: 23.75,
        estimatedTime: 'Completed',
        createdAt: '2024-01-19T16:30:00Z'
      },
      {
        id: 'DEL-008',
        customerName: 'Carol Davis',
        customerPhone: '+1 (555) 555-6666',
        deliverymanName: 'Sarah Chen',
        pickupAddress: 'Book Store',
        deliveryAddress: '789 Maple Drive',
        status: 'assigned',
        priority: 'medium',
        orderValue: 67.20,
        estimatedTime: '30 min',
        createdAt: '2024-01-20T14:20:00Z'
      },
      {
        id: 'DEL-009',
        customerName: 'Daniel Brown',
        customerPhone: '+1 (555) 777-8888',
        deliverymanName: '',
        pickupAddress: 'Coffee Shop',
        deliveryAddress: '321 Elm Street',
        status: 'pending',
        priority: 'low',
        orderValue: 15.60,
        estimatedTime: '25 min',
        createdAt: '2024-01-20T15:10:00Z'
      },
      {
        id: 'DEL-010',
        customerName: 'Eva Martinez',
        customerPhone: '+1 (555) 999-0000',
        deliverymanName: 'Emily Rodriguez',
        pickupAddress: 'Flower Shop',
        deliveryAddress: '654 Cedar Lane',
        status: 'in-transit',
        priority: 'medium',
        orderValue: 89.40,
        estimatedTime: '15 min',
        createdAt: '2024-01-20T16:00:00Z'
      },
      {
        id: 'DEL-011',
        customerName: 'Alice Wilson',
        customerPhone: '+1 (555) 111-2222',
        deliverymanName: 'David Kim',
        pickupAddress: 'Pet Store',
        deliveryAddress: '123 Oak Street',
        status: 'completed',
        priority: 'low',
        orderValue: 156.80,
        estimatedTime: 'Completed',
        createdAt: '2024-01-19T10:15:00Z'
      },
      {
        id: 'DEL-012',
        customerName: 'Bob Thompson',
        customerPhone: '+1 (555) 333-4444',
        deliverymanName: '',
        pickupAddress: 'Hardware Store',
        deliveryAddress: '456 Pine Avenue',
        status: 'pending',
        priority: 'high',
        orderValue: 203.45,
        estimatedTime: '50 min',
        createdAt: '2024-01-20T17:30:00Z'
      }
    ],
    recentActivity: [
      { type: 'delivery', message: 'Delivery DEL-001 assigned to John Martinez', time: '2 min ago' },
      { type: 'customer', message: 'New customer Carol Davis registered', time: '15 min ago' },
      { type: 'delivery', message: 'Delivery DEL-003 completed successfully', time: '1 hour ago' },
      { type: 'deliveryman', message: 'Sarah Chen updated location', time: '2 hours ago' }
    ]
  }),
  
  getters: {
    activeDeliveries: (state) => state.deliveries.filter(d => d.status !== 'completed'),
    completedDeliveries: (state) => state.deliveries.filter(d => d.status === 'completed'),
    averageRating: (state) => {
      const totalRating = state.deliverymen.reduce((sum, dm) => sum + dm.rating, 0)
      return (totalRating / state.deliverymen.length).toFixed(1)
    }
  },
  
  actions: {
    addDeliveryman(deliveryman) {
      const newId = Math.max(...this.deliverymen.map(d => d.id)) + 1
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
      const newId = Math.max(...this.customers.map(c => c.id)) + 1
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