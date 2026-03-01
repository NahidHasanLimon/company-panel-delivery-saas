import apiClient from './client'

export const listCompanyCustomers = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/company/customers', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching company customers:', error)
    throw error
  }
}
