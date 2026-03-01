import apiClient from './client'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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
    
    // Extract the API error message if available
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message)
    }
    
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

// Fetch company deliverymen with filtering + pagination
export const fetchCompanyDeliverymen = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/company/deliverymen', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching company deliverymen:', error)
    throw error
  }
}

// Unlink delivery man from company
export const unlinkCompanyDeliveryman = async (deliverymanId) => {
  try {
    const response = await apiClient.delete(`/api/company/deliverymen/${deliverymanId}`)
    return response.data
  } catch (error) {
    console.error('Error unlinking delivery man:', error)
    throw error
  }
}

// Invite delivery man with OTP
export const inviteDeliveryMan = async (mobileNumber) => {
  try {
    const response = await apiClient.post('/api/company/delivery-men/invitations', {
      mobile_number: mobileNumber
    })
    return response.data
  } catch (error) {
    console.error('Error inviting delivery man:', error)
    throw error
  }
}

// Fetch delivery man invitations with filtering + pagination
export const fetchDeliveryManInvitations = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/company/delivery-men/invitations', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching delivery man invitations:', error)
    throw error
  }
}

// Resend OTP for existing invitation
export const resendDeliveryManInvitation = async (inviteId) => {
  try {
    const response = await apiClient.post(`/api/company/delivery-men/invitations/${inviteId}/resend`)
    return response.data
  } catch (error) {
    console.error('Error resending delivery man invitation OTP:', error)
    throw error
  }
}

// Verify delivery man invitation OTP (public endpoint)
export const verifyDeliveryManInvite = async (inviteId, otp) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/delivery-men/invitations/${inviteId}/verify`,
      { otp },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error verifying delivery man invitation:', error)
    throw error
  }
}

// Fetch delivery options (types, modes, statuses)
export const fetchDeliveryOptions = async () => {
  try {
    const response = await apiClient.get('/api/company/deliveries/options')
    return response.data
  } catch (error) {
    console.error('Error fetching delivery options:', error)
    throw error
  }
}

// Fetch deliveries with filtering and pagination
export const fetchDeliveries = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/company/deliveries', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching deliveries:', error)
    throw error
  }
}

// Fetch delivery details by ID
export const fetchDeliveryDetails = async (deliveryId) => {
  try {
    const response = await apiClient.get(`/api/company/deliveries/${deliveryId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching delivery details:', error)
    throw error
  }
}

// Export aliases for compatibility
export const getCompanyAddresses = fetchCompanyAddresses
export const getCompanyItems = fetchCompanyItems
export const getCompanyCustomers = fetchCompanyCustomers
export const getCustomerAddresses = fetchCustomerAddresses
export const getCompanyDeliverymen = fetchCompanyDeliverymen
export const getDeliveryOptions = fetchDeliveryOptions
