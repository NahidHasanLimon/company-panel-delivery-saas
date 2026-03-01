import apiClient from './client'

export const listItems = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/company/items', { params })
    return response.data
  } catch (error) {
    console.error('Error listing items:', error)
    throw error
  }
}

export const getItem = async (id) => {
  try {
    const response = await apiClient.get(`/api/company/items/${id}`)
    return response.data
  } catch (error) {
    console.error('Error getting item:', error)
    throw error
  }
}

export const createItem = async (payload) => {
  try {
    const response = await apiClient.post('/api/company/items', payload)
    return response.data
  } catch (error) {
    console.error('Error creating item:', error)
    throw error
  }
}

export const updateItem = async (id, payload) => {
  try {
    const response = await apiClient.put(`/api/company/items/${id}`, payload)
    return response.data
  } catch (error) {
    console.error('Error updating item:', error)
    throw error
  }
}

export const deleteItem = async (id) => {
  try {
    const response = await apiClient.delete(`/api/company/items/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting item:', error)
    throw error
  }
}
