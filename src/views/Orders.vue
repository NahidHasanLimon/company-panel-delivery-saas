<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Orders</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">Manage all company orders</p>
      </div>
      <button
        class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
        @click="$router.push('/orders/create')"
      >
        New Order
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-3">
      <div v-if="optionsLoading" class="text-xs text-gray-500 dark:text-gray-400">Loading filter options...</div>

      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div v-for="field in visibleFilterKeys" :key="field">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{{ formatLabel(field) }}</label>

            <input
              v-if="filterSchema[field]?.type === 'text'"
              v-model="filters[field]"
              type="text"
              class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :placeholder="`Enter ${formatLabel(field).toLowerCase()}`"
            >

            <input
              v-else-if="filterSchema[field]?.type === 'date'"
              v-model="filters[field]"
              type="date"
              class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >

            <select
              v-else-if="filterSchema[field]?.type === 'select'"
              v-model="filters[field]"
              class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option
                v-for="option in filterSchema[field]?.options || []"
                :key="`${field}-${String(option.value)}`"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            class="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="showAllFilters = !showAllFilters"
          >
            {{ showAllFilters ? 'Show Less Filters' : 'Show All Filters' }}
          </button>

          <div class="flex items-center gap-2">
            <button
              class="px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              @click="clearFilters"
            >
              Clear
            </button>
            <button
              class="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              @click="applyFilters"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </template>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
      <div class="h-6 w-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading orders...</span>
    </div>

    <template v-else>
      <div v-if="orders.length" class="bg-white dark:bg-gray-800 rounded-xl card-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order No</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Needs Delivery</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivery Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivery Fee</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Adjustment</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Paid</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Collectible</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ order.order_number }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ order.customer?.name || 'N/A' }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ order.customer?.mobile_no || '-' }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ titleCase(order.order_source) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    :class="order.needs_delivery
                      ? 'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'"
                  >
                    {{ order.needs_delivery ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <StatusBadge :status="order.status" />
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <StatusBadge :status="order.delivery_status" />
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <StatusBadge :status="order.payment_status" />
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">BDT {{ formatAmount(order.subtotal_amount) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">BDT {{ formatAmount(order.delivery_fee) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">BDT {{ formatAmount(order.adjustment_amount) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">BDT {{ formatAmount(order.total_amount) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">BDT {{ formatAmount(order.paid_amount) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">BDT {{ formatAmount(order.collectible_amount) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ formatDate(order.created_at) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button
                    class="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                    title="View Order"
                    aria-label="View Order"
                    @click="viewOrder(order.id)"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="text-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
        <p class="text-sm text-gray-600 dark:text-gray-400">No orders found for current filters.</p>
      </div>

      <Pagination
        v-if="pagination.total > 0 && pagination.last_page > 1"
        :current-page="pagination.current_page"
        :total-pages="pagination.last_page"
        :total-items="pagination.total"
        :per-page="pagination.per_page"
        @page-change="handlePageChange"
      />
    </template>

    <div
      v-if="showDetailsModal"
      class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 p-4"
      @click.self="closeDetailsModal"
    >
      <div class="w-full max-w-4xl rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">Order Details</h3>
            <p class="text-xs text-gray-700 dark:text-gray-200">{{ selectedOrder?.order_number || '-' }}</p>
          </div>
          <button class="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white" @click="closeDetailsModal">
            Close
          </button>
        </div>

        <div v-if="detailsLoading" class="py-8 text-center text-sm text-gray-700 dark:text-gray-200">
          Loading order details...
        </div>

        <div v-else-if="selectedOrder" class="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          <div class="grid grid-cols-1 gap-1.5 rounded-md border border-gray-200 p-3 text-xs text-gray-900 dark:border-gray-700 dark:text-white md:grid-cols-2">
            <p><span class="font-bold">Source:</span> {{ titleCase(selectedOrder.order_source) }}</p>
            <p><span class="font-bold">Needs Delivery:</span> {{ selectedOrder.needs_delivery ? 'Yes' : 'No' }}</p>
            <p><span class="font-bold">Status:</span> {{ titleCase(selectedOrder.status) }}</p>
            <p><span class="font-bold">Delivery Status:</span> {{ titleCase(selectedOrder.delivery_status) }}</p>
            <p><span class="font-bold">Payment Method:</span> {{ titleCase(selectedOrder.payment_method) }}</p>
            <p><span class="font-bold">Payment Status:</span> {{ titleCase(selectedOrder.payment_status) }}</p>
          </div>

          <div class="grid grid-cols-1 gap-1.5 rounded-md border border-gray-200 p-3 text-xs text-gray-900 dark:border-gray-700 dark:text-white md:grid-cols-3">
            <p><span class="font-bold">Subtotal:</span> BDT {{ formatAmount(selectedOrder.subtotal_amount) }}</p>
            <p><span class="font-bold">Delivery Fee:</span> BDT {{ formatAmount(selectedOrder.delivery_fee) }}</p>
            <p><span class="font-bold">Adjustment:</span> BDT {{ formatAmount(selectedOrder.adjustment_amount) }}</p>
            <p><span class="font-bold">Total:</span> BDT {{ formatAmount(selectedOrder.total_amount) }}</p>
            <p><span class="font-bold">Paid:</span> BDT {{ formatAmount(selectedOrder.paid_amount) }}</p>
            <p><span class="font-bold">Collectible:</span> BDT {{ formatAmount(selectedOrder.collectible_amount) }}</p>
          </div>

          <div class="grid grid-cols-1 gap-1.5 rounded-md border border-gray-200 p-3 text-xs text-gray-900 dark:border-gray-700 dark:text-white md:grid-cols-2">
            <p><span class="font-bold">Customer:</span> {{ selectedOrder.customer?.name || '-' }}</p>
            <p><span class="font-bold">Customer Mobile:</span> {{ selectedOrder.customer?.mobile_no || '-' }}</p>
            <p><span class="font-bold">Delivery Contact:</span> {{ selectedOrder.delivery_contact_name || selectedOrder.drop_contact_name || '-' }}</p>
            <p><span class="font-bold">Delivery Mobile:</span> {{ selectedOrder.delivery_mobile_number || selectedOrder.drop_mobile_number || '-' }}</p>
            <p><span class="font-bold">Delivery Area:</span> {{ selectedOrder.delivery_area || selectedOrder.drop_area || '-' }}</p>
            <p class="md:col-span-2"><span class="font-bold">Delivery Address:</span> {{ selectedOrder.delivery_address || selectedOrder.drop_address || '-' }}</p>
            <p><span class="font-bold">Delivery Latitude:</span> {{ selectedOrder.delivery_latitude || selectedOrder.drop_latitude || '-' }}</p>
            <p><span class="font-bold">Delivery Longitude:</span> {{ selectedOrder.delivery_longitude || selectedOrder.drop_longitude || '-' }}</p>
          </div>

          <div class="rounded-md border border-gray-200 p-3 dark:border-gray-700">
            <p class="mb-2 text-xs font-bold text-gray-900 dark:text-white">Order Items</p>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit Price</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Qty</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Line Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  <tr v-for="item in selectedOrder.order_items || []" :key="item.id">
                    <td class="px-3 py-2 text-xs text-gray-900 dark:text-white">{{ item.item_name || item.item?.name || '-' }}</td>
                    <td class="px-3 py-2 text-xs text-gray-900 dark:text-white">{{ item.unit || item.item?.unit || '-' }}</td>
                    <td class="px-3 py-2 text-xs text-gray-900 dark:text-white">{{ formatAmount(item.unit_price) }}</td>
                    <td class="px-3 py-2 text-xs text-gray-900 dark:text-white">{{ item.quantity || 0 }}</td>
                    <td class="px-3 py-2 text-xs text-gray-900 dark:text-white">{{ formatAmount(Number(item.unit_price || 0) * Number(item.quantity || 0)) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              v-if="selectedOrder.needs_delivery"
              class="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              @click="openCreateDeliveryModal"
            >
              Create Delivery
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showCreateDeliveryModal"
      class="fixed inset-0 z-[1200] flex items-center justify-center bg-black/45 p-4"
      @click.self="closeCreateDeliveryModal"
    >
      <div class="w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">Create Delivery From Order</h3>
            <p class="text-xs text-gray-700 dark:text-gray-200">{{ selectedOrder?.order_number || '-' }}</p>
          </div>
          <button class="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white" @click="closeCreateDeliveryModal">
            Close
          </button>
        </div>

        <p v-if="deliveryFormError" class="mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {{ deliveryFormError }}
        </p>

        <div class="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Pickup Address</label>
            <select v-model="orderDeliveryForm.pickup_address_id" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
              <option value="">Use Manual Pickup</option>
              <option v-for="address in companyAddresses" :key="address.id" :value="address.id">{{ address.label || 'Address' }} - {{ address.address }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Pickup Label</label>
            <input v-model="orderDeliveryForm.pickup_label" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Main Office">
          </div>
          <div class="md:col-span-2">
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Pickup Address</label>
            <input v-model="orderDeliveryForm.pickup_address" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Enter pickup address">
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Pickup Latitude (Optional)</label>
            <input v-model.number="orderDeliveryForm.pickup_latitude" type="number" step="0.000001" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="23.804100">
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Pickup Longitude (Optional)</label>
            <input v-model.number="orderDeliveryForm.pickup_longitude" type="number" step="0.000001" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="90.366200">
          </div>

          <div class="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-2">
            <p class="mb-2 text-[11px] font-bold text-gray-900 dark:text-white">Optional Drop Override</p>
          </div>

          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Drop Contact Name</label>
            <input v-model="orderDeliveryForm.drop_contact_name" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Drop Mobile Number</label>
            <input v-model="orderDeliveryForm.drop_mobile_number" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
          </div>
          <div class="md:col-span-2">
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Drop Address</label>
            <input v-model="orderDeliveryForm.drop_address" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Drop Latitude (Optional)</label>
            <input v-model.number="orderDeliveryForm.drop_latitude" type="number" step="0.000001" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Drop Longitude (Optional)</label>
            <input v-model.number="orderDeliveryForm.drop_longitude" type="number" step="0.000001" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
          </div>

          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Delivery Method <span class="text-red-600">*</span></label>
            <select v-model="orderDeliveryForm.delivery_method" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
              <option value="own">Own</option>
              <option value="third_party">Third Party</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Status <span class="text-red-600">*</span></label>
            <select v-model="orderDeliveryForm.status" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div v-if="orderDeliveryForm.delivery_method === 'third_party'" class="md:col-span-2">
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Provider Name <span class="text-red-600">*</span></label>
            <input v-model="orderDeliveryForm.provider_name" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Pathao / RedX / ...">
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Collectible Amount</label>
            <input v-model.number="orderDeliveryForm.collectible_amount" type="number" min="0" step="0.01" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Collected Amount</label>
            <input v-model.number="orderDeliveryForm.collected_amount" type="number" min="0" step="0.01" class="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
          </div>
        </div>

        <div class="mt-3 flex justify-end gap-2">
          <button class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700" @click="closeCreateDeliveryModal">Cancel</button>
          <button
            class="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            :disabled="creatingDeliveryFromOrder"
            @click="submitCreateDeliveryFromOrder"
          >
            {{ creatingDeliveryFromOrder ? 'Creating...' : 'Create Delivery' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '../components/Pagination.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useToastStore } from '../stores/toast'
import { fetchOrderFilterOptions, fetchOrders, fetchOrderDetails, createOrderDelivery } from '../api/orders'
import { fetchCompanyAddresses } from '../api/delivery'

export default {
  name: 'Orders',
  components: {
    Pagination,
    StatusBadge
  },
  setup() {
    const toastStore = useToastStore()
    return { toastStore }
  },
  data() {
    return {
      optionsLoading: false,
      loading: false,
      filterSchema: {},
      filters: {},
      appliedFilters: {},
      showAllFilters: false,
      orders: [],
      showDetailsModal: false,
      detailsLoading: false,
      selectedOrder: null,
      showCreateDeliveryModal: false,
      creatingDeliveryFromOrder: false,
      deliveryFormError: '',
      companyAddresses: [],
      orderDeliveryForm: {
        pickup_address_id: '',
        pickup_label: '',
        pickup_address: '',
        pickup_latitude: null,
        pickup_longitude: null,
        drop_contact_name: '',
        drop_mobile_number: '',
        drop_address: '',
        drop_latitude: null,
        drop_longitude: null,
        delivery_method: 'own',
        provider_name: '',
        status: 'pending',
        collectible_amount: 0,
        collected_amount: 0
      },
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1
      }
    }
  },
  computed: {
    orderedFilterKeys() {
      const keys = Object.keys(this.filterSchema || {}).filter((key) => !['order_type', 'delivery_medium'].includes(key))
      const priority = [
        'order_number',
        'customer_mobile_no',
        'customer_code',
        'needs_delivery',
        'order_source',
        'status',
        'delivery_status',
        'payment_method',
        'payment_status',
        'from_date',
        'to_date',
        'per_page'
      ]

      const prioritized = priority.filter((key) => keys.includes(key))
      const rest = keys.filter((key) => !prioritized.includes(key))
      return [...prioritized, ...rest]
    },
    visibleFilterKeys() {
      if (this.showAllFilters) return this.orderedFilterKeys
      return this.orderedFilterKeys.slice(0, 8)
    }
  },
  async mounted() {
    await this.loadFilterOptions()
    await this.loadOrders()
    await this.loadCompanyAddresses()
  },
  methods: {
    getApiErrorMessage(error, fallbackMessage) {
      const responseData = error?.response?.data
      if (responseData?.message) return responseData.message
      const errors = responseData?.errors
      if (errors && typeof errors === 'object') {
        const firstKey = Object.keys(errors)[0]
        const firstValue = firstKey ? errors[firstKey] : null
        if (Array.isArray(firstValue) && firstValue.length) return firstValue[0]
        if (typeof firstValue === 'string') return firstValue
      }
      return fallbackMessage
    },
    async loadFilterOptions() {
      this.optionsLoading = true
      try {
        const response = await fetchOrderFilterOptions()
        if (response.success) {
          this.filterSchema = response?.data?.filters || {}
          this.resetFiltersFromSchema()
          this.appliedFilters = { ...this.filters }
        }
      } catch (error) {
        const message = this.getApiErrorMessage(error, 'Failed to load order filter options')
        this.toastStore.error(message)
      } finally {
        this.optionsLoading = false
      }
    },
    async loadCompanyAddresses() {
      try {
        const response = await fetchCompanyAddresses()
        this.companyAddresses = Array.isArray(response?.data) ? response.data : []
      } catch (error) {
        this.companyAddresses = []
      }
    },
    resetFiltersFromSchema() {
      const next = {}
      Object.entries(this.filterSchema).forEach(([key, config]) => {
        if (['order_type', 'delivery_medium'].includes(key)) return

        if (Object.prototype.hasOwnProperty.call(config, 'default')) {
          next[key] = config.default
        } else if (config.type === 'select') {
          next[key] = ''
        } else {
          next[key] = ''
        }
      })
      this.filters = next
    },
    buildParams(page = 1) {
      const params = { page }
      const source = this.appliedFilters

      Object.entries(source).forEach(([key, value]) => {
        const isEmpty = value === '' || value === null || value === undefined
        if (!isEmpty) {
          params[key] = value
        }
      })

      if (!params.per_page && this.filterSchema.per_page?.default) {
        params.per_page = this.filterSchema.per_page.default
      }

      return params
    },
    async loadOrders(page = 1) {
      this.loading = true
      try {
        const response = await fetchOrders(this.buildParams(page))
        if (response.success) {
          this.orders = response?.data?.orders || []
          this.pagination = response?.data?.pagination || {
            current_page: 1,
            per_page: 10,
            total: 0,
            last_page: 1
          }
        } else {
          this.toastStore.warning(response?.message || 'Failed to load orders')
        }
      } catch (error) {
        const message = this.getApiErrorMessage(error, 'Failed to load orders')
        this.toastStore.error(message)
      } finally {
        this.loading = false
      }
    },
    applyFilters() {
      this.appliedFilters = { ...this.filters }
      this.loadOrders(1)
    },
    clearFilters() {
      this.resetFiltersFromSchema()
      this.appliedFilters = { ...this.filters }
      this.loadOrders(1)
    },
    handlePageChange(page) {
      this.loadOrders(page)
    },
    async viewOrder(orderId) {
      this.showDetailsModal = true
      this.detailsLoading = true
      this.selectedOrder = null
      try {
        const response = await fetchOrderDetails(orderId)
        if (response.success) {
          this.selectedOrder = response.data || null
        } else {
          this.toastStore.warning(response?.message || 'Failed to load order details')
        }
      } catch (error) {
        this.toastStore.error(this.getApiErrorMessage(error, 'Failed to load order details'))
      } finally {
        this.detailsLoading = false
      }
    },
    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedOrder = null
      this.detailsLoading = false
    },
    openCreateDeliveryModal() {
      if (!this.selectedOrder) return

      this.deliveryFormError = ''
      this.showCreateDeliveryModal = true
      this.orderDeliveryForm = {
        pickup_address_id: '',
        pickup_label: '',
        pickup_address: '',
        pickup_latitude: null,
        pickup_longitude: null,
        drop_contact_name: this.selectedOrder.delivery_contact_name || this.selectedOrder.drop_contact_name || '',
        drop_mobile_number: this.selectedOrder.delivery_mobile_number || this.selectedOrder.drop_mobile_number || '',
        drop_address: this.selectedOrder.delivery_address || this.selectedOrder.drop_address || '',
        drop_latitude: this.toNullableNumber(this.selectedOrder.delivery_latitude || this.selectedOrder.drop_latitude),
        drop_longitude: this.toNullableNumber(this.selectedOrder.delivery_longitude || this.selectedOrder.drop_longitude),
        delivery_method: 'own',
        provider_name: '',
        status: this.selectedOrder.delivery_status || 'pending',
        collectible_amount: this.toNonNegativeNumber(this.selectedOrder.collectible_amount),
        collected_amount: 0
      }
    },
    closeCreateDeliveryModal() {
      this.showCreateDeliveryModal = false
      this.creatingDeliveryFromOrder = false
      this.deliveryFormError = ''
    },
    toNullableNumber(value) {
      if (value === null || value === undefined || value === '') return null
      const parsed = Number(value)
      return Number.isNaN(parsed) ? null : parsed
    },
    toNonNegativeNumber(value) {
      const parsed = Number(value)
      if (Number.isNaN(parsed) || parsed < 0) return 0
      return Number(parsed.toFixed(2))
    },
    buildCreateDeliveryPayload() {
      const payload = {
        delivery_method: this.orderDeliveryForm.delivery_method,
        status: this.orderDeliveryForm.status,
        collectible_amount: this.toNonNegativeNumber(this.orderDeliveryForm.collectible_amount),
        collected_amount: this.toNonNegativeNumber(this.orderDeliveryForm.collected_amount)
      }

      if (this.orderDeliveryForm.pickup_address_id) {
        payload.pickup_address_id = this.orderDeliveryForm.pickup_address_id
      } else {
        if (this.orderDeliveryForm.pickup_label) {
          payload.pickup_label = this.orderDeliveryForm.pickup_label
        }
        if (this.orderDeliveryForm.pickup_address) {
          payload.pickup_address = this.orderDeliveryForm.pickup_address
        }
      }

      if (this.orderDeliveryForm.pickup_latitude !== null && this.orderDeliveryForm.pickup_latitude !== '') {
        payload.pickup_latitude = this.toNullableNumber(this.orderDeliveryForm.pickup_latitude)
      }
      if (this.orderDeliveryForm.pickup_longitude !== null && this.orderDeliveryForm.pickup_longitude !== '') {
        payload.pickup_longitude = this.toNullableNumber(this.orderDeliveryForm.pickup_longitude)
      }

      if (this.orderDeliveryForm.drop_contact_name) payload.drop_contact_name = this.orderDeliveryForm.drop_contact_name
      if (this.orderDeliveryForm.drop_mobile_number) payload.drop_mobile_number = this.orderDeliveryForm.drop_mobile_number
      if (this.orderDeliveryForm.drop_address) payload.drop_address = this.orderDeliveryForm.drop_address
      if (this.orderDeliveryForm.drop_latitude !== null && this.orderDeliveryForm.drop_latitude !== '') {
        payload.drop_latitude = this.toNullableNumber(this.orderDeliveryForm.drop_latitude)
      }
      if (this.orderDeliveryForm.drop_longitude !== null && this.orderDeliveryForm.drop_longitude !== '') {
        payload.drop_longitude = this.toNullableNumber(this.orderDeliveryForm.drop_longitude)
      }

      if (this.orderDeliveryForm.delivery_method === 'third_party') {
        payload.provider_name = this.orderDeliveryForm.provider_name?.trim() || ''
      }

      return payload
    },
    validateCreateDeliveryForm() {
      if (!this.selectedOrder?.id) return 'Order not selected.'
      if (!this.orderDeliveryForm.delivery_method) return 'Delivery method is required.'
      if (!this.orderDeliveryForm.status) return 'Delivery status is required.'

      const hasPickupAddress = Boolean(this.orderDeliveryForm.pickup_address_id) || Boolean(this.orderDeliveryForm.pickup_address)
      if (!hasPickupAddress) return 'Pickup address or pickup address id is required.'

      if (this.orderDeliveryForm.delivery_method === 'third_party' && !this.orderDeliveryForm.provider_name?.trim()) {
        return 'Provider name is required for third party delivery.'
      }

      return ''
    },
    async submitCreateDeliveryFromOrder() {
      this.deliveryFormError = this.validateCreateDeliveryForm()
      if (this.deliveryFormError) return

      this.creatingDeliveryFromOrder = true
      try {
        if (this.orderDeliveryForm.delivery_method === 'own' || this.orderDeliveryForm.delivery_method === 'manual') {
          this.orderDeliveryForm.provider_name = ''
        }

        const payload = this.buildCreateDeliveryPayload()
        const response = await createOrderDelivery(this.selectedOrder.id, payload)

        if (response?.success) {
          this.toastStore.success(response.message || 'Delivery created from order successfully')
          this.closeCreateDeliveryModal()
          await this.viewOrder(this.selectedOrder.id)
          await this.loadOrders(this.pagination.current_page || 1)
        } else {
          this.deliveryFormError = response?.message || 'Failed to create delivery from order'
        }
      } catch (error) {
        this.deliveryFormError = this.getApiErrorMessage(error, 'Failed to create delivery from order')
      } finally {
        this.creatingDeliveryFromOrder = false
      }
    },
    formatLabel(value) {
      if (!value) return ''
      return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    },
    titleCase(value) {
      if (!value) return 'N/A'
      return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    },
    formatDate(value) {
      if (!value) return 'N/A'
      return new Date(value).toLocaleString()
    },
    formatAmount(value) {
      const num = Number(value)
      if (Number.isNaN(num)) return '0.00'
      return num.toFixed(2)
    }
  }
}
</script>
