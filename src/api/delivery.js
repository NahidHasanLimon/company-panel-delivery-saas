import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('access_token')
}

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
apiClient.interceptors.request.use(config => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Fetch company pickup addresses
export const fetchCompanyAddresses = async () => {
  try {
    const response = await apiClient.get('/api/company/addresses')
    return response.data
  } catch (error) {
    console.error('Error fetching company addresses:', error)
    throw error
  }
}

// Fetch company items with pagination and search
export const fetchCompanyItems = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/company/items', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching company items:', error)
    throw error
  }
}

// Fetch customer addresses
export const fetchCustomerAddresses = async (customerId) => {
  try {
    const response = await apiClient.get(`/api/company/customers/${customerId}/addresses`)
    return response.data
  } catch (error) {
    console.error('Error fetching customer addresses:', error)
    throw error
  }
}

// Create new delivery
export const createDelivery = async (deliveryData) => {
  try {
    const response = await apiClient.post('/api/company/deliveries', deliveryData)
    return response.data
  } catch (error) {
    console.error('Error creating delivery:', error)
    throw error
  }
}

// Validate item name and code for company
export const validateItem = async (name, code) => {
  try {
    const response = await apiClient.post('/api/company/items/validate', {
      name,
      code
    })
    return response.data
  } catch (error) {
    console.error('Error validating item:', error)
    throw error
  }
}

// Fetch company customers with pagination and search
export const fetchCompanyCustomers = async (page = 1, search = '') => {
  try {
    const params = { page }
    if (search) params.name = search
    
    const response = await apiClient.get('/api/company/customers', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching company customers:', error)
    throw error
  }
}

// Fetch company deliverymen
export const fetchCompanyDeliverymen = async () => {
  try {
    const response = await apiClient.get('/api/company/deliverymen')
    return response.data
  } catch (error) {
    console.error('Error fetching company deliverymen:', error)
    throw error
  }
}

// Export aliases for compatibility
export const getCompanyAddresses = fetchCompanyAddresses
export const getCompanyItems = fetchCompanyItems
export const getCompanyCustomers = fetchCompanyCustomers
export const getCustomerAddresses = fetchCustomerAddresses
export const getCompanyDeliverymen = fetchCompanyDeliverymen
