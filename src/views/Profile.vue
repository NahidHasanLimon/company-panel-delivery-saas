<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
      <p class="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Information -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input 
                    v-model="profile.firstName"
                    type="text" 
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter first name"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input 
                    v-model="profile.lastName"
                    type="text" 
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter last name"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input 
                  v-model="profile.email"
                  type="email" 
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email address"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input 
                  v-model="profile.phone"
                  type="tel" 
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter phone number"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                <input 
                  v-model="profile.role"
                  type="text" 
                  readonly
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                >
              </div>
              
              <div class="flex justify-end">
                <button 
                  type="submit"
                  class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Profile Picture & Stats -->
      <div class="space-y-6">
        <!-- Profile Picture -->
        <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</h3>
          <div class="text-center">
            <div class="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User class="w-12 h-12 text-white" />
            </div>
            <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              Change Picture
            </button>
          </div>
        </div>

        <!-- Account Stats -->
        <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Statistics</h3>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">Jan 2024</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">Today</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Total Sessions</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">247</span>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h3>
          <div class="space-y-3">
            <button class="w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Change Password
            </button>
            <button class="w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Two-Factor Authentication
            </button>
            <button class="w-full text-left text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { User } from 'lucide-vue-next'

export default {
  name: 'Profile',
  components: {
    User
  },
  data() {
    return {
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@deliverflow.com',
        phone: '+1 (555) 123-4567',
        role: 'Administrator'
      }
    }
  },
  methods: {
    updateProfile() {
      // Add profile update logic here
      console.log('Profile updated:', this.profile)
      // Show success message
      alert('Profile updated successfully!')
    }
  }
}
</script>