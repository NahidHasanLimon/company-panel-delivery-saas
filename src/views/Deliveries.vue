<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Deliveries</h2>
        <p class="text-gray-600 dark:text-gray-400">Track and manage all deliveries</p>
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
          @click="openAddModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus class="h-4 w-4" />
          <span>New Delivery</span>
        </button>
      </div>
    </div>

    <!-- Filter Component -->
    <FilterForm 
      :show-status="true"
      :show-deliveryman="true"
      :show-priority="true"
      :status-options="statusOptions"
      :deliverymen-options="companyDeliverymen"
      @filter-change="handleFilterChange"
    />

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="bg-white dark:bg-gray-800 rounded-xl card-shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deliveryman</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pickup</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivery</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="delivery in paginatedDeliveries" :key="delivery.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ delivery.id }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ delivery.customerName }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ delivery.customerPhone }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ delivery.deliverymanName || 'Unassigned' }}
              </td>
              <td class="px-4 py-3 max-w-xs">
                <div class="text-sm text-gray-900 dark:text-white truncate">{{ delivery.pickupAddress }}</div>
              </td>
              <td class="px-4 py-3 max-w-xs">
                <div class="text-sm text-gray-900 dark:text-white truncate">{{ delivery.deliveryAddress }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusColor(delivery.status)"
                >
                  {{ delivery.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ delivery.orderValue }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-1">
                  <button 
                    v-if="delivery.status === 'pending'"
                    @click="assignDelivery(delivery.id)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-xs px-2 py-1 border border-blue-600 dark:border-blue-400 rounded"
                  >
                    Assign
                  </button>
                  <button 
                    v-if="delivery.status === 'in-transit'"
                    @click="completeDelivery(delivery.id)"
                    class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-xs px-2 py-1 border border-green-600 dark:border-green-400 rounded"
                  >
                    Complete
                  </button>
                  <button class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded">
                    View
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
        v-for="delivery in paginatedDeliveries" 
        :key="delivery.id"
        class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Package class="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ delivery.id }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(delivery.createdAt) }}</p>
            </div>
          </div>
          <span 
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusColor(delivery.status)"
          >
            {{ delivery.status }}
          </span>
        </div>

        <div class="space-y-2 mb-3">
          <div class="flex items-start space-x-2">
            <User class="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="text-xs min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ delivery.customerName }}</p>
              <p class="text-gray-500 dark:text-gray-400 truncate">{{ delivery.customerPhone }}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <UserCheck class="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="text-xs min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ delivery.deliverymanName || 'Unassigned' }}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <MapPin class="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="text-xs min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ delivery.pickupAddress }}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <Navigation class="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="text-xs min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ delivery.deliveryAddress }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-600">
          <div class="flex items-center space-x-3">
            <div class="text-xs">
              <p class="font-semibold text-gray-900 dark:text-white">${{ delivery.orderValue }}</p>
            </div>
            <div class="text-xs">
              <p class="font-semibold text-gray-900 dark:text-white">{{ delivery.estimatedTime }}</p>
            </div>
          </div>
          <div 
            class="w-2 h-2 rounded-full"
            :class="getPriorityColor(delivery.priority)"
          ></div>
        </div>

        <div class="flex space-x-1 mt-3">
          <button 
            v-if="delivery.status === 'pending'"
            @click="assignDelivery(delivery.id)"
            class="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
          >
            Assign
          </button>
          <button 
            v-if="delivery.status === 'in-transit'"
            @click="completeDelivery(delivery.id)"
            class="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
          >
            Complete
          </button>
          <button class="flex-1 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-2 py-1 rounded text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            View
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination 
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="filteredDeliveries.length"
      :per-page="parseInt(filters.perPage)"
      @page-change="handlePageChange"
    />

    <!-- Add Delivery Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-900/20 dark:bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Sticky Header -->
        <div class="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl sticky top-0 z-10">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create New Delivery</h3>
          <button 
            type="button"
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6 pt-2">
        <form @submit.prevent="addDelivery" class="space-y-6">
          
          <!-- Customer Information -->
          <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <h4 class="text-md font-medium text-gray-900 dark:text-white flex items-center">
                  <User class="h-4 w-4 mr-2 text-blue-600" />
                  Customer Information
                </h4>
                <span v-if="formData.isCustomerLocked && formData.customerCode" class="ml-2 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                  {{ formData.customerCode }}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  v-if="formData.isCustomerLocked"
                  type="button"
                  @click="clearCustomerSelection"
                  class="inline-flex items-center px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800"
                  title="Clear selection and enter manually"
                >
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Clear
                </button>
                <button
                  type="button"
                  @click="openCustomerModal"
                  class="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                  title="Choose from existing customers"
                >
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  {{ formData.isCustomerLocked ? 'Change' : 'Saved' }}
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name *</label>
                <input 
                  v-model="formData.customerName"
                  type="text"
                  required
                  :disabled="formData.isCustomerLocked"
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  :class="{ 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed': formData.isCustomerLocked }"
                  placeholder="Enter customer name"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                <input 
                  v-model="formData.customerPhone"
                  type="tel"
                  required
                  :disabled="formData.isCustomerLocked"
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  :class="{ 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed': formData.isCustomerLocked }"
                  placeholder="Enter phone number"
                >
              </div>
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input 
                v-model="formData.customerEmail"
                type="email"
                :disabled="formData.isCustomerLocked"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                :class="{ 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed': formData.isCustomerLocked }"
                placeholder="Enter email address (optional)"
              >
            </div>
          </div>

          <!-- Deliveryman Assignment -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deliveryman</label>
              <select 
                v-model="formData.deliverymanId"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Assign Later</option>
                <option v-for="deliveryman in companyDeliverymen" :key="deliveryman.id" :value="deliveryman.id">
                  {{ deliveryman.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Pickup Address Section -->
          <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <MapPin class="h-4 w-4 mr-2 text-blue-600" />
              Pickup Information
            </h4>
            
            <div class="space-y-3">
              <!-- Manual Input -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pickup Address *
                  </label>
                  <button
                    type="button"
                    @click="openPickupAddressModal"
                    class="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                    title="Choose from saved addresses"
                  >
                    <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H5m14 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12"></path>
                    </svg>
                    Saved
                  </button>
                </div>
                <div class="space-y-2">
                  <input 
                    v-model="formData.pickupLabel"
                    type="text" 
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Address label (e.g., Main Warehouse, Office Building)"
                  >
                  <textarea 
                    v-model="formData.pickupAddress"
                    required
                    rows="2"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Enter complete pickup address with building number, street, city, state, ZIP"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Drop-off Address Section -->
          <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Navigation class="h-4 w-4 mr-2 text-green-600" />
              Drop-off Information
              <span v-if="!hasCustomerInfo" class="ml-2 text-xs text-yellow-600 dark:text-yellow-400 font-normal">
                (Enter customer info for saved addresses)
              </span>
            </h4>
            
            <div class="space-y-3">
              <!-- Manual Input -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drop-off Address *
                  </label>
                  <button
                    v-if="hasCustomerInfo"
                    type="button"
                    @click="openDropAddressModal"
                    class="inline-flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-medium rounded hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors border border-green-200 dark:border-green-800"
                    title="Choose from customer addresses"
                  >
                    <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Saved
                  </button>
                </div>
                <div class="space-y-2">
                  <input 
                    v-model="formData.dropLabel"
                    type="text" 
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Address label (e.g., Customer Office, Home, Warehouse)"
                  >
                  <textarea 
                    v-model="formData.dropAddress"
                    required
                    rows="2"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Enter complete drop-off address with building number, street, city, state, ZIP"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Section -->
          <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center space-x-3">
                <h4 class="text-md font-medium text-gray-900 dark:text-white">Delivery Items</h4>
                <button 
                  type="button" 
                  @click="addNewItem"
                  :disabled="!canAddNewItem"
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded transition-colors"
                  :class="canAddNewItem 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'"
                  :title="canAddNewItem ? 'Add another item' : 'Complete the current item first'"
                >
                  <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Item
                </button>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ formData.items.length }} item(s)</span>
            </div>
            <div v-if="!canAddNewItem && formData.items.length > 0" class="mb-3">
              <p class="text-xs text-amber-600 dark:text-amber-400 flex items-center">
                <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                Complete the current item (name, code, and quantity) to add another item
              </p>
            </div>
            
            <!-- Items List -->
            <div class="space-y-4">
              <div v-for="(item, index) in formData.items" :key="index" 
                   class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <div class="flex justify-between items-start mb-3">
                  <h5 class="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                    <Package class="h-4 w-4 mr-2 text-blue-600" />
                    Item {{ index + 1 }}
                  </h5>
                  <div class="flex items-center space-x-2">
                    <button 
                      type="button" 
                      @click="openItemsModalForIndex(index)"
                      class="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                      From Catalog
                    </button>
                    <button 
                      type="button" 
                      @click="removeItem(index)"
                      class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Item Form Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name *</label>
                    <input 
                      v-model="item.name"
                      type="text" 
                      required
                      :disabled="item.isLocked"
                      @blur="validateItemName(item, index)"
                      class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      :class="{ 
                        'border-red-500': item.nameError,
                        'bg-gray-100 dark:bg-gray-600 cursor-not-allowed': item.isLocked 
                      }"
                      placeholder="Enter item name"
                    >
                    <p v-if="item.nameError" class="text-red-500 text-xs mt-1">{{ item.nameError }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Item Code *</label>
                    <input 
                      v-model="item.code"
                      type="text" 
                      required
                      :disabled="item.isLocked"
                      @blur="validateItemCode(item, index)"
                      class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      :class="{ 
                        'border-red-500': item.codeError,
                        'bg-gray-100 dark:bg-gray-600 cursor-not-allowed': item.isLocked 
                      }"
                      placeholder="Enter item code"
                    >
                    <p v-if="item.codeError" class="text-red-500 text-xs mt-1">{{ item.codeError }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                    <input 
                      v-model="item.unit"
                      type="text" 
                      :disabled="item.isLocked"
                      class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      :class="{ 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed': item.isLocked }"
                      placeholder="e.g., pcs, kg, box"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity *</label>
                    <input 
                      v-model="item.quantity"
                      type="number" 
                      min="1"
                      required
                      class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter quantity"
                    >
                  </div>
                </div>
                
                <div class="mt-3">
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <input 
                    v-model="item.notes"
                    type="text" 
                    class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Special instructions for this item (optional)"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Type</label>
              <select 
                v-model="formData.deliveryType"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="standard">Standard</option>
                <option value="urgent">Urgent</option>
                <option value="express">Express</option>
                <option value="same-day">Same Day</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Amount</label>
              <input 
                v-model="formData.amount"
                type="number" 
                step="0.01"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Delivery Time</label>
              <input 
                v-model="formData.expectedDeliveryTime"
                type="datetime-local"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select 
                v-model="formData.priority"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Notes</label>
            <textarea 
              v-model="formData.deliveryNotes"
              rows="3"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any special instructions or notes"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              @click="closeModal"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Creating...' : 'Create Delivery' }}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>

    <!-- Customer Selection Modal -->
    <div v-if="showCustomerModal" class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl mx-4 max-h-[80vh] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <User class="h-5 w-5 mr-2 text-blue-600" />
            Select Customer
          </h3>
          <button 
            type="button"
            @click="closeCustomerModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Search and Content -->
        <div class="flex-1 overflow-hidden flex flex-col p-6">
          <!-- Search Input -->
          <div class="relative mb-4">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              v-model="customerSearch"
              type="text" 
              class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Search customers by name, phone, or email..."
            >
          </div>

          <!-- Customer List -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="filteredCompanyCustomers.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <p class="text-lg">No customers found</p>
              <p class="text-sm mt-1">{{ customerSearch ? `Try a different search term` : 'No customers available' }}</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                v-for="customer in filteredCompanyCustomers"
                :key="customer.id"
                type="button"
                @click="selectCustomerFromModal(customer)"
                class="text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center">
                    <User class="h-5 w-5 mr-2 text-blue-600" />
                    {{ customer.name }}
                    <span v-if="customer.customer_code" class="ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {{ customer.customer_code }}
                    </span>
                  </div>
                  <svg class="h-4 w-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <div class="flex items-center mb-1">
                    <Phone class="h-3 w-3 mr-1" />
                    {{ customer.mobile_no }}
                  </div>
                  <div v-if="customer.email" class="flex items-center">
                    <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                    </svg>
                    {{ customer.email }}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pickup Address Selection Modal -->
    <div v-if="showPickupAddressModal" class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl mx-4 max-h-[80vh] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <MapPin class="h-5 w-5 mr-2 text-blue-600" />
            Select Pickup Address
          </h3>
          <button 
            type="button"
            @click="closePickupAddressModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Search and Content -->
        <div class="flex-1 overflow-hidden flex flex-col p-6">
          <!-- Search Input -->
          <div class="relative mb-4">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              v-model="pickupAddressSearch"
              type="text" 
              class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Search by address label or location..."
              @input="pickupAddressSearch = $event.target.value"
            >
          </div>

          <!-- Address List -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="filteredPickupAddresses.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <p class="text-lg">No addresses found</p>
              <p class="text-sm mt-1">{{ pickupAddressSearch ? `Try a different search term` : 'No saved addresses available' }}</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                v-for="address in filteredPickupAddresses"
                :key="address.id"
                type="button"
                @click="selectPickupAddressFromModal(address)"
                class="text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center">
                    <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ address.label }}
                  </div>
                  <svg class="h-4 w-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ address.address }}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Drop Address Selection Modal -->
    <div v-if="showDropAddressModal" class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl mx-4 max-h-[80vh] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Navigation class="h-5 w-5 mr-2 text-green-600" />
            Select Customer Address
          </h3>
          <button 
            type="button"
            @click="closeDropAddressModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Search and Content -->
        <div class="flex-1 overflow-hidden flex flex-col p-6">
          <!-- Search Input -->
          <div class="relative mb-4">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              v-model="dropAddressSearch"
              type="text" 
              class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Search customer addresses..."
            >
          </div>

          <!-- Address List -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="filteredDropAddresses.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <p class="text-lg">No addresses found</p>
              <p class="text-sm mt-1">{{ dropAddressSearch ? `Try a different search term` : 'No customer addresses available' }}</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                v-for="address in filteredDropAddresses"
                :key="address.id"
                type="button"
                @click="selectDropAddressFromModal(address)"
                class="text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 group"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 flex items-center">
                    <svg class="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ address.label }}
                  </div>
                  <svg class="h-4 w-4 text-gray-400 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ address.address }}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Items Selection Modal -->
    <div v-if="showItemsModal" class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl mx-4 max-h-[85vh] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Package class="h-5 w-5 mr-2 text-blue-600" />
            Select Item from Catalog
          </h3>
          <button 
            type="button"
            @click="closeItemsModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Search and Content -->
        <div class="flex-1 overflow-hidden flex flex-col p-6">
          <!-- Search Input -->
          <div class="relative mb-4">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              v-model="itemSearch"
              type="text" 
              class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Search by item name, code, or description..."
            >
          </div>

          <!-- Items Grid -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="filteredCompanyItems.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2m0 0v1"></path>
              </svg>
              <p class="text-lg">No items found</p>
              <p class="text-sm mt-1">{{ itemSearch ? `No items match "${itemSearch}"` : 'No items available in catalog' }}</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                v-for="item in filteredCompanyItems"
                :key="item.id"
                type="button"
                @click="selectItemFromModal(item)"
                class="text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group hover:shadow-md"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center">
                    <svg class="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    <span class="truncate">{{ item.name }}</span>
                  </div>
                  <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded flex-shrink-0 ml-2">
                    {{ item.unit || 'pcs' }}
                  </span>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span class="font-mono bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded text-xs">{{ item.code }}</span>
                </div>
                <div v-if="item.description" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ item.description }}
                </div>
                <div class="flex items-center justify-end mt-3">
                  <svg class="h-4 w-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Search, 
  User, 
  Package, 
  Clock, 
  Phone, 
  MapPin,
  Navigation
} from 'lucide-vue-next'
import FilterForm from '../components/FilterForm.vue'
import Pagination from '../components/Pagination.vue'
import { useDashboardStore } from '../stores/dashboard'
import { 
  fetchCompanyAddresses, 
  fetchCompanyItems, 
  fetchCustomerAddresses,
  fetchCompanyCustomers,
  fetchCompanyDeliverymen,
  createDelivery,
  validateItem 
} from '../api/delivery'
import * as deliveryValidation from '../utils/deliveryValidation'

