import axios from 'axios'
import router from '../router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('access_token')
}

// Function to show error notification
const showAuthError = (message) => {
  // Try to show toast notification if available
  try {
    // Dynamically import the toast store to avoid circular dependencies
    import('../stores/toast').then(({ useToastStore }) => {
      const toastStore = useToastStore()
      toastStore.error(message, 6000)
    }).catch(() => {
      // Fallback to alert if toast store is not available
      console.warn('Toast store not available, using alert')
      alert(message)
    })
  } catch (e) {
    // Fallback to alert
    console.warn('Error showing toast notification, using alert')
    alert(message)
  }
}

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Global response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized responses globally
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized - clearing token and redirecting to login')
      
      // Clear authentication data
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      
      // Show notification
      const message = error.response.data?.message || 'Session expired. Please login again.'
      showAuthError(message)
      
      // Redirect to login page
      if (router.currentRoute.value.name !== 'Login') {
        router.push('/login')
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
