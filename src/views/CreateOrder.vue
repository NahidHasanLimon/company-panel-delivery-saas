<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Create New Order</h2>
        <p class="text-xs text-gray-800 dark:text-gray-100">Fast order entry with customer, delivery, and item shortcuts</p>
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

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div class="space-y-3 xl:col-span-5">
          <section class="space-y-2 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-[13px] font-bold text-gray-900 dark:text-white">Order Source</h3>
              <span class="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Group 1</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Order Source <span class="text-red-600">*</span></label>
                <select v-model="form.order_source" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                  <option v-for="option in selectOptions.order_source" :key="`order_source-${String(option.value)}`" :value="option.value">{{ option.label }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Order Status <span class="text-red-600">*</span></label>
                <select v-model="form.status" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                  <option v-for="option in selectOptions.status" :key="`status-${String(option.value)}`" :value="option.value">{{ option.label }}</option>
                </select>
              </div>
            </div>
          </section>

          <section class="space-y-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-[13px] font-bold text-gray-900 dark:text-white">Customer Information</h3>
              <span class="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Group 2</span>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <h4 class="text-[12px] font-bold text-gray-900 dark:text-white">Customer</h4>
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
                  <input v-model="form.customer_name" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Enter customer name">
                </div>
                <div>
                  <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Customer Mobile <span class="text-red-600">*</span></label>
                  <input v-model="form.customer_mobile_no" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Enter customer mobile">
                </div>
              </div>
            </div>
          </section>

          <section class="space-y-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between">
              <h3 class="text-[13px] font-bold text-gray-900 dark:text-white">Delivery Requirement</h3>
              <span class="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Group 3</span>
            </div>

            <div class="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-0.5 dark:border-gray-600 dark:bg-gray-900">
              <button type="button" :class="segmentClass(form.needs_delivery)" @click="form.needs_delivery = true">Needs Delivery</button>
              <button type="button" :class="segmentClass(!form.needs_delivery)" @click="form.needs_delivery = false">No Delivery</button>
            </div>
          </section>

          <section v-if="form.needs_delivery" class="space-y-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-[13px] font-bold text-gray-900 dark:text-white">Delivery Details</h3>
              <div class="flex items-center gap-2">
                <div v-if="customerMode === 'existing'" class="flex items-center gap-2">
                  <div class="relative inline-flex group">
                    <button
                      type="button"
                      class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-800 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                      :disabled="!form.customer_id"
                      title="Select Saved Address"
                      aria-label="Select Saved Address"
                      @click="openCustomerAddressModal"
                    >
                      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                    </button>
                    <span class="pointer-events-none absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                      Select Saved Address
                    </span>
                  </div>
                  <button
                    v-if="form.delivery_address_id"
                    type="button"
                    class="rounded-md border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                    @click="clearSelectedDeliveryAddress"
                  >
                    Clear
                  </button>
                </div>
                <span class="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Group 4</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div>
                <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Delivery Status <span class="text-red-600">*</span></label>
                <select v-model="form.delivery_status" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                  <option v-for="option in selectOptions.delivery_status" :key="`delivery_status-${String(option.value)}`" :value="option.value">{{ option.label }}</option>
                </select>
              </div>
              <div>
                <label class="mb-1 flex items-center gap-1 text-[11px] font-bold text-gray-900 dark:text-white">
                  <span>Delivery Contact Name <span class="text-red-600">*</span></span>
                  <span v-if="useCustomerForDropContact" class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">Auto</span>
                </label>
                <input
                  v-model="form.delivery_contact_name"
                  type="text"
                  class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  :disabled="useCustomerForDropContact"
                  :class="{ 'order-disabled-field': useCustomerForDropContact }"
                  placeholder="Receiver name"
                >
              </div>
              <div>
                <label class="mb-1 flex items-center gap-1 text-[11px] font-bold text-gray-900 dark:text-white">
                  <span>Delivery Mobile Number <span class="text-red-600">*</span></span>
                  <span v-if="useCustomerForDropContact" class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">Auto</span>
                </label>
                <input
                  v-model="form.delivery_mobile_number"
                  type="text"
                  class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  :disabled="useCustomerForDropContact"
                  :class="{ 'order-disabled-field': useCustomerForDropContact }"
                  placeholder="Receiver mobile"
                >
              </div>

              <div class="md:col-span-3">
                <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Delivery Address <span class="text-red-600">*</span></label>
                <div class="relative">
                  <input
                    v-model="form.delivery_address"
                    type="text"
                    class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 pr-24 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Search OSM or type address manually"
                  >
                  <span
                    v-if="form.delivery_address_id"
                    class="absolute left-2 top-1.5 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    Saved Address
                  </span>
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
                <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Delivery Area</label>
                <input v-model="form.delivery_area" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Mirpur, Uttara, etc.">
              </div>
              <div>
                <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Delivery Latitude <span class="text-red-600">*</span></label>
                <input v-model.number="form.delivery_latitude" type="number" step="0.000001" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="23.804100">
              </div>
              <div>
                <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Delivery Longitude <span class="text-red-600">*</span></label>
                <input v-model.number="form.delivery_longitude" type="number" step="0.000001" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="90.366200">
              </div>

              <div class="md:col-span-3">
                <label class="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-800 dark:text-gray-100">
                  <input
                    v-model="useCustomerForDropContact"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-800"
                  >
                  <span>Use customer name and mobile for delivery contact</span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 xl:col-span-7 xl:col-start-6 xl:row-start-1 xl:self-start xl:sticky xl:top-3 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto xl:pr-1">
          <div class="flex items-center justify-between">
            <h3 class="text-[13px] font-bold text-gray-900 dark:text-white">Items & Money</h3>
            <span class="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Group 5</span>
          </div>

          <section class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div class="flex items-center justify-between">
              <h4 class="text-[12px] font-bold text-gray-900 dark:text-white">Order Items</h4>
            </div>

            <div
              v-for="(item, index) in form.items"
              :key="`item-${index}`"
              class="rounded-lg border border-slate-200 bg-white p-2 space-y-1.5 dark:border-gray-700 dark:bg-gray-800"
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

              <div v-if="item.mode === 'existing'" class="grid grid-cols-1 gap-1.5 md:grid-cols-2 lg:grid-cols-12">
                <div class="lg:col-span-4">
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
                  <input v-model.number="item.quantity" type="number" min="1" step="1" class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Qty">
                </div>
                <div class="lg:col-span-2">
                  <input
                    v-model.number="item.unit_price"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white order-disabled-field"
                    placeholder="Price"
                    readonly
                  >
                </div>
                <div class="lg:col-span-2">
                  <input
                    :value="formatMoney(getLineTotal(item))"
                    type="text"
                    class="w-full rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white order-disabled-field"
                    readonly
                  >
                </div>
                <div class="lg:col-span-2">
                  <input v-model="item.notes" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Notes">
                </div>
              </div>

              <div v-else class="grid grid-cols-1 gap-1.5 md:grid-cols-2 lg:grid-cols-12">
                <div class="lg:col-span-3">
                  <input v-model="item.name" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Item">
                </div>
                <div class="lg:col-span-1">
                  <input v-model="item.unit" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Unit">
                </div>
                <div class="lg:col-span-2">
                  <input v-model.number="item.quantity" type="number" min="1" step="1" class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Qty">
                </div>
                <div class="lg:col-span-2">
                  <input
                    v-model.number="item.unit_price"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Price"
                  >
                </div>
                <div class="lg:col-span-2">
                  <input
                    :value="formatMoney(getLineTotal(item))"
                    type="text"
                    class="w-full rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white order-disabled-field"
                    readonly
                  >
                </div>
                <div class="lg:col-span-2">
                  <input v-model="item.notes" type="text" class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="Notes">
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

          <section class="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div class="rounded-md border border-gray-200 dark:border-gray-700 p-2.5">
              <p class="mb-2 text-[12px] font-bold text-gray-900 dark:text-white">Payment Information</p>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2.5">
                <div>
                  <label class="mb-1 flex items-center gap-1 text-[11px] font-bold text-gray-900 dark:text-white">
                    <span>Delivery Fee</span>
                    <span v-if="!form.needs_delivery" class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">Disabled</span>
                  </label>
                  <input
                    v-model.number="form.delivery_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    :disabled="!form.needs_delivery"
                    class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    :class="{ 'order-disabled-field': !form.needs_delivery }"
                    placeholder="0.00"
                  >
                </div>
                <div>
                  <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Adjustment</label>
                  <input v-model.number="form.adjustment_amount" type="number" step="0.01" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white" placeholder="0.00">
                </div>
                <div>
                  <label class="mb-1 flex items-center gap-1 text-[11px] font-bold text-gray-900 dark:text-white">
                    <span>Paid Amount</span>
                    <span v-if="!isPaidAmountEditable" class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">Disabled</span>
                  </label>
                  <input
                    v-model.number="form.paid_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    :disabled="!isPaidAmountEditable"
                    class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    :class="{ 'order-disabled-field': !isPaidAmountEditable }"
                    placeholder="0.00"
                  >
                </div>
                <div>
                  <label class="mb-1 flex items-center gap-1 text-[11px] font-bold text-gray-900 dark:text-white">
                    <span>Collectible Amount</span>
                    <span class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">Auto</span>
                  </label>
                  <input
                    :value="formatMoney(form.collectible_amount)"
                    type="text"
                    readonly
                    class="w-full rounded-md border border-gray-300 bg-gray-100 px-2.5 py-2 text-xs font-semibold text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white order-disabled-field"
                  >
                </div>
                <div>
                  <label class="mb-1 block text-[11px] font-bold text-gray-900 dark:text-white">Payment Method <span class="text-red-600">*</span></label>
                  <select v-model="form.payment_method" class="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                    <option v-for="option in selectOptions.payment_method" :key="`payment_method-${String(option.value)}`" :value="option.value">{{ option.label }}</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 flex items-center gap-1 text-[11px] font-bold text-gray-900 dark:text-white">
                    <span>Payment Status</span>
                    <span class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">Auto</span>
                  </label>
                  <input
                    :value="paymentStatusLabel"
                    type="text"
                    readonly
                    class="w-full rounded-md border border-gray-300 bg-gray-100 px-2.5 py-2 text-xs font-semibold text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white order-disabled-field"
                  >
                </div>
              </div>

              <div class="mt-2 grid grid-cols-1 md:grid-cols-5 gap-2">
                <div class="rounded border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs dark:border-gray-700 dark:bg-gray-700/40">
                  <p class="text-gray-700 dark:text-gray-300">Subtotal</p>
                  <p class="font-bold text-gray-900 dark:text-white">BDT {{ formatMoney(form.subtotal_amount) }}</p>
                </div>
                <div class="rounded border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs dark:border-gray-700 dark:bg-gray-700/40">
                  <p class="text-gray-700 dark:text-gray-300">Delivery Fee</p>
                  <p class="font-bold text-gray-900 dark:text-white">BDT {{ formatMoney(form.delivery_fee) }}</p>
                </div>
                <div class="rounded border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs dark:border-gray-700 dark:bg-gray-700/40">
                  <p class="text-gray-700 dark:text-gray-300">Adjustment</p>
                  <p class="font-bold text-gray-900 dark:text-white">BDT {{ formatMoney(form.adjustment_amount) }}</p>
                </div>
                <div class="rounded border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs dark:border-gray-700 dark:bg-gray-700/40">
                  <p class="text-gray-700 dark:text-gray-300">Total</p>
                  <p class="font-bold text-gray-900 dark:text-white">BDT {{ formatMoney(form.total_amount) }}</p>
                </div>
                <div class="rounded border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs dark:border-gray-700 dark:bg-gray-700/40">
                  <p class="text-gray-700 dark:text-gray-300">Collectible</p>
                  <p class="font-bold text-gray-900 dark:text-white">BDT {{ formatMoney(form.collectible_amount) }}</p>
                </div>
              </div>
            </div>
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
      </div>
    </div>

    <div
      v-if="showAddressModal"
      class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 p-4"
      @click.self="closeCustomerAddressModal"
    >
      <div class="w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">Select Customer Address</h3>
            <p class="text-xs text-gray-700 dark:text-gray-200">{{ selectedCustomer?.name || '-' }}</p>
          </div>
          <button class="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white" @click="closeCustomerAddressModal">
            Close
          </button>
        </div>

        <div v-if="addressLoading" class="py-8 text-center text-sm text-gray-700 dark:text-gray-200">
          Loading addresses...
        </div>

        <div v-else-if="customerAddresses.length" class="max-h-[65vh] overflow-y-auto">
          <div class="space-y-2">
            <button
              v-for="address in customerAddresses"
              :key="address.id"
              type="button"
              class="w-full rounded-md border border-gray-200 p-2 text-left text-xs hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              @click="selectCustomerAddress(address)"
            >
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ address.label || 'Address' }} <span class="font-normal">({{ address.address_type || 'N/A' }})</span>
              </p>
              <p class="mt-0.5 text-gray-700 dark:text-gray-200">{{ address.address || '-' }}</p>
              <p class="mt-0.5 text-[11px] text-gray-600 dark:text-gray-300">
                Lat: {{ address.latitude ?? '-' }}, Lng: {{ address.longitude ?? '-' }}
              </p>
            </button>
          </div>
        </div>

        <div v-else class="py-8 text-center text-sm text-gray-600 dark:text-gray-400">
          No saved addresses found for this customer.
        </div>
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
            <p class="mb-2 text-xs font-bold text-gray-900 dark:text-white">Money Summary</p>
            <div class="grid grid-cols-1 gap-1.5 text-xs text-gray-900 dark:text-white">
              <p class="break-words"><span class="font-bold">Subtotal:</span> {{ formatMoney(form.subtotal_amount) }}</p>
              <p class="break-words"><span class="font-bold">Delivery Fee:</span> {{ formatMoney(form.delivery_fee) }}</p>
              <p class="break-words"><span class="font-bold">Adjustment:</span> {{ formatMoney(form.adjustment_amount) }}</p>
              <p class="break-words"><span class="font-bold">Total:</span> {{ formatMoney(form.total_amount) }}</p>
              <p class="break-words"><span class="font-bold">Paid:</span> {{ formatMoney(form.paid_amount) }}</p>
              <p class="break-words"><span class="font-bold">Collectible:</span> {{ formatMoney(form.collectible_amount) }}</p>
              <p class="break-words"><span class="font-bold">Payment Method:</span> {{ form.payment_method || '-' }}</p>
              <p class="break-words"><span class="font-bold">Payment Status:</span> {{ form.payment_status || '-' }}</p>
            </div>
          </div>

          <div class="rounded-md border border-gray-200 p-3 dark:border-gray-700">
            <p class="mb-2 text-xs font-bold text-gray-900 dark:text-white">Order Context</p>
            <div class="grid grid-cols-1 gap-1.5 text-xs text-gray-900 dark:text-white md:grid-cols-2">
              <p class="break-words"><span class="font-bold">Source:</span> {{ form.order_source || '-' }}</p>
              <p class="break-words"><span class="font-bold">Needs Delivery:</span> {{ form.needs_delivery ? 'Yes' : 'No' }}</p>
              <p class="break-words"><span class="font-bold">Customer:</span> {{ getCustomerPreview() }}</p>
              <p class="break-words"><span class="font-bold">Order Status:</span> {{ form.status || '-' }}</p>
            </div>
          </div>

          <div v-if="form.needs_delivery" class="rounded-md border border-gray-200 p-3 dark:border-gray-700">
            <p class="mb-2 text-xs font-bold text-gray-900 dark:text-white">Delivery Details</p>
            <div class="grid grid-cols-1 gap-1.5 text-xs text-gray-900 dark:text-white md:grid-cols-2">
              <p class="break-words"><span class="font-bold">Delivery Status:</span> {{ form.delivery_status || '-' }}</p>
              <p class="break-words"><span class="font-bold">Contact:</span> {{ form.delivery_contact_name || '-' }}</p>
              <p class="break-words"><span class="font-bold">Mobile:</span> {{ form.delivery_mobile_number || '-' }}</p>
              <p class="break-words"><span class="font-bold">Area:</span> {{ form.delivery_area || '-' }}</p>
              <p class="break-words md:col-span-2"><span class="font-bold">Address:</span> {{ form.delivery_address || '-' }}</p>
              <p class="break-words"><span class="font-bold">Latitude:</span> {{ form.delivery_latitude ?? '-' }}</p>
              <p class="break-words"><span class="font-bold">Longitude:</span> {{ form.delivery_longitude ?? '-' }}</p>
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
import { listCompanyCustomers, fetchCustomerAddresses } from '../api/customers'
import { listItems } from '../api/items'
import { recalculateOrderPayment } from '../utils/orderPayment'