export default {
  name: 'Deliveries',
  components: {
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus,
    Search,
    User,
    Package,
    Clock,
    Phone,
    MapPin,
    Navigation,
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
      showCustomerModal: false,
      showPickupAddressModal: false,
      showDropAddressModal: false,
      showItemsModal: false,
      currentPage: 1,
      viewMode: 'table', // 'table' or 'grid'
      isSubmitting: false,
      companyAddresses: [],
      companyItems: [],
      companyCustomers: [],
      companyDeliverymen: [],
      customerAddresses: [],
      selectedPickupAddress: '',
      selectedCustomerAddress: '',
      customerSearch: '',
      pickupAddressSearch: '',
      dropAddressSearch: '',
      itemSearch: '',
      currentItemIndex: 0, // Track which item is being edited
      currentEditingItemIndex: null, // Track which item index is being edited via modal
      showAllItems: false,
      searchTimeout: null,
      filters: {
        search: '',
        status: '',
        deliveryman: '',
        priority: '',
        fromDate: '',
        toDate: '',
        perPage: '12'
      },
      formData: {
        customerId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerCode: '',
        isCustomerLocked: false,
        deliverymanId: '',
        pickupLabel: '',
        pickupAddress: '',
        dropLabel: '',
        dropAddress: '',
        deliveryType: 'standard',
        expectedDeliveryTime: '',
        amount: '',
        priority: 'medium',
        deliveryNotes: '',
        items: []
      },
      statusOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'in-transit', label: 'In Transit' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    }
  },
  computed: {
    filteredDeliveries() {
      let filtered = [...this.store.deliveries]
      
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(delivery => 
          delivery.id.toLowerCase().includes(search) ||
          delivery.customerName.toLowerCase().includes(search) ||
          delivery.customerPhone.includes(search) ||
          delivery.deliverymanName.toLowerCase().includes(search) ||
          delivery.pickupAddress.toLowerCase().includes(search) ||
          delivery.deliveryAddress.toLowerCase().includes(search)
        )
      }
      
      if (this.filters.status) {
        filtered = filtered.filter(delivery => delivery.status === this.filters.status)
      }
      
      if (this.filters.deliveryman) {
        filtered = filtered.filter(delivery => delivery.deliverymanName === this.filters.deliveryman)
      }
      
      if (this.filters.priority) {
        filtered = filtered.filter(delivery => delivery.priority === this.filters.priority)
      }
      
      if (this.filters.fromDate) {
        filtered = filtered.filter(delivery => 
          new Date(delivery.createdAt) >= new Date(this.filters.fromDate)
        )
      }
      
      if (this.filters.toDate) {
        filtered = filtered.filter(delivery => 
          new Date(delivery.createdAt) <= new Date(this.filters.toDate)
        )
      }
      
      return filtered
    },
    totalPages() {
      return Math.ceil(this.filteredDeliveries.length / parseInt(this.filters.perPage))
    },
    paginatedDeliveries() {
      const start = (this.currentPage - 1) * parseInt(this.filters.perPage)
      const end = start + parseInt(this.filters.perPage)
      return this.filteredDeliveries.slice(start, end)
    },
    // Filtered address computed properties
    filteredCompanyCustomers() {
      if (!this.customerSearch) return this.companyCustomers
      
      const search = this.customerSearch.toLowerCase()
      return this.companyCustomers.filter(customer => 
        customer.name.toLowerCase().includes(search) ||
        customer.mobile_no.toLowerCase().includes(search) ||
        (customer.email && customer.email.toLowerCase().includes(search)) ||
        (customer.customer_code && customer.customer_code.toLowerCase().includes(search))
      )
    },
    filteredPickupAddresses() {
      if (!this.pickupAddressSearch) return this.companyAddresses
      
      const search = this.pickupAddressSearch.toLowerCase()
      return this.companyAddresses.filter(address => 
        address.label.toLowerCase().includes(search) ||
        address.address.toLowerCase().includes(search)
      )
    },
    filteredDropAddresses() {
      if (!this.dropAddressSearch) return this.customerAddresses
      
      const search = this.dropAddressSearch.toLowerCase()
      return this.customerAddresses.filter(address => 
        address.label.toLowerCase().includes(search) ||
        address.address.toLowerCase().includes(search)
      )
    },
    // Filtered items computed properties
    filteredCompanyItems() {
      if (!this.itemSearch) return this.companyItems
      
      const search = this.itemSearch.toLowerCase()
      return this.companyItems.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.code.toLowerCase().includes(search) ||
        (item.description && item.description.toLowerCase().includes(search)) ||
        (item.unit && item.unit.toLowerCase().includes(search))
      )
    },
    // Items management computed properties
    completedItems() {
      return this.formData.items.filter((item, index) => index < this.currentItemIndex && this.isItemComplete(item))
    },
    currentItem() {
      return this.formData.items[this.currentItemIndex] || this.createEmptyItem()
    },
    isCurrentItemValid() {
      const item = this.currentItem
      return item.name && item.code && item.quantity && parseInt(item.quantity) > 0 && !item.nameError && !item.codeError
    },
    canAddNewItem() {
      if (this.formData.items.length === 0) return true
      const lastItem = this.formData.items[this.formData.items.length - 1]
      return this.isItemComplete(lastItem)
    },
    hasCustomerInfo() {
      return this.formData.customerId || (this.formData.customerName && this.formData.customerPhone)
    }
  },
  async mounted() {
    // Load deliverymen for filtering on component mount
    await this.loadCompanyDeliverymen()
  },
  methods: {
    async loadCompanyAddresses() {
      try {
        const response = await fetchCompanyAddresses()
        if (response.success) {
          this.companyAddresses = response.data.data || response.data
        }
      } catch (error) {
        console.error('Error loading company addresses:', error)
      }
    },

    async loadCompanyItems() {
      try {
        const response = await fetchCompanyItems()
        if (response.success) {
          this.companyItems = response.data.data || response.data
        }
      } catch (error) {
        console.error('Error loading company items:', error)
      }
    },

    async loadCompanyCustomers() {
      try {
        const response = await fetchCompanyCustomers()
        if (response.success) {
          this.companyCustomers = response.data.data || response.data
        }
      } catch (error) {
        console.error('Error loading company customers:', error)
      }
    },

    async loadCompanyDeliverymen() {
      try {
        const response = await fetchCompanyDeliverymen()
        if (response.success) {
          this.companyDeliverymen = response.data.data || response.data
        }
      } catch (error) {
        console.error('Error loading company deliverymen:', error)
      }
    },

    async loadCustomerAddresses() {
      if (this.formData.customerId) {
        try {
          const response = await fetchCustomerAddresses(this.formData.customerId)
          if (response.success) {
            this.customerAddresses = response.data
          }
        } catch (error) {
          console.error('Error loading customer addresses:', error)
        }
      }
    },

    onPickupAddressSelect() {
      if (this.selectedPickupAddress) {
        const selectedAddress = this.companyAddresses.find(addr => addr.id == this.selectedPickupAddress)
        if (selectedAddress) {
          this.formData.pickupLabel = selectedAddress.label
          this.formData.pickupAddress = selectedAddress.address
        }
      }
    },

    onCustomerAddressSelect() {
      if (this.selectedCustomerAddress) {
        const selectedAddress = this.customerAddresses.find(addr => addr.id == this.selectedCustomerAddress)
        if (selectedAddress) {
          this.formData.dropLabel = selectedAddress.label
          this.formData.dropAddress = selectedAddress.address
        }
      }
    },

    // Modal management methods
    async openCustomerModal() {
      this.showCustomerModal = true
      this.customerSearch = ''
      // Load data only when modal is opened
      await this.loadCompanyCustomers()
    },

    closeCustomerModal() {
      this.showCustomerModal = false
      this.customerSearch = ''
    },

    async openPickupAddressModal() {
      this.showPickupAddressModal = true
      this.pickupAddressSearch = ''
      // Load data only when modal is opened
      await this.loadCompanyAddresses()
    },

    closePickupAddressModal() {
      this.showPickupAddressModal = false
      this.pickupAddressSearch = ''
    },

    async openDropAddressModal() {
      this.showDropAddressModal = true
      this.dropAddressSearch = ''
      // Load customer addresses only when modal is opened
      await this.loadCustomerAddresses()
    },

    closeDropAddressModal() {
      this.showDropAddressModal = false
      this.dropAddressSearch = ''
    },

    async openItemsModal() {
      this.showItemsModal = true
      this.itemSearch = ''
      this.currentEditingItemIndex = null
      // Load items only when modal is opened
      await this.loadCompanyItems()
    },

    async openItemsModalForIndex(index) {
      this.showItemsModal = true
      this.itemSearch = ''
      this.currentEditingItemIndex = index
      // Load items only when modal is opened
      await this.loadCompanyItems()
    },

    closeItemsModal() {
      this.showItemsModal = false
      this.itemSearch = ''
      this.currentEditingItemIndex = null
    },

    // Enhanced selection methods for modals
    selectCustomerFromModal(customer) {
      this.selectCustomer(customer)
      this.closeCustomerModal()
    },

    selectPickupAddressFromModal(address) {
      this.selectPickupAddress(address)
      this.closePickupAddressModal()
    },

    selectDropAddressFromModal(address) {
      this.selectDropAddress(address)
      this.closeDropAddressModal()
    },

    selectItemFromModal(item) {
      this.selectCatalogItem(item)
      this.closeItemsModal()
    },

    addItem() {
      // Add new empty item if we're at the end of the items array
      if (this.currentItemIndex >= this.formData.items.length) {
        this.formData.items.push(this.createEmptyItem())
      }
    },

    createEmptyItem() {
      return {
        selectedCatalogItem: '',
        itemId: '',
        isNewItem: true,
        isLocked: false,
        isCompleted: false,
        name: '',
        code: '',
        unit: '',
        itemNotes: '',
        quantity: 1,
        notes: '',
        nameError: '',
        codeError: ''
      }
    },

    addNewItem() {
      // Only add new item if the last item is complete
      if (this.canAddNewItem) {
        this.formData.items.push(this.createEmptyItem())
      }
    },

    removeItem(index) {
      this.formData.items.splice(index, 1)
      // If no items left, add one empty item
      if (this.formData.items.length === 0) {
        this.formData.items.push(this.createEmptyItem())
      }
    },

    validateItemName(item, index) {
      // Don't validate locked catalog items
      if (item.isLocked) return
      
      if (!item.name || item.name.trim() === '') {
        item.nameError = 'Item name is required'
      } else {
        item.nameError = ''
      }
      // Force reactivity update
      this.$forceUpdate()
    },

    validateItemCode(item, index) {
      // Don't validate locked catalog items
      if (item.isLocked) return
      
      if (!item.code || item.code.trim() === '') {
        item.codeError = 'Item code is required'
      } else {
        item.codeError = ''
      }
      // Force reactivity update
      this.$forceUpdate()
    },

    removeCurrentItem() {
      if (this.formData.items.length > 1) {
        this.formData.items.splice(this.currentItemIndex, 1)
        // Adjust current index if needed
        if (this.currentItemIndex >= this.formData.items.length) {
          this.currentItemIndex = Math.max(0, this.formData.items.length - 1)
        }
      }
    },

    editItem(index) {
      this.currentItemIndex = index
      const item = this.formData.items[index]
      item.isCompleted = false
      item.isLocked = false
    },

    completeCurrentItem() {
      if (this.isCurrentItemValid) {
        const item = this.currentItem
        item.isCompleted = true
        item.isLocked = true
        this.currentItemIndex++
        
        // Create next item if we're at the end
        if (this.currentItemIndex >= this.formData.items.length) {
          // Don't auto-add, let user click "Add Another Item"
        }
      }
    },

    unlockCurrentItem() {
      const item = this.currentItem
      item.isLocked = false
    },

    isItemComplete(item) {
      return item.name && item.name.trim() !== '' && 
             item.code && item.code.trim() !== '' && 
             item.quantity && parseInt(item.quantity) > 0 &&
             !item.nameError && !item.codeError
    },

    selectCustomer(customer) {
      this.formData.customerId = customer.id
      this.formData.customerName = customer.name
      this.formData.customerPhone = customer.phone
      this.formData.customerEmail = customer.email || ''
      this.formData.isCustomerLocked = true
      // Load customer addresses when customer is selected
      this.loadCustomerAddresses()
    },

    selectPickupAddress(address) {
      this.formData.pickupLabel = address.label
      this.formData.pickupAddress = address.address
      this.selectedPickupAddress = address.id
    },

    selectCustomer(customer) {
      // Fill customer data from selected customer and lock fields
      this.formData.customerId = customer.id
      this.formData.customerName = customer.name
      this.formData.customerPhone = customer.mobile_no
      this.formData.customerEmail = customer.email || ''
      this.formData.customerCode = customer.customer_code || ''
      this.formData.isCustomerLocked = true
      
      // Clear customer addresses since we now have a different customer
      this.customerAddresses = []
      this.selectedCustomerAddress = ''
    },

    clearCustomerSelection() {
      // Reset customer fields for manual entry
      this.formData.customerId = ''
      this.formData.customerName = ''
      this.formData.customerPhone = ''
      this.formData.customerEmail = ''
      this.formData.customerCode = ''
      this.formData.isCustomerLocked = false
      
      // Clear customer addresses
      this.customerAddresses = []
      this.selectedCustomerAddress = ''
    },

    selectDropAddress(address) {
      this.formData.dropLabel = address.label
      this.formData.dropAddress = address.address
      this.selectedCustomerAddress = address.id
    },

    selectCatalogItem(item) {
      // Use the currentEditingItemIndex to target the correct item
      const targetIndex = this.currentEditingItemIndex !== null ? this.currentEditingItemIndex : 0
      const targetItem = this.formData.items[targetIndex]
      
      if (targetItem) {
        // Populate fields from catalog item and lock them
        targetItem.itemId = item.id
        targetItem.name = item.name
        targetItem.code = item.code
        targetItem.unit = item.unit || 'pcs'
        targetItem.itemNotes = item.description || ''
        targetItem.isNewItem = false
        targetItem.isLocked = true // Lock fields when item is from catalog
        targetItem.nameError = ''
        targetItem.codeError = ''
        targetItem.selectedCatalogItem = item.id
        
        // Force reactivity update
        this.$forceUpdate()
      }
    },

    validateCurrentItemName() {
      const item = this.currentItem
      if (!item.name || !item.isNewItem || item.isLocked) return
      
      // Use client-side validation first for immediate feedback
      const localValidation = deliveryValidation.validateItemUniqueness(item.name, null, this.companyItems)
      item.nameError = localValidation.nameError
      
      // Then use API validation for server-side check
      deliveryValidation.debounceValidation(`name-current`, async () => {
        try {
          const response = await validateItem(item.name, null)
          if (!response.success && response.message.includes('name')) {
            item.nameError = 'Item name already exists for this company'
          } else if (!localValidation.nameError) {
            item.nameError = ''
          }
        } catch (error) {
          console.error('Error validating item name:', error)
        }
      })
    },

    validateCurrentItemCode() {
      const item = this.currentItem
      if (!item.code || !item.isNewItem || item.isLocked) return
      
      // Use client-side validation first for immediate feedback
      const localValidation = deliveryValidation.validateItemUniqueness(null, item.code, this.companyItems)
      item.codeError = localValidation.codeError
      
      // Then use API validation for server-side check
      deliveryValidation.debounceValidation(`code-current`, async () => {
        try {
          const response = await validateItem(null, item.code)
          if (!response.success && response.message.includes('code')) {
            item.codeError = 'Item code already exists for this company'
          } else if (!localValidation.codeError) {
            item.codeError = ''
          }
        } catch (error) {
          console.error('Error validating item code:', error)
        }
      })
    },

    async addDelivery() {
      // Validate form using validation utility
      const validationErrors = deliveryValidation.validateDeliveryForm(this.formData)
      
      if (validationErrors.length > 0) {
        alert(deliveryValidation.formatValidationErrors(validationErrors))
        return
      }

      // Check for item validation errors
      const hasItemErrors = this.formData.items.some(item => 
        item.isNewItem && (item.nameError || item.codeError)
      )
      
      if (hasItemErrors) {
        alert('Please fix item validation errors before submitting')
        return
      }

      // Check if all items are completed
      const hasIncompleteItems = this.formData.items.some(item => !this.isItemComplete(item))
      
      if (hasIncompleteItems) {
        alert('Please complete all items before submitting the delivery')
        return
      }

      this.isSubmitting = true
      
      try {
        // Prepare payload according to API format
        const payload = {
          customer_id: this.formData.customerId ? parseInt(this.formData.customerId) : null,
          customer_name: this.formData.customerName,
          customer_phone: this.formData.customerPhone,
          customer_email: this.formData.customerEmail || null,
          pickup_address: this.formData.pickupAddress,
          pickup_label: this.formData.pickupLabel || null,
          delivery_address: this.formData.dropAddress,
          delivery_label: this.formData.dropLabel || null,
          delivery_type: this.formData.deliveryType,
          expected_delivery_time: this.formData.expectedDeliveryTime || null,
          amount: this.formData.amount ? parseFloat(this.formData.amount) : null,
          priority: this.formData.priority,
          delivery_notes: this.formData.deliveryNotes || null,
          deliveryman_id: this.formData.deliverymanId ? parseInt(this.formData.deliverymanId) : null,
          items: this.formData.items.map(item => ({
            item_id: item.itemId || null,
            name: item.name,
            code: item.code,
            unit: item.unit || 'pcs',
            quantity: parseInt(item.quantity),
            notes: item.notes || null,
            description: item.itemNotes || null
          }))
        }

        const response = await createDelivery(payload)
        
        if (response.success) {
          // Add to store
          this.store.addDelivery(response.data)
          
          alert('Delivery created successfully!')
          this.closeModal()
        } else {
          throw new Error(response.message || 'Failed to create delivery')
        }
      } catch (error) {
        console.error('Error creating delivery:', error)
        alert('Error creating delivery. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },

    closeModal() {
      this.showAddModal = false
      // Close all sub-modals
      this.showCustomerModal = false
      this.showPickupAddressModal = false
      this.showDropAddressModal = false
      this.showItemsModal = false
      this.companyCustomers = []
      this.companyDeliverymen = []
      this.customerAddresses = []
      this.selectedPickupAddress = ''
      this.selectedCustomerAddress = ''
      // Reset search states
      this.customerSearch = ''
      this.pickupAddressSearch = ''
      this.dropAddressSearch = ''
      this.itemSearch = ''
      this.currentItemIndex = 0
      this.showAllItems = false
      // Clear any search timeouts
      clearTimeout(this.searchTimeout)
      this.formData = {
        customerId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerCode: '',
        isCustomerLocked: false,
        deliverymanId: '',
        pickupLabel: '',
        pickupAddress: '',
        dropLabel: '',
        dropAddress: '',
        deliveryType: 'standard',
        expectedDeliveryTime: '',
        amount: '',
        priority: 'medium',
        deliveryNotes: '',
        items: []
      }
    },

    async openAddModal() {
      this.showAddModal = true
      this.currentItemIndex = 0
      // Reset search states when opening modal
      this.customerSearch = ''
      this.pickupAddressSearch = ''
      this.dropAddressSearch = ''
      this.itemSearch = ''
      // Close any sub-modals
      this.showCustomerModal = false
      this.showPickupAddressModal = false
      this.showDropAddressModal = false
      this.showItemsModal = false
      clearTimeout(this.searchTimeout)
      
      // Only load deliverymen for the main form dropdown
      // Customer, address and item data will be loaded when their respective modals are opened
      await this.loadCompanyDeliverymen()
      
      // Initialize with one empty item for immediate entry
      this.formData.items = [this.createEmptyItem()]
    },

    handleFilterChange(newFilters) {
      this.filters = { ...newFilters }
      this.currentPage = 1
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    getStatusColor(status) {
      const colors = {
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'assigned': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'in-transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }
      return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    getPriorityColor(priority) {
      const colors = {
        'low': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }
      return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    async assignDelivery(deliveryId, deliverymanId) {
      try {
        await this.store.assignDelivery(deliveryId, deliverymanId)
        alert('Delivery assigned successfully!')
      } catch (error) {
        console.error('Error assigning delivery:', error)
        alert('Error assigning delivery. Please try again.')
      }
    },
    async completeDelivery(deliveryId) {
      try {
        await this.store.completeDelivery(deliveryId)
        alert('Delivery completed successfully!')
      } catch (error) {
        console.error('Error completing delivery:', error)
        alert('Error completing delivery. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
