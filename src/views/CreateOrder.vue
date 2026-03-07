<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Create New Order</h2>
        <p class="text-xs text-gray-800 dark:text-gray-100">Fast order entry with customer, address, and item shortcuts</p>
      </div>
      <button
        class="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="$router.push('/orders')"
      >
        Back to Orders
      </button>
    </div>

    <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-4 card-shadow">
      <p v-if="formError" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
        {{ formError }}
      </p>

      <section class="space-y-2">
        <h3 class="text-[13px] font-bold text-gray-900 dark:text-white">Order Basics</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Order Type <span class="text-red-600">*</span></label>
            <select v-model="form.order_type" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300">
              <option v-for="option in selectOptions.order_type" :key="`order_type-${String(option.value)}`" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Delivery Medium <span class="text-red-600">*</span></label>
            <select v-model="form.delivery_medium" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300">
              <option v-for="option in selectOptions.delivery_medium" :key="`delivery_medium-${String(option.value)}`" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Status <span class="text-red-600">*</span></label>
            <select v-model="form.status" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300">
              <option v-for="option in selectOptions.status" :key="`status-${String(option.value)}`" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
          <div v-if="isDeliveryStatusRequired">
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Delivery Status <span v-if="isDeliveryStatusRequired" class="text-red-600">*</span></label>
            <select v-model="form.delivery_status" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300">
              <option v-for="option in selectOptions.delivery_status" :key="`delivery_status-${String(option.value)}`" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
        </div>

        <div class="rounded-md border border-gray-200 dark:border-gray-700 p-2.5">
          <p class="mb-2 text-xs font-bold text-gray-900 dark:text-white">Payment Information</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <div>
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Order Amount <span class="text-red-600">*</span></label>
              <input v-model.number="form.amount" type="number" min="0" step="0.01" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="0.00">
            </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Paid Amount</label>
            <input v-model.number="form.paid_amount" type="number" min="0" step="0.01" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="0.00">
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Collectible Amount <span class="text-red-600">*</span></label>
            <input
              v-model.number="form.collectible_amount"
              type="number"
              min="0"
              step="0.01"
              class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300"
              placeholder="0.00"
            >
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Payment Method <span class="text-red-600">*</span></label>
            <select v-model="form.payment_method" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300">
              <option v-for="option in selectOptions.payment_method" :key="`payment_method-${String(option.value)}`" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Payment Status <span class="text-red-600">*</span></label>
            <select
              v-model="form.payment_status"
              class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300"
            >
              <option v-for="option in selectOptions.payment_status" :key="`payment_status-${String(option.value)}`" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
          </div>
        </div>
      </section>

      <section class="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <h3 class="text-[13px] font-bold text-gray-900 dark:text-white">Customer</h3>
          <div class="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-0.5 dark:border-gray-600 dark:bg-gray-900">
            <button type="button" :class="segmentClass(customerMode === 'existing')" @click="setCustomerMode('existing')">Existing</button>
            <button type="button" :class="segmentClass(customerMode === 'new')" @click="setCustomerMode('new')">New</button>
          </div>
        </div>

        <div v-if="customerMode === 'existing'">
          <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Select Customer <span class="text-red-600">*</span></label>
          <SearchableDropdown
            v-model="form.customer_id"
            :options="customerOptions"
            option-key="id"
            option-label="name"
            option-sub-label="mobile_no"
            :loading="customerLoading"
            search-placeholder="Search customer by name or mobile"
            no-results-text="No customer found"
            @search="handleCustomerSearch"
            @select="onCustomerSelect"
          />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Customer Name <span class="text-red-600">*</span></label>
            <input v-model="form.customer_name" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="Enter customer name">
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Customer Mobile <span class="text-red-600">*</span></label>
            <input v-model="form.customer_mobile_no" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="Enter customer mobile">
          </div>
        </div>
      </section>

      <section class="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <h3 class="text-[13px] font-bold text-gray-900 dark:text-white">Drop Information</h3>
          <label class="inline-flex items-center gap-2 text-xs font-medium text-gray-800 dark:text-white">
            <input
              v-model="useCustomerForDropContact"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
            Same as customer (name + mobile)
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div class="md:col-span-3">
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Drop Address <span class="text-red-600">*</span></label>
            <div class="relative">
              <input
                v-model="form.drop_address"
                type="text"
                class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 pr-24 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300"
                placeholder="Search OSM or type address manually"
              >
              <span class="absolute right-2 top-1.5 text-[11px] text-gray-800 dark:text-gray-100">
                {{ osmLoading ? 'Searching...' : 'OSM' }}
              </span>

              <div
                v-if="osmSuggestions.length"
                class="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg"
              >
                <button
                  v-for="suggestion in osmSuggestions"
                  :key="suggestion.place_id"
                  type="button"
                  class="w-full px-3 py-2 text-left text-xs text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  @click="selectOsmSuggestion(suggestion)"
                >
                  {{ suggestion.display_name }}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Drop Latitude <span class="text-red-600">*</span></label>
            <input v-model.number="form.drop_latitude" type="number" step="0.000001" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="23.804100">
          </div>

          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Drop Longitude <span class="text-red-600">*</span></label>
            <input v-model.number="form.drop_longitude" type="number" step="0.000001" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="90.366200">
          </div>

          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Drop Contact Name <span class="text-red-600">*</span></label>
            <input
              v-model="form.drop_contact_name"
              type="text"
              class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300"
              :disabled="useCustomerForDropContact"
              :class="{ 'bg-gray-100 dark:bg-gray-700': useCustomerForDropContact }"
              placeholder="Receiver name"
            >
          </div>

          <div>
            <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Drop Mobile Number <span class="text-red-600">*</span></label>
            <input
              v-model="form.drop_mobile_number"
              type="text"
              class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300"
              :disabled="useCustomerForDropContact"
              :class="{ 'bg-gray-100 dark:bg-gray-700': useCustomerForDropContact }"
              placeholder="Receiver mobile"
            >
          </div>

          <div class="flex items-end">
            <p class="text-[11px] text-gray-800 dark:text-gray-100">
              If no OSM address selected, enter exact lat/lng manually.
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
        <div class="flex items-center justify-between">
          <h3 class="text-[13px] font-bold text-gray-900 dark:text-white">Order Items</h3>
        </div>

        <div
          v-for="(item, index) in form.items"
          :key="`item-${index}`"
          class="rounded-lg border border-slate-200 bg-white p-3 space-y-2.5 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-gray-900 dark:text-white">Item {{ index + 1 }}</span>
              <span
                v-if="item.mode === 'existing' && item.id"
                class="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                Catalog
              </span>
              <span
                v-else-if="item.mode === 'new' && item.name"
                class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              >
                New
              </span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-0.5 dark:border-gray-600 dark:bg-gray-900">
                <button type="button" :class="segmentClass(item.mode === 'existing')" @click="item.mode = 'existing'">Existing</button>
                <button type="button" :class="segmentClass(item.mode === 'new')" @click="item.mode = 'new'">New</button>
              </div>
              <button
                v-if="form.items.length > 1"
                class="inline-flex items-center rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                @click="removeItemRow(index)"
              >
                Remove
              </button>
            </div>
          </div>

          <div v-if="item.mode === 'existing'" class="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-12">
            <div class="lg:col-span-5">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Select Item <span class="text-red-600">*</span></label>
              <SearchableDropdown
                v-model="item.id"
                :options="itemOptions"
                option-key="id"
                option-label="name"
                option-sub-label="code"
                :loading="itemLoading"
                search-placeholder="Search item by name or code"
                no-results-text="No item found"
                @search="handleItemSearch"
              />
            </div>
            <div class="lg:col-span-2">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Quantity <span class="text-red-600">*</span></label>
              <input v-model.number="item.quantity" type="number" min="1" step="1" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="1">
            </div>
            <div class="lg:col-span-2">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Unit Price</label>
              <input
                v-model.number="item.unit_price"
                type="number"
                min="0"
                step="0.01"
                class="w-full rounded-md border border-gray-300 bg-gray-100 px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300"
                placeholder="0.00"
                readonly
              >
            </div>
            <div class="lg:col-span-3">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Line Total</label>
              <input
                :value="formatMoney(getLineTotal(item))"
                type="text"
                class="w-full rounded-md border border-gray-300 bg-gray-100 px-2.5 py-2 text-xs font-semibold text-gray-900 placeholder-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                readonly
              >
            </div>
            <div class="lg:col-span-12">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Notes</label>
              <input v-model="item.notes" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="Handle with care...">
            </div>
          </div>

          <div v-else class="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-12">
            <div class="lg:col-span-4">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Item Name <span class="text-red-600">*</span></label>
              <input v-model="item.name" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="Item name">
            </div>
            <div class="lg:col-span-2">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Unit <span class="text-red-600">*</span></label>
              <input v-model="item.unit" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="pcs, kg, box...">
            </div>
            <div class="lg:col-span-2">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Quantity <span class="text-red-600">*</span></label>
              <input v-model.number="item.quantity" type="number" min="1" step="1" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="1">
            </div>
            <div class="lg:col-span-2">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Unit Price <span class="text-red-600">*</span></label>
              <input
                v-model.number="item.unit_price"
                type="number"
                min="0"
                step="0.01"
                class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300"
                placeholder="0.00"
              >
            </div>
            <div class="lg:col-span-2">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Line Total</label>
              <input
                :value="formatMoney(getLineTotal(item))"
                type="text"
                class="w-full rounded-md border border-gray-300 bg-gray-100 px-2.5 py-2 text-xs font-semibold text-gray-900 placeholder-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                readonly
              >
            </div>
            <div class="lg:col-span-12">
              <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Notes</label>
              <input v-model="item.notes" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-300" placeholder="Handle with care...">
            </div>
          </div>
        </div>

        <button
          type="button"
          class="inline-flex items-center rounded border border-dashed border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          @click="addItemRow"
        >
          <svg class="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Another Item
        </button>
      </section>

      <div class="flex justify-end pt-2">
        <button
          class="rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-60"
          :disabled="submitting"
          @click="openPreviewModal"
        >
          {{ submitting ? 'Creating...' : 'Create Order' }}
        </button>
      </div>
    </div>

    <div
      v-if="showPreviewModal"
      class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 p-4"
      @click.self="showPreviewModal = false"
    >
      <div class="w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">Confirm Order Preview</h3>
            <p class="text-xs font-medium text-gray-800 dark:text-gray-100">Please review before creating the order.</p>
          </div>
          <button class="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white" @click="showPreviewModal = false">
            Close
          </button>
        </div>

        <div class="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
          <div class="rounded-md border border-gray-200 p-3 dark:border-gray-700">
            <p class="mb-2 text-xs font-bold text-gray-900 dark:text-white">Payment</p>
            <div class="grid grid-cols-1 gap-1.5 text-xs text-gray-900 dark:text-white">
              <p class="break-words"><span class="font-bold">Order Amount:</span> {{ formatMoney(form.amount) }}</p>
              <p class="break-words"><span class="font-bold">Paid Amount:</span> {{ formatMoney(form.paid_amount) }}</p>
              <p class="break-words"><span class="font-bold">Collectible Amount:</span> {{ formatMoney(form.collectible_amount) }}</p>
              <p class="break-words"><span class="font-bold">Payment Method:</span> {{ form.payment_method || '-' }}</p>
              <p class="break-words"><span class="font-bold">Payment Status:</span> {{ form.payment_status || '-' }}</p>
            </div>
          </div>

          <div class="rounded-md border border-gray-200 p-3 dark:border-gray-700">
            <p class="mb-2 text-xs font-bold text-gray-900 dark:text-white">Customer & Drop</p>
            <div class="grid grid-cols-1 gap-1.5 text-xs text-gray-900 dark:text-white md:grid-cols-2">
              <p class="break-words"><span class="font-bold">Customer:</span> {{ getCustomerPreview() }}</p>
              <p class="break-words"><span class="font-bold">Drop Contact:</span> {{ form.drop_contact_name || '-' }}</p>
              <p class="break-words"><span class="font-bold">Drop Mobile:</span> {{ form.drop_mobile_number || '-' }}</p>
              <p class="break-words md:col-span-2"><span class="font-bold">Drop Address:</span> {{ form.drop_address || '-' }}</p>
              <p class="break-words"><span class="font-bold">Latitude:</span> {{ form.drop_latitude ?? '-' }}</p>
              <p class="break-words"><span class="font-bold">Longitude:</span> {{ form.drop_longitude ?? '-' }}</p>
            </div>
          </div>

          <div class="rounded-md border border-gray-200 p-3 dark:border-gray-700">
            <p class="mb-2 text-xs font-bold text-gray-900 dark:text-white">Items</p>
            <div v-for="(item, index) in form.items" :key="`preview-item-${index}`" class="mb-2 rounded border border-gray-200 p-2 text-xs text-gray-900 dark:border-gray-700 dark:text-white">
              <p class="break-words"><span class="font-bold">Item {{ index + 1 }}:</span> {{ getItemPreview(item) }}</p>
              <p class="break-words"><span class="font-bold">Quantity:</span> {{ item.quantity }}</p>
              <p class="break-words"><span class="font-bold">Unit Price:</span> {{ formatMoney(item.unit_price) }}</p>
              <p class="break-words"><span class="font-bold">Line Total:</span> {{ formatMoney(getLineTotal(item)) }}</p>
              <p class="break-words"><span class="font-bold">Notes:</span> {{ item.notes || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="mt-3 flex justify-end gap-2">
          <button class="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700" @click="showPreviewModal = false">
            Edit
          </button>
          <button
            class="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black disabled:opacity-60"
            :disabled="submitting"
            @click="submitForm"
          >
            {{ submitting ? 'Creating...' : 'Confirm & Create' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchableDropdown from '../components/SearchableDropdown.vue'
import { useToastStore } from '../stores/toast'
import { fetchOrderFilterOptions, createOrder } from '../api/orders'
import { listCompanyCustomers } from '../api/customers'
import { listItems } from '../api/items'

export default {
  name: 'CreateOrder',
  components: {
    SearchableDropdown
  },
  setup() {
    const toastStore = useToastStore()
    return { toastStore }
  },
  data() {
    return {
      submitting: false,
      formError: '',
      showPreviewModal: false,
      customerMode: 'existing',
      useCustomerForDropContact: false,
      customerLoading: false,
      itemLoading: false,
      customerOptions: [],
      selectedCustomer: null,
      itemOptions: [],
      osmLoading: false,
      osmSuggestions: [],
      osmDebounceTimer: null,
      skipNextOsmLookup: false,
      selectOptions: {
        order_type: [],
        delivery_medium: [],
        status: [],
        delivery_status: [],
        payment_method: [],
        payment_status: []
      },
      form: {
        order_type: '',
        delivery_medium: '',
        status: '',
        delivery_status: '',
        payment_method: '',
        payment_status: '',
        amount: null,
        collectible_amount: null,
        paid_amount: null,
        customer_id: null,
        customer_name: '',
        customer_mobile_no: '',
        drop_contact_name: '',
        drop_mobile_number: '',
        drop_address: '',
        drop_latitude: null,
        drop_longitude: null,
        items: []
      }
    }
  },
  computed: {
    isDeliveryStatusRequired() {
      return this.form.order_type !== 'counter'
    }
  },
  watch: {
    'form.amount'() {
      this.syncCollectibleWithPaidAmount()
    },
    'form.paid_amount'() {
      this.syncCollectibleWithPaidAmount()
    },
    form: {
      handler() {
        this.syncAmountFromItems()
      },
      deep: true
    },
    customerMode() {
      if (this.customerMode === 'new') {
        this.form.customer_id = null
        this.selectedCustomer = null
      } else {
        this.form.customer_name = ''
        this.form.customer_mobile_no = ''
      }
      this.syncDropContactFromCustomer()
    },
    'form.customer_name'() {
      this.syncDropContactFromCustomer()
    },
    'form.customer_mobile_no'() {
      this.syncDropContactFromCustomer()
    },
    'form.customer_id'() {
      if (this.customerMode === 'existing') {
        this.selectedCustomer = this.customerOptions.find((customer) => customer.id === this.form.customer_id) || this.selectedCustomer
      }
      this.syncDropContactFromCustomer()
    },
    useCustomerForDropContact() {
      this.syncDropContactFromCustomer()
    },
    'form.order_type'(value) {
      if (value === 'counter') {
        this.form.delivery_status = ''
      }
    },
    'form.drop_address'(value) {
      if (this.skipNextOsmLookup) {
        this.skipNextOsmLookup = false
        return
      }
      clearTimeout(this.osmDebounceTimer)
      if (!value || value.trim().length < 3) {
        this.osmSuggestions = []
        return
      }
      this.osmDebounceTimer = setTimeout(() => {
        this.searchOsmAddresses(value)
      }, 350)
    }
  },
  async mounted() {
    await this.loadOrderOptions()
    this.addItemRow()
    await Promise.all([this.handleCustomerSearch(''), this.handleItemSearch('')])
  },
  beforeUnmount() {
    clearTimeout(this.osmDebounceTimer)
  },
  methods: {
    getItemUnitPrice(item) {
      if (!item || typeof item !== 'object') return null
      const candidates = [item.unit_price, item.price, item.selling_price, item.sale_price, item.mrp]
      const found = candidates.find((value) => value !== undefined && value !== null && value !== '')
      if (found === undefined) return null
      const parsed = Number(found)
      return Number.isNaN(parsed) ? null : parsed
    },
    syncAmountFromItems() {
      let total = 0

      this.form.items.forEach((item) => {
        if (item.mode === 'existing' && item.id) {
          const selected = this.itemOptions.find((entry) => entry.id === item.id)
          const selectedPrice = this.getItemUnitPrice(selected)
          if (selectedPrice !== null && Number(item.unit_price) !== selectedPrice) {
            item.unit_price = selectedPrice
          }
        }

        const quantity = Number(item.quantity)
        const unitPrice = Number(item.unit_price)
        if (!Number.isNaN(quantity) && !Number.isNaN(unitPrice) && quantity > 0 && unitPrice >= 0) {
          total += quantity * unitPrice
        }
      })

      const normalized = Number(total.toFixed(2))
      if (Number(this.form.amount) !== normalized) {
        this.form.amount = normalized
      }
    },
    syncCollectibleWithPaidAmount() {
      const amount = Number(this.form.amount)
      const paidAmount = Number(this.form.paid_amount)

      if (Number.isNaN(amount) || Number.isNaN(paidAmount)) {
        return
      }

      if (amount > 0 && paidAmount === amount) {
        this.form.collectible_amount = 0
      }
    },
    segmentClass(active) {
      return active
        ? 'rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition dark:bg-gray-600'
        : 'rounded-md px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
    },
    setCustomerMode(mode) {
      this.customerMode = mode
    },
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
    async loadOrderOptions() {
      try {
        const response = await fetchOrderFilterOptions()
        const filters = response?.data?.filters || {}

        this.selectOptions.order_type = filters.order_type?.options || []
        this.selectOptions.delivery_medium = filters.delivery_medium?.options || []
        this.selectOptions.status = filters.status?.options || []
        this.selectOptions.delivery_status = filters.delivery_status?.options || []
        this.selectOptions.payment_method = filters.payment_method?.options || []
        this.selectOptions.payment_status = filters.payment_status?.options || []

        this.form.order_type = this.defaultSelectValue(this.selectOptions.order_type)
        this.form.delivery_medium = this.defaultSelectValue(this.selectOptions.delivery_medium)
        this.form.status = this.defaultSelectValue(this.selectOptions.status)
        this.form.delivery_status = this.defaultSelectValue(this.selectOptions.delivery_status)
        this.form.payment_method = this.defaultSelectValue(this.selectOptions.payment_method)
        this.form.payment_status = this.defaultSelectValue(this.selectOptions.payment_status)
        this.syncCollectibleWithPaidAmount()
      } catch (error) {
        const message = this.getApiErrorMessage(error, 'Failed to load order options')
        this.toastStore.error(message)
      }
    },
    defaultSelectValue(options) {
      const found = options.find((option) => option.value !== '' && option.value !== null)
      return found ? found.value : ''
    },
    addItemRow() {
      this.form.items.push({
        mode: 'existing',
        id: null,
        name: '',
        unit: '',
        unit_price: 0,
        quantity: 1,
        notes: ''
      })
    },
    removeItemRow(index) {
      this.form.items.splice(index, 1)
    },
    onCustomerSelect(customer) {
      this.selectedCustomer = customer
      this.syncDropContactFromCustomer()
    },
    syncDropContactFromCustomer() {
      if (!this.useCustomerForDropContact) return

      if (this.customerMode === 'existing') {
        const customer = this.selectedCustomer || this.customerOptions.find((entry) => entry.id === this.form.customer_id)
        this.form.drop_contact_name = customer?.name || ''
        this.form.drop_mobile_number = customer?.mobile_no || ''
      } else {
        this.form.drop_contact_name = this.form.customer_name || ''
        this.form.drop_mobile_number = this.form.customer_mobile_no || ''
      }
    },
    async handleCustomerSearch(search) {
      this.customerLoading = true
      try {
        const params = { page: 1, per_page: 20 }
        if (search && search.trim()) params.name = search.trim()

        const response = await listCompanyCustomers(params)
        this.customerOptions = response?.data?.data || []

        if (this.form.customer_id) {
          this.selectedCustomer = this.customerOptions.find((customer) => customer.id === this.form.customer_id) || this.selectedCustomer
        }
      } catch (error) {
        this.customerOptions = []
      } finally {
        this.customerLoading = false
      }
    },
    async handleItemSearch(search) {
      this.itemLoading = true
      try {
        const params = { page: 1, per_page: 20 }
        if (search && search.trim()) params.search = search.trim()

        const response = await listItems(params)
        this.itemOptions = response?.data?.data || []
      } catch (error) {
        this.itemOptions = []
      } finally {
        this.itemLoading = false
      }
    },
    async searchOsmAddresses(query) {
      this.osmLoading = true
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('Failed to fetch OSM address suggestions')

        const data = await response.json()
        this.osmSuggestions = Array.isArray(data) ? data : []
      } catch (error) {
        this.osmSuggestions = []
      } finally {
        this.osmLoading = false
      }
    },
    selectOsmSuggestion(suggestion) {
      this.skipNextOsmLookup = true
      this.form.drop_address = suggestion.display_name || ''
      this.form.drop_latitude = Number(suggestion.lat)
      this.form.drop_longitude = Number(suggestion.lon)
      this.osmSuggestions = []
    },
    buildPayload() {
      const payload = {
        order_type: this.form.order_type,
        delivery_medium: this.form.delivery_medium,
        status: this.form.status,
        payment_method: this.form.payment_method,
        payment_status: this.form.payment_status,
        amount: this.form.amount,
        collectible_amount: this.form.collectible_amount,
        paid_amount: this.form.paid_amount || 0,
        drop_contact_name: this.form.drop_contact_name,
        drop_mobile_number: this.form.drop_mobile_number,
        drop_address: this.form.drop_address,
        drop_latitude: this.form.drop_latitude,
        drop_longitude: this.form.drop_longitude,
        items: this.form.items.map((item) => {
          const entry = {
            quantity: Number(item.quantity),
            notes: item.notes || undefined
          }

          if (item.mode === 'existing') {
            entry.id = item.id
          } else {
            entry.name = item.name
            entry.unit = item.unit
          }

          return entry
        })
      }

      if (this.isDeliveryStatusRequired) {
        payload.delivery_status = this.form.delivery_status
      }

      if (this.customerMode === 'existing') {
        payload.customer_id = this.form.customer_id
      } else {
        payload.customer_name = this.form.customer_name
        payload.customer_mobile_no = this.form.customer_mobile_no
      }

      return payload
    },
    formatMoney(value) {
      const num = Number(value || 0)
      return Number.isNaN(num) ? '0.00' : num.toFixed(2)
    },
    getLineTotal(item) {
      const quantity = Number(item?.quantity || 0)
      const unitPrice = Number(item?.unit_price || 0)
      if (Number.isNaN(quantity) || Number.isNaN(unitPrice)) return 0
      return quantity * unitPrice
    },
    getCustomerPreview() {
      if (this.customerMode === 'existing') {
        const selected = this.selectedCustomer || this.customerOptions.find((entry) => entry.id === this.form.customer_id)
        if (!selected) return `ID: ${this.form.customer_id || '-'}`
        return `${selected.name} (${selected.mobile_no || '-'})`
      }
      return `${this.form.customer_name || '-'} (${this.form.customer_mobile_no || '-'})`
    },
    getItemPreview(item) {
      if (item.mode === 'existing') {
        const selected = this.itemOptions.find((entry) => entry.id === item.id)
        if (!selected) return `Item ID: ${item.id || '-'}`
        return `${selected.name}${selected.code ? ` (${selected.code})` : ''}`
      }
      return `${item.name || '-'}${item.unit ? ` [${item.unit}]` : ''}`
    },
    openPreviewModal() {
      this.formError = this.validateForm()
      if (this.formError) return
      this.showPreviewModal = true
    },
    validateForm() {
      if (!this.form.order_type || !this.form.delivery_medium || !this.form.status) {
        return 'Order type, delivery medium, and status are required.'
      }
      if (this.isDeliveryStatusRequired && !this.form.delivery_status) {
        return 'Delivery status is required.'
      }
      if (!this.form.payment_method || !this.form.payment_status) {
        return 'Payment method and payment status are required.'
      }
      const collectibleMissing = this.form.collectible_amount === null || this.form.collectible_amount === ''
      if (!this.form.amount || collectibleMissing) {
        return 'Amount and collectible amount are required.'
      }
      if (this.customerMode === 'existing' && !this.form.customer_id) {
        return 'Please select a customer.'
      }
      if (this.customerMode === 'new' && (!this.form.customer_name || !this.form.customer_mobile_no)) {
        return 'Customer name and mobile are required for new customer.'
      }
      if (!this.form.drop_contact_name || !this.form.drop_mobile_number || !this.form.drop_address) {
        return 'Drop contact name, mobile number, and address are required.'
      }
      if (this.form.drop_latitude === null || this.form.drop_latitude === '' || this.form.drop_longitude === null || this.form.drop_longitude === '') {
        return 'Drop latitude and longitude are required.'
      }
      if (!this.form.items.length) {
        return 'At least one item is required.'
      }

      for (let index = 0; index < this.form.items.length; index += 1) {
        const item = this.form.items[index]
        if (!item.quantity || Number(item.quantity) < 1) {
          return `Item #${index + 1} quantity must be at least 1.`
        }
        if (item.mode === 'existing' && !item.id) {
          return `Please select an existing item for item #${index + 1}.`
        }
        if (item.mode === 'new' && (!item.name || !item.unit)) {
          return `Item #${index + 1} requires name and unit.`
        }
        if (item.mode === 'new' && (item.unit_price === null || item.unit_price === '' || Number(item.unit_price) < 0)) {
          return `Item #${index + 1} requires a valid unit price.`
        }
      }

      return ''
    },
    async submitForm() {
      this.formError = this.validateForm()
      if (this.formError) return

      this.submitting = true
      this.showPreviewModal = false
      try {
        const response = await createOrder(this.buildPayload())

        if (response.success) {
          this.toastStore.success(response.message || 'Order created successfully')
          this.$router.push('/orders')
        } else {
          this.formError = response?.message || 'Failed to create order'
        }
      } catch (error) {
        this.formError = this.getApiErrorMessage(error, 'Failed to create order')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