const DEFAULT_ORDER_SOURCES = [
  { label: 'Counter', value: 'counter' },
  { label: 'Online Store', value: 'online_store' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Whatsapp', value: 'whatsapp' },
  { label: 'Phone', value: 'phone' },
  { label: 'Other', value: 'other' }
]

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
      showAddressModal: false,
      addressLoading: false,
      customerAddresses: [],
      osmLoading: false,
      osmSuggestions: [],
      osmDebounceTimer: null,
      skipNextOsmLookup: false,
      selectOptions: {
        order_source: DEFAULT_ORDER_SOURCES,
        status: [],
        delivery_status: [],
        payment_method: []
      },
      form: {
        needs_delivery: true,
        order_source: 'counter',
        status: '',
        delivery_status: '',
        payment_method: '',
        payment_status: '',
        subtotal_amount: 0,
        delivery_fee: 0,
        adjustment_amount: 0,
        total_amount: 0,
        collectible_amount: 0,
        paid_amount: 0,
        customer_id: null,
        customer_name: '',
        customer_mobile_no: '',
        delivery_address_id: null,
        delivery_contact_name: '',
        delivery_mobile_number: '',
        delivery_address: '',
        delivery_area: '',
        delivery_latitude: null,
        delivery_longitude: null,
        items: []
      }
    }
  },
  computed: {
    isPaidAmountEditable() {
      return this.form.payment_method !== 'cod'
    },
    paymentStatusLabel() {
      if (!this.form.payment_status) return 'N/A'
      return this.form.payment_status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    },
    hasConfiguredItems() {
      return this.form.items.some((item) => {
        const quantity = Number(item?.quantity)
        const unitPrice = Number(item?.unit_price)
        if (Number.isNaN(quantity) || Number.isNaN(unitPrice) || quantity <= 0 || unitPrice < 0) return false

        if (item.mode === 'existing') return Boolean(item.id)
        if (item.mode === 'new') return Boolean(item.name && item.unit)

        return false
      })
    }
  },
  watch: {
    form: {
      handler() {
        this.syncAmountFromItems()
      },
      deep: true
    },
    'form.delivery_fee'() {
      this.applyPaymentRules()
    },
    'form.adjustment_amount'() {
      this.applyPaymentRules()
    },
    'form.paid_amount'() {
      this.applyPaymentRules()
    },
    'form.payment_method'() {
      this.applyPaymentRules()
    },
    customerMode() {
      if (this.customerMode === 'new') {
        this.form.customer_id = null
        this.selectedCustomer = null
        this.clearSelectedDeliveryAddress()
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
    'form.customer_id'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.clearSelectedDeliveryAddress()
      }
      if (this.customerMode === 'existing') {
        this.selectedCustomer = this.customerOptions.find((customer) => customer.id === this.form.customer_id) || this.selectedCustomer
      }
      this.syncDropContactFromCustomer()
    },
    useCustomerForDropContact() {
      this.syncDropContactFromCustomer()
    },
    'form.needs_delivery'(value) {
      if (!value) {
        this.form.delivery_fee = 0
        this.form.delivery_status = ''
        this.form.delivery_address_id = null
        this.form.delivery_contact_name = ''
        this.form.delivery_mobile_number = ''
        this.form.delivery_address = ''
        this.form.delivery_area = ''
        this.form.delivery_latitude = null
        this.form.delivery_longitude = null
      } else {
        this.syncDropContactFromCustomer()
      }
      this.applyPaymentRules()
    },
    'form.delivery_address'(value) {
      if (!this.form.needs_delivery) return

      if (this.form.delivery_address_id && !this.skipNextOsmLookup) {
        this.form.delivery_address_id = null
      }
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
    this.applyPaymentRules()
  },
  beforeUnmount() {
    clearTimeout(this.osmDebounceTimer)
  },
  methods: {
    toNumber(value, fallback = 0) {
      const num = Number(value)
      return Number.isNaN(num) ? fallback : num
    },
    syncAmountFromItems() {
      let subtotal = 0

      this.form.items.forEach((item) => {
        if (item.mode === 'existing' && item.id) {
          const selected = this.itemOptions.find((entry) => entry.id === item.id)
          const selectedPrice = this.getItemUnitPrice(selected)
          if (selectedPrice !== null && Number(item.unit_price) !== selectedPrice) {
            item.unit_price = selectedPrice
          }
        }

        const lineTotal = this.getLineTotal(item)
        if (lineTotal > 0) subtotal += lineTotal
      })

      this.form.subtotal_amount = Number(subtotal.toFixed(2))
      this.applyPaymentRules()
    },
    applyPaymentRules() {
      const summary = recalculateOrderPayment({
        subtotal_amount: this.form.subtotal_amount,
        delivery_fee: this.form.delivery_fee,
        adjustment_amount: this.form.adjustment_amount,
        paid_amount: this.form.paid_amount,
        payment_method: this.form.payment_method
      })

      this.form.total_amount = summary.total_amount
      this.form.paid_amount = summary.paid_amount
      this.form.collectible_amount = summary.collectible_amount
      this.form.payment_status = summary.payment_status
    },
    getItemUnitPrice(item) {
      if (!item || typeof item !== 'object') return null
      const candidates = [item.unit_price, item.price, item.selling_price, item.sale_price, item.mrp]
      const found = candidates.find((value) => value !== undefined && value !== null && value !== '')
      if (found === undefined) return null
      const parsed = Number(found)
      return Number.isNaN(parsed) ? null : parsed
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

        this.selectOptions.order_source = filters.order_source?.options?.length ? filters.order_source.options : DEFAULT_ORDER_SOURCES
        this.selectOptions.status = filters.status?.options || []
        this.selectOptions.delivery_status = filters.delivery_status?.options || []
        this.selectOptions.payment_method = filters.payment_method?.options || []

        this.form.order_source = this.defaultSelectValue(this.selectOptions.order_source) || 'counter'
        this.form.status = this.defaultSelectValue(this.selectOptions.status)
        this.form.delivery_status = this.defaultSelectValue(this.selectOptions.delivery_status)
        this.form.payment_method = this.defaultSelectValue(this.selectOptions.payment_method)
        this.applyPaymentRules()
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
      this.syncAmountFromItems()
    },
    onCustomerSelect(customer) {
      this.selectedCustomer = customer
      this.syncDropContactFromCustomer()
    },
    syncDropContactFromCustomer() {
      if (!this.useCustomerForDropContact || !this.form.needs_delivery) return

      if (this.customerMode === 'existing') {
        const customer = this.selectedCustomer || this.customerOptions.find((entry) => entry.id === this.form.customer_id)
        this.form.delivery_contact_name = customer?.name || ''
        this.form.delivery_mobile_number = customer?.mobile_no || ''
      } else {
        this.form.delivery_contact_name = this.form.customer_name || ''
        this.form.delivery_mobile_number = this.form.customer_mobile_no || ''
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
      this.form.delivery_address_id = null
      this.form.delivery_address = suggestion.display_name || ''
      this.form.delivery_latitude = Number(suggestion.lat)
      this.form.delivery_longitude = Number(suggestion.lon)
      this.osmSuggestions = []
    },
    async openCustomerAddressModal() {
      if (!this.form.customer_id) return
      this.showAddressModal = true
      this.addressLoading = true
      this.customerAddresses = []
      try {
        const response = await fetchCustomerAddresses(this.form.customer_id)
        if (response?.success) {
          this.customerAddresses = Array.isArray(response.data) ? response.data : []
        } else {
          this.toastStore.warning(response?.message || 'Failed to fetch customer addresses')
        }
      } catch (error) {
        const message = this.getApiErrorMessage(error, 'Failed to fetch customer addresses')
        this.toastStore.error(message)
      } finally {
        this.addressLoading = false
      }
    },
    closeCustomerAddressModal() {
      this.showAddressModal = false
      this.addressLoading = false
    },
    selectCustomerAddress(address) {
      this.form.delivery_address_id = address.id || null
      this.skipNextOsmLookup = true
      this.form.delivery_address = address.address || ''
      this.form.delivery_area = address.area || ''
      this.form.delivery_latitude = address.latitude !== null && address.latitude !== undefined ? Number(address.latitude) : null
      this.form.delivery_longitude = address.longitude !== null && address.longitude !== undefined ? Number(address.longitude) : null
      this.closeCustomerAddressModal()
    },
    clearSelectedDeliveryAddress() {
      this.form.delivery_address_id = null
    },
    buildPayload() {
      const payload = {
        needs_delivery: Boolean(this.form.needs_delivery),
        order_source: this.form.order_source,
        status: this.form.status,
        payment_method: this.form.payment_method,
        payment_status: this.form.payment_status,
        subtotal_amount: this.toNumber(this.form.subtotal_amount),
        delivery_fee: this.toNumber(this.form.delivery_fee),
        adjustment_amount: this.toNumber(this.form.adjustment_amount),
        total_amount: this.toNumber(this.form.total_amount),
        paid_amount: this.toNumber(this.form.paid_amount),
        collectible_amount: this.toNumber(this.form.collectible_amount),
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

      if (this.form.needs_delivery) {
        payload.delivery_status = this.form.delivery_status
        payload.delivery_address_id = this.form.delivery_address_id
        payload.delivery_contact_name = this.form.delivery_contact_name
        payload.delivery_mobile_number = this.form.delivery_mobile_number
        payload.delivery_address = this.form.delivery_address
        payload.delivery_area = this.form.delivery_area || undefined
        payload.delivery_latitude = this.form.delivery_latitude
        payload.delivery_longitude = this.form.delivery_longitude
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
      if (!this.form.order_source || !this.form.status) {
        return 'Order source and status are required.'
      }
      if (this.customerMode === 'existing' && !this.form.customer_id) {
        return 'Please select a customer.'
      }
      if (this.customerMode === 'new' && (!this.form.customer_name || !this.form.customer_mobile_no)) {
        return 'Customer name and mobile are required for new customer.'
      }

      if (this.form.needs_delivery) {
        if (!this.form.delivery_status) {
          return 'Delivery status is required.'
        }
        if (!this.form.delivery_contact_name || !this.form.delivery_mobile_number || !this.form.delivery_address) {
          return 'Delivery contact name, mobile number, and address are required.'
        }
        if (this.form.delivery_latitude === null || this.form.delivery_latitude === '' || this.form.delivery_longitude === null || this.form.delivery_longitude === '') {
          return 'Delivery latitude and longitude are required.'
        }
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
      if (!this.hasConfiguredItems) {
        return 'Please configure at least one valid item first.'
      }

      if (!this.form.payment_method) {
        return 'Payment method is required.'
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
