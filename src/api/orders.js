import apiClient from './client'

export const fetchOrderFilterOptions = async () => {
  try {
    const response = await apiClient.get('/api/company/orders/options')
    return response.data
  } catch (error) {
    console.error('Error fetching order filter options:', error)
    throw error
  }
}

export const fetchOrders = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/company/orders', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export const createOrder = async (payload) => {
  try {
    const response = await apiClient.post('/api/company/orders', payload)
    return response.data
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export const fetchOrderDetails = async (orderId) => {
  try {
    const response = await apiClient.get(`/api/company/orders/${orderId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching order details:', error)
    throw error
  }
}
