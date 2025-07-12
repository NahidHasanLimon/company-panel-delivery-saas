<template>
  <div class="space-y-6">
    <!-- Form Content -->
    <form @submit.prevent="createDelivery" class="space-y-6">
        
        <!-- Main Content Layout -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          <!-- Left Column (2/3 width) -->
          <div class="xl:col-span-2 space-y-6">
            
            <!-- Customer Information -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Customer Information
                  </h2>
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
                    class="inline-flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                    title="Choose from existing customers"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                    {{ formData.isCustomerLocked ? 'Change Customer' : 'Browse Customers' }}
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Name *</label>
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
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
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
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
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
            </div>

            <!-- Pickup and Drop-off Information -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Pickup Address -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Pickup Information
                  </h2>
                  <button
                    type="button"
                    @click="openPickupAddressModal"
                    class="inline-flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                    title="Choose from saved addresses"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H5m14 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12"></path>
                    </svg>
                    Browse Saved
                  </button>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Label</label>
                    <input 
                      v-model="formData.pickupLabel"
                      type="text" 
                      class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Main Warehouse, Office Building"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pickup Address *</label>
                    <textarea 
                      v-model="formData.pickupAddress"
                      required
                      rows="3"
                      class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Enter complete pickup address with building number, street, city, state, ZIP"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Drop-off Address -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Drop-off Information
                    <span v-if="!hasCustomerInfo" class="ml-2 text-xs text-yellow-600 dark:text-yellow-400 font-normal">
                      (Enter customer info for saved addresses)
                    </span>
                  </h2>
                  <button
                    v-if="hasCustomerInfo"
                    type="button"
                    @click="openDropAddressModal"
                    class="inline-flex items-center px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors border border-green-200 dark:border-green-800"
                    title="Choose from customer addresses"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Browse Saved
                  </button>
                </div>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address Label</label>
                    <input 
                      v-model="formData.dropLabel"
                      type="text" 
                      class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Customer Office, Home, Warehouse"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Drop-off Address *</label>
                    <textarea 
                      v-model="formData.dropAddress"
                      required
                      rows="3"
                      class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Enter complete drop-off address with building number, street, city, state, ZIP"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Items Information -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  Items to Deliver
                </h2>
                <button
                  type="button"
                  @click="openItemsModal"
                  class="inline-flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                  title="Browse item catalog"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  From Catalog
                </button>
              </div>
              
              <div class="space-y-4">
                <div 
                  v-for="(item, index) in formData.items" 
                  :key="`item-${index}`"
                  class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 relative"
                >
                  <!-- Remove item button -->
                  <button 
                    v-if="formData.items.length > 1"
                    type="button"
                    @click="removeItem(index)"
                    class="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Remove item"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>

                  <!-- Item header -->
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">Item {{ index + 1 }}</span>
                      <span v-if="item.isLocked && item.code" class="ml-2 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                        {{ item.code }}
                      </span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        v-if="item.isLocked"
                        type="button"
                        @click="clearItemSelection(index)"
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
                        @click="openItemsModalForIndex(index)"
                        class="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                        title="Choose from catalog"
                      >
                        <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                        {{ item.isLocked ? 'Change' : 'Catalog' }}
                      </button>
                    </div>
                  </div>

                  <!-- Item fields -->
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div class="lg:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Name *</label>
                      <input 
                        v-model="item.name"
                        type="text"
                        required
                        :disabled="item.isLocked"
                        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        :class="{ 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed': item.isLocked }"
                        placeholder="Enter item name"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
                      <input 
                        v-model="item.unit"
                        type="text"
                        :disabled="item.isLocked"
                        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        :class="{ 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed': item.isLocked }"
                        placeholder="e.g., pcs, kg, box"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity *</label>
                      <input 
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        required
                        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="1"
                      >
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Notes</label>
                    <textarea 
                      v-model="item.notes"
                      rows="2"
                      class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Special handling instructions, fragile items, etc."
                    ></textarea>
                  </div>
                </div>
                
                <!-- Add Item Button -->
                <button
                  type="button"
                  @click="addNewItem"
                  class="inline-flex items-center px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-sm"
                >
                  <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Another Item
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column (1/3 width) -->
          <div class="xl:col-span-1">
            <!-- Delivery Details -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Delivery Details
              </h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Type</label>
                  <select 
                    v-model="formData.deliveryType"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="standard">Standard Delivery</option>
                    <option value="express">Express Delivery</option>
                    <option value="overnight">Overnight Delivery</option>
                    <option value="scheduled">Scheduled Delivery</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                  <select 
                    v-model="formData.priority"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Delivery Time</label>
                  <input 
                    v-model="formData.expectedDeliveryTime"
                    type="datetime-local"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Amount</label>
                  <input 
                    v-model.number="formData.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery Notes</label>
                  <textarea 
                    v-model="formData.deliveryNotes"
                    rows="4"
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Special delivery instructions, contact information, access codes, etc."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions - Bottom -->
        <div class="mt-8 flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="createDelivery"
            :disabled="isSubmitting"
            type="button"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center font-medium shadow-sm"
          >
            <svg v-if="isSubmitting" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Creating...' : 'Create Delivery' }}
          </button>
        </div>

      </form>

    <!-- Customer Selection Modal -->
    <div v-if="showCustomerModal" class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl mx-4 max-h-[80vh] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
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
                    <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
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
                    <svg class="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
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
          
          <!-- Customer Pagination -->
          <div v-if="customerPagination.lastPage > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Page {{ customerPagination.currentPage }} of {{ customerPagination.lastPage }} 
              ({{ customerPagination.total }} customers total)
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="previousCustomerPage"
                :disabled="customerPagination.currentPage <= 1"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ customerPagination.currentPage }} / {{ customerPagination.lastPage }}
              </span>
              <button
                @click="nextCustomerPage"
                :disabled="customerPagination.currentPage >= customerPagination.lastPage"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pickup Address Modal -->
    <div v-if="showPickupAddressModal" class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl mx-4 max-h-[80vh] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
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

    <!-- Drop-off Address Modal -->
    <div v-if="showDropAddressModal" class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl mx-4 max-h-[80vh] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <svg class="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
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

    <!-- Items Modal -->
    <div v-if="showItemsModal" class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl mx-4 max-h-[85vh] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
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
              placeholder="Search items by name, code, or description..."
            >
          </div>

          <!-- Item List -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="filteredCompanyItems.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <p class="text-lg">No items found</p>
              <p class="text-sm mt-1">{{ itemSearch ? `Try a different search term` : 'No items available in catalog' }}</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                v-for="item in filteredCompanyItems"
                :key="item.id"
                type="button"
                @click="selectItemFromModal(item)"
                class="text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center">
                    <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    {{ item.name }}
                  </div>
                  <svg class="h-4 w-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div v-if="item.code" class="flex items-center">
                    <span class="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ item.code }}</span>
                    <span v-if="item.unit" class="ml-2">Unit: {{ item.unit }}</span>
                  </div>
                  <div v-if="item.description" class="text-xs">{{ item.description }}</div>
                </div>
              </button>
            </div>
          </div>
          
          <!-- Items Pagination -->
          <div v-if="itemsPagination.lastPage > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Page {{ itemsPagination.currentPage }} of {{ itemsPagination.lastPage }} 
              ({{ itemsPagination.total }} items total)
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="previousItemsPage"
                :disabled="itemsPagination.currentPage <= 1"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ itemsPagination.currentPage }} / {{ itemsPagination.lastPage }}
              </span>
              <button
                @click="nextItemsPage"
                :disabled="itemsPagination.currentPage >= itemsPagination.lastPage"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useDashboardStore } from '../stores/dashboard'
