<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Customers</h2>
        <p class="text-gray-600 dark:text-gray-400">Manage your customer database</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <Plus class="h-4 w-4" />
        <span>Add Customer</span>
      </button>
    </div>

    <!-- Filter Component -->
    <FilterForm 
      :show-status="true"
      :show-deliveryman="false"
      :show-priority="false"
      :status-options="statusOptions"
      @filter-change="handleFilterChange"
    />

    <!-- Customers Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Address</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Orders</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="customer in paginatedCustomers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <User class="h-4 w-4 text-white" />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ customer.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ customer.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ customer.phone }}</div>
              </td>
              <td class="px-4 py-3 max-w-xs">
                <div class="text-sm text-gray-900 dark:text-white truncate">{{ customer.address }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <Package class="h-4 w-4 text-blue-600 mr-1" />
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ customer.totalOrders }}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(customer.joinedDate) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="customer.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                >
                  {{ customer.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-1">
                  <button 
                    @click="editCustomer(customer)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-xs px-2 py-1 border border-blue-600 dark:border-blue-400 rounded"
                  >
                    Edit
                  </button>
                  <button class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-xs px-2 py-1 border border-green-600 dark:border-green-400 rounded">
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <Pagination 
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="filteredCustomers.length"
        :per-page="parseInt(filters.perPage)"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Add/Edit Customer Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-900/20 dark:bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ showEditModal ? 'Edit Customer' : 'Add New Customer' }}
        </h3>
        <form @submit.prevent="showEditModal ? updateCustomer() : addCustomer()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              v-model="formData.name"
              type="text" 
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter full name"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input 
              v-model="formData.email"
              type="email" 
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter email address"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
            <input 
              v-model="formData.phone"
              type="tel" 
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter phone number"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <textarea 
              v-model="formData.address"
              required
              rows="3"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter full address"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select 
              v-model="formData.status"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="flex space-x-3 pt-4">
            <button 
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {{ showEditModal ? 'Update' : 'Add' }} Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useDashboardStore } from '../stores/dashboard'
import { User, Package, Plus } from 'lucide-vue-next'
import FilterForm from '../components/FilterForm.vue'
import Pagination from '../components/Pagination.vue'

export default {
  name: 'Customers',
  components: {
    User,
    Package,
    Plus,
    FilterForm,
    Pagination
  },
  setup() {
    const store = useDashboardStore()
    return { store }
  },
  data() {
    return {
      showAddModal: false,
      showEditModal: false,
      editingCustomer: null,
      currentPage: 1,
      filters: {
        search: '',
        status: '',
        perPage: '15'
      },
      formData: {
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active'
      },
      statusOptions: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  },
  computed: {
    filteredCustomers() {
      let filtered = [...this.store.customers]
      
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(customer => 
          customer.name.toLowerCase().includes(search) ||
          customer.email.toLowerCase().includes(search) ||
          customer.phone.includes(search) ||
          customer.address.toLowerCase().includes(search)
        )
      }
      
      if (this.filters.status) {
        filtered = filtered.filter(customer => customer.status === this.filters.status)
      }
      
      return filtered
    },
    totalPages() {
      return Math.ceil(this.filteredCustomers.length / parseInt(this.filters.perPage))
    },
    paginatedCustomers() {
      const start = (this.currentPage - 1) * parseInt(this.filters.perPage)
      const end = start + parseInt(this.filters.perPage)
      return this.filteredCustomers.slice(start, end)
    }
  },
  methods: {
    handleFilterChange(newFilters) {
      this.filters = { ...newFilters }
      this.currentPage = 1
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    addCustomer() {
      this.store.addCustomer({ ...this.formData })
      this.closeModal()
    },
    editCustomer(customer) {
      this.editingCustomer = customer
      this.formData = { ...customer }
      this.showEditModal = true
    },
    updateCustomer() {
      this.store.updateCustomer(this.editingCustomer.id, { ...this.formData })
      this.closeModal()
    },
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.editingCustomer = null
      this.formData = {
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active'
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>