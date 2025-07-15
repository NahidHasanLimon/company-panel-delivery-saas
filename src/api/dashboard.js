import apiClient from './client'

export function fetchDashboardData() {
  return apiClient.get('/api/company/dashboard')
}
