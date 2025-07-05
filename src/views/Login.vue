<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-800">
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center mb-2">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
        </div>
        <h2 class="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-1">Welcome Back</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Sign in to your DeliverFlow panel</p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block mb-1 text-gray-700 dark:text-gray-300 font-medium">Email</label>
          <input v-model="email" type="email" required autocomplete="username" class="w-full px-4 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label class="block mb-1 text-gray-700 dark:text-gray-300 font-medium">Password</label>
          <input v-model="password" type="password" required autocomplete="current-password" class="w-full px-4 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <button type="submit" class="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow hover:from-blue-700 hover:to-blue-800 transition">Login</button>
        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { showLoader, hideLoader } from '../stores/loader'

const email = ref('')
const password = ref('')
const error = ref('')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleLogin = async () => {
  error.value = ''
  showLoader()
  try {
    const response = await axios.post(`${API_BASE_URL}/api/company/login`, {
      email: email.value,
      password: password.value
    })
    const { access_token, user } = response.data.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    // Redirect to dashboard or home
    window.location.href = '/'
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed.'
  } finally {
    hideLoader()
  }
}
</script>

<style scoped>
body {
  background: #f7fafc;
}
</style>
