<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Delivery Personnel</h2>
        <p class="text-gray-600 dark:text-gray-400">Manage your delivery team</p>
      </div>
      <div class="flex space-x-3">
        <!-- View Toggle -->
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button 
            @click="viewMode = 'table'"
            class="px-3 py-1 text-sm rounded-md transition-colors"
            :class="viewMode === 'table' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
          >
            <List class="h-4 w-4" />
          </button>
          <button 
            @click="viewMode = 'grid'"
            class="px-3 py-1 text-sm rounded-md transition-colors"
            :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
          >
            <Grid class="h-4 w-4" />
          </button>
        </div>
        <button 
          @click="showAddModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus class="h-4 w-4" />
          <span>Add Deliveryman</span>
        </button>
      </div>
    </div>

    <!-- Filter Component -->
    <FilterForm 
      :show-status="true"
      :show-deliveryman="false"
      :show-priority="false"
      :status-options="statusOptions"
      @filter-change="handleFilterChange"
    />

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="bg-white dark:bg-gray-800 rounded-xl card-shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deliveryman</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deliveries</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="deliveryman in paginatedDeliverymen" :key="deliveryman.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User class="h-4 w-4 text-white" />
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ deliveryman.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ deliveryman.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ deliveryman.phone }}
              </td>
              <td class="px-4 py-3 max-w-xs">
                <div class="text-sm text-gray-900 dark:text-white truncate">{{ deliveryman.currentLocation }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <Package class="h-4 w-4 text-blue-600 mr-1" />
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ deliveryman.totalDeliveries }}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <Star class="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span class="text-sm text-gray-900 dark:text-white">{{ deliveryman.rating }}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="deliveryman.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                >
                  {{ deliveryman.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-1">
                  <button 
                    @click="editDeliveryman(deliveryman)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-xs px-2 py-1 border border-blue-600 dark:border-blue-400 rounded"
                  >
                    Edit
                  </button>
                  <button class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-xs px-2 py-1 border border-green-600 dark:border-green-400 rounded">
                    Assign
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div 
        v-for="deliveryman in paginatedDeliverymen" 
        :key="deliveryman.id"
        class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User class="h-5 w-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ deliveryman.name }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ deliveryman.email }}</p>
          </div>
          <span 
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="deliveryman.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
          >
            {{ deliveryman.status }}
          </span>
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <Phone class="h-3 w-3 mr-2 flex-shrink-0" />
            <span class="truncate">{{ deliveryman.phone }}</span>
          </div>
          <div class="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <MapPin class="h-3 w-3 mr-2 flex-shrink-0" />
            <span class="truncate">{{ deliveryman.currentLocation }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center">
              <Package class="h-3 w-3 mr-1 text-blue-600" />
              <span class="font-medium text-gray-900 dark:text-white">{{ deliveryman.totalDeliveries }}</span>
            </div>
            <div class="flex items-center">
              <Star class="h-3 w-3 mr-1 text-yellow-400 fill-current" />
              <span class="font-medium text-gray-900 dark:text-white">{{ deliveryman.rating }}</span>
            </div>
          </div>
        </div>
        
        <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div class="flex space-x-2">
            <button 
              @click="editDeliveryman(deliveryman)"
              class="flex-1 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-2 py-1 rounded text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Edit
            </button>
            <button class="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination 
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="filteredDeliverymen.length"
      :per-page="parseInt(filters.perPage)"
      @page-change="handlePageChange"
    />

    <!-- Add/Edit Deliveryman Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-gray-900/20 dark:bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ showEditModal ? 'Edit Deliveryman' : 'Add New Deliveryman' }}
        </h3>
        <form @submit.prevent="showEditModal ? updateDeliveryman() : addDeliveryman()" class="space-y-4">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Location</label>
            <input 
              v-model="formData.currentLocation"
              type="text" 
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter current location"
            >
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
              {{ showEditModal ? 'Update' : 'Add' }} Deliveryman
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useDashboardStore } from '../stores/dashboard'
import { User, Phone, MapPin, Package, Star, Plus, List, Grid } from 'lucide-vue-next'
import FilterForm from '../components/FilterForm.vue'
import Pagination from '../components/Pagination.vue'

export default {
  name: 'Deliverymen',
  components: {
    User,
    Phone,
    MapPin,
    Package,
    Star,
    Plus,
    List,
    Grid,
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
      editingDeliveryman: null,
      currentPage: 1,
      viewMode: 'table', // 'table' or 'grid'
      filters: {
        search: '',
        status: '',
        perPage: '12'
      },
      formData: {
        name: '',
        email: '',
        phone: '',
        currentLocation: '',
        status: 'active'
      },
      statusOptions: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  },
  computed: {
    filteredDeliverymen() {
      let filtered = [...this.store.deliverymen]
      
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(deliveryman => 
          deliveryman.name.toLowerCase().includes(search) ||
          deliveryman.email.toLowerCase().includes(search) ||
          deliveryman.phone.includes(search)
        )
      }
      
      if (this.filters.status) {
        filtered = filtered.filter(deliveryman => deliveryman.status === this.filters.status)
      }
      
      return filtered
    },
    totalPages() {
      return Math.ceil(this.filteredDeliverymen.length / parseInt(this.filters.perPage))
    },
    paginatedDeliverymen() {
      const start = (this.currentPage - 1) * parseInt(this.filters.perPage)
      const end = start + parseInt(this.filters.perPage)
      return this.filteredDeliverymen.slice(start, end)
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
    addDeliveryman() {
      this.store.addDeliveryman({ ...this.formData })
      this.closeModal()
    },
    editDeliveryman(deliveryman) {
      this.editingDeliveryman = deliveryman
      this.formData = { ...deliveryman }
      this.showEditModal = true
    },
    updateDeliveryman() {
      this.store.updateDeliveryman(this.editingDeliveryman.id, { ...this.formData })
      this.closeModal()
    },
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.editingDeliveryman = null
      this.formData = {
        name: '',
        email: '',
        phone: '',
        currentLocation: '',
        status: 'active'
      }
    }
  }
}
</script>