import { useToastStore } from '../stores/toast'
import { 
  getCompanyAddresses, 
  getCompanyItems, 
  getCompanyCustomers, 
  getCustomerAddresses,
  createDelivery as apiCreateDelivery
} from '../api/delivery'

export default {
  name: 'CreateDelivery',
  setup() {
    const store = useDashboardStore()
    const toastStore = useToastStore()
    return { store, toastStore }
  },
  data() {
    return {
      isSubmitting: false,
      showCustomerModal: false,
      showPickupAddressModal: false,
      showDropAddressModal: false,
      showItemsModal: false,
      
      // Search filters
      customerSearch: '',
      pickupAddressSearch: '',
      dropAddressSearch: '',
      itemSearch: '',
      
      // Pagination state
      customerPagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 20,
        total: 0
      },
      itemsPagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 20,
        total: 0
      },
      
      // Data arrays
      companyAddresses: [],
      companyItems: [],
      companyCustomers: [],
      customerAddresses: [],
      
      // Modal editing state
      currentEditingItemIndex: null,
      
      formData: {
        customerId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerCode: '',
        isCustomerLocked: false,
        pickupAddressId: '',
        pickupLabel: '',
        pickupAddress: '',
        dropAddressId: '',
        dropLabel: '',
        dropAddress: '',
        deliveryType: 'standard',
        expectedDeliveryTime: '',
        amount: '',
        priority: 'medium',
        deliveryNotes: '',
        items: [this.createEmptyItem()]
      }
    }
  },
  computed: {
    hasCustomerInfo() {
      return this.formData.customerId || (this.formData.customerName && this.formData.customerPhone)
    },
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
    filteredCompanyItems() {
      if (!this.itemSearch) return this.companyItems
      
      const search = this.itemSearch.toLowerCase()
      return this.companyItems.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.code.toLowerCase().includes(search) ||
        (item.description && item.description.toLowerCase().includes(search)) ||
        (item.unit && item.unit.toLowerCase().includes(search))
      )
    }
  },
  watch: {
    // Clear pickup address ID when address is manually edited
    'formData.pickupAddress': function(newVal, oldVal) {
      if (newVal !== oldVal && this.formData.pickupAddressId) {
        this.formData.pickupAddressId = ''
      }
    },
    // Clear drop address ID when address is manually edited  
    'formData.dropAddress': function(newVal, oldVal) {
      if (newVal !== oldVal && this.formData.dropAddressId) {
        this.formData.dropAddressId = ''
      }
    }
  },
  methods: {
    createEmptyItem() {
      return {
        selectedCatalogItem: '',
        itemId: '',
        isNewItem: true,
        isLocked: false,
        name: '',
        code: '',
        unit: '',
        quantity: 1,
        notes: ''
      }
    },
    
    // Modal management methods
    async openCustomerModal() {
      this.showCustomerModal = true
      this.customerSearch = ''
      await this.loadCompanyCustomers()
    },
    closeCustomerModal() {
      this.showCustomerModal = false
      this.customerSearch = ''
    },
    
    async openPickupAddressModal() {
      this.showPickupAddressModal = true
      this.pickupAddressSearch = ''
      await this.loadCompanyAddresses()
    },
    closePickupAddressModal() {
      this.showPickupAddressModal = false
      this.pickupAddressSearch = ''
    },
    
    async openDropAddressModal() {
      this.showDropAddressModal = true
      this.dropAddressSearch = ''
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
      await this.loadCompanyItems()
    },
    async openItemsModalForIndex(index) {
      this.showItemsModal = true
      this.itemSearch = ''
      this.currentEditingItemIndex = index
      await this.loadCompanyItems()
    },
    closeItemsModal() {
      this.showItemsModal = false
      this.itemSearch = ''
      this.currentEditingItemIndex = null
    },
    
    // Pagination methods
    async nextCustomerPage() {
      if (this.customerPagination.currentPage < this.customerPagination.lastPage) {
        await this.loadCompanyCustomers(this.customerPagination.currentPage + 1)
      }
    },
    async previousCustomerPage() {
      if (this.customerPagination.currentPage > 1) {
        await this.loadCompanyCustomers(this.customerPagination.currentPage - 1)
      }
    },
    async nextItemsPage() {
      if (this.itemsPagination.currentPage < this.itemsPagination.lastPage) {
        await this.loadCompanyItems(this.itemsPagination.currentPage + 1)
      }
    },
    async previousItemsPage() {
      if (this.itemsPagination.currentPage > 1) {
        await this.loadCompanyItems(this.itemsPagination.currentPage - 1)
      }
    },
    
    // Selection methods
    selectCustomerFromModal(customer) {
      this.formData.customerId = customer.id
      this.formData.customerName = customer.name
      this.formData.customerPhone = customer.mobile_no
      this.formData.customerEmail = customer.email || ''
      this.formData.customerCode = customer.customer_code || ''
      this.formData.isCustomerLocked = true
      this.closeCustomerModal()
    },
    
    selectPickupAddressFromModal(address) {
      this.formData.pickupAddressId = address.id
      this.formData.pickupLabel = address.label
      this.formData.pickupAddress = address.address
      this.closePickupAddressModal()
    },
    
    selectDropAddressFromModal(address) {
      this.formData.dropAddressId = address.id
      this.formData.dropLabel = address.label
      this.formData.dropAddress = address.address
      this.closeDropAddressModal()
    },
    
    selectItemFromModal(item) {
      const targetIndex = this.currentEditingItemIndex !== null ? this.currentEditingItemIndex : this.formData.items.length - 1
      
      this.formData.items[targetIndex] = {
        ...this.formData.items[targetIndex],
        selectedCatalogItem: item.id,
        itemId: item.id,
        isNewItem: false,
        isLocked: true,
        name: item.name,
        code: item.code,
        unit: item.unit || '',
        quantity: this.formData.items[targetIndex].quantity || 1
      }
      this.closeItemsModal()
    },
    
    // Clear selections
    clearCustomerSelection() {
      this.formData.customerId = ''
      this.formData.customerName = ''
      this.formData.customerPhone = ''
      this.formData.customerEmail = ''
      this.formData.customerCode = ''
      this.formData.isCustomerLocked = false
    },
    
    clearItemSelection(index) {
      this.formData.items[index] = {
        ...this.createEmptyItem(),
        quantity: this.formData.items[index].quantity || 1,
        notes: this.formData.items[index].notes || ''
      }
    },
    
    // Item management
    addNewItem() {
      this.formData.items.push(this.createEmptyItem())
    },
    
    removeItem(index) {
      this.formData.items.splice(index, 1)
      if (this.formData.items.length === 0) {
        this.formData.items.push(this.createEmptyItem())
      }
    },
    
    // Data loading methods
    async loadCompanyCustomers(page = 1) {
      console.log('Loading company customers page:', page)
      try {
        const response = await getCompanyCustomers({ page, per_page: this.customerPagination.perPage })
        console.log('Customer API response:', response)
        
        if (response && response.success) {
          const data = response.data
          // Handle both paginated and non-paginated responses
          if (data && data.data && Array.isArray(data.data)) {
            this.companyCustomers = data.data
            this.customerPagination = {
              currentPage: data.current_page || 1,
              lastPage: data.last_page || 1,
              perPage: data.per_page || 20,
              total: data.total || data.data.length
            }
          } else if (Array.isArray(data)) {
            this.companyCustomers = data
            this.customerPagination = {
              currentPage: 1,
              lastPage: 1,
              perPage: 20,
              total: data.length
            }
          } else {
            this.companyCustomers = []
          }
        } else {
          console.error('Customer API error:', response?.message || 'Unknown error')
          this.companyCustomers = []
        }
        
        console.log('Loaded customers:', this.companyCustomers.length, this.companyCustomers)
      } catch (error) {
        console.error('Error loading customers:', error)
        this.companyCustomers = []
      }
    },
    
    async loadCompanyAddresses() {
      try {
        // Load only the first page initially
        const response = await getCompanyAddresses({ page: 1, per_page: 100 })
        if (response && response.success) {
          const data = response.data
          // Handle both paginated and non-paginated responses
          if (data && data.data && Array.isArray(data.data)) {
            this.companyAddresses = data.data
          } else if (Array.isArray(data)) {
            this.companyAddresses = data
          } else {
            this.companyAddresses = []
          }
        } else {
          this.companyAddresses = []
        }
      } catch (error) {
        console.error('Error loading company addresses:', error)
        this.companyAddresses = []
      }
    },
    
    async loadCustomerAddresses() {
      if (!this.hasCustomerInfo) return
      
      try {
        const customerIdentifier = this.formData.customerId || this.formData.customerPhone
        const response = await getCustomerAddresses(customerIdentifier)
        this.customerAddresses = response.data || []
      } catch (error) {
        console.error('Error loading customer addresses:', error)
        this.customerAddresses = []
      }
    },
    
    async loadCompanyItems(page = 1) {
      try {
        const response = await getCompanyItems({ page, per_page: this.itemsPagination.perPage })
        if (response && response.success) {
          const data = response.data
          // Handle both paginated and non-paginated responses
          if (data && data.data && Array.isArray(data.data)) {
            this.companyItems = data.data
            this.itemsPagination = {
              currentPage: data.current_page || 1,
              lastPage: data.last_page || 1,
              perPage: data.per_page || 20,
              total: data.total || data.data.length
            }
          } else if (Array.isArray(data)) {
            this.companyItems = data
            this.itemsPagination = {
              currentPage: 1,
              lastPage: 1,
              perPage: 20,
              total: data.length
            }
          } else {
            this.companyItems = []
          }
        } else {
          this.companyItems = []
        }
      } catch (error) {
        console.error('Error loading items:', error)
        this.companyItems = []
      }
    },
    
    // Form submission
    async createDelivery() {
      if (this.isSubmitting) return
      
      try {
        this.isSubmitting = true
        
        // Validate required fields
        if (!this.formData.customerName || !this.formData.customerPhone) {
          throw new Error('Customer name and phone are required')
        }
        if (!this.formData.pickupAddress) {
          throw new Error('Pickup address is required')
        }
        if (!this.formData.dropAddress) {
          throw new Error('Drop-off address is required')
        }
        if (!this.formData.items.length || !this.formData.items.some(item => item.name)) {
          throw new Error('At least one item is required')
        }
        
        // Prepare payload
        const payload = {}
        
        // Customer - just the ID if existing customer, otherwise individual fields
        if (this.formData.customerId) {
          payload.customer_id = this.formData.customerId
        } else {
          // For new customers, use individual fields
          payload.customer_name = this.formData.customerName
          payload.customer_mobile_no = this.formData.customerPhone
          if (this.formData.customerEmail) {
            payload.customer_email = this.formData.customerEmail
          }
        }
        
        // Pickup address
        if (this.formData.pickupAddressId) {
          payload.pickup_address_id = this.formData.pickupAddressId
        } else {
          payload.pickup_label = this.formData.pickupLabel
          payload.pickup_address = this.formData.pickupAddress
        }
        
        // Drop-off address (always as separate fields based on sample)
        payload.drop_label = this.formData.dropLabel
        payload.drop_address = this.formData.dropAddress
        
        // Items - handle both existing and new items
        payload.items = this.formData.items.filter(item => item.name).map(item => {
          const itemPayload = {
            quantity: parseInt(item.quantity)
          }
          
          if (item.itemId && !item.isNewItem) {
            // Existing item from catalog
            itemPayload.item_id = item.itemId
            // Add delivery notes if present
            if (item.notes) {
              itemPayload.notes = item.notes
            }
          } else {
            // New item with full details
            itemPayload.name = item.name
            if (item.code) {
              itemPayload.code = item.code
            }
            if (item.unit) {
              itemPayload.unit = item.unit
            }
            // For new items, we can have both item_notes and delivery notes
            // Using the same notes field for both for simplicity, but could be split
            if (item.notes) {
              itemPayload.notes = item.notes
            }
          }
          
          return itemPayload
        })
        
        // Delivery details
        payload.delivery_type = this.formData.deliveryType
        payload.expected_delivery_time = this.formData.expectedDeliveryTime
        payload.amount = this.formData.amount ? parseFloat(this.formData.amount) : null
        payload.priority = this.formData.priority
        payload.delivery_notes = this.formData.deliveryNotes
        
        await apiCreateDelivery(payload)
        
        // Success - show success toast and redirect
        this.toastStore.success('Delivery created successfully!')
        this.$router.push('/deliveries')
        
      } catch (error) {
        console.error('Error creating delivery:', error)
        // Show error toast instead of alert
        this.toastStore.error(error.message || 'Failed to create delivery. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    }
  },
  async mounted() {
    // Load all data when component is mounted
    await this.loadCompanyCustomers()
    await this.loadCompanyAddresses()
    await this.loadCompanyItems()
  }
}
</script>
