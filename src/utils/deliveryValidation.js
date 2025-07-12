// Validation utilities for delivery items

export class DeliveryValidation {
  constructor() {
    this.pendingValidations = new Map()
  }

  // Debounced validation to avoid too many API calls
  debounceValidation(key, validationFn, delay = 500) {
    if (this.pendingValidations.has(key)) {
      clearTimeout(this.pendingValidations.get(key))
    }

    const timeoutId = setTimeout(() => {
      validationFn()
      this.pendingValidations.delete(key)
    }, delay)

    this.pendingValidations.set(key, timeoutId)
  }

  // Validate item name and code uniqueness
  validateItemUniqueness(itemName, itemCode, companyItems) {
    const errors = {
      nameError: '',
      codeError: ''
    }

    if (itemName) {
      const existingByName = companyItems.find(item => 
        item.name.toLowerCase() === itemName.toLowerCase()
      )
      if (existingByName) {
        errors.nameError = 'Item name already exists for this company'
      }
    }

    if (itemCode) {
      const existingByCode = companyItems.find(item => 
        item.code.toLowerCase() === itemCode.toLowerCase()
      )
      if (existingByCode) {
        errors.codeError = 'Item code already exists for this company'
      }
    }

    return errors
  }

  // Validate required fields for delivery
  validateDeliveryForm(formData) {
    const errors = []

    // Required fields validation
    if (!formData.customerId) {
      errors.push('Customer is required')
    }

    // Pickup address validation
    if (!formData.pickupAddressId && !formData.manualPickupAddress) {
      errors.push('Pickup address is required')
    }

    // Drop address validation
    if (!formData.dropAddressId && !formData.dropAddress) {
      errors.push('Drop-off address is required')
    }

    // Items validation
    if (formData.items.length === 0) {
      errors.push('At least one item is required')
    }

    formData.items.forEach((item, index) => {
      if (!item.itemId && !item.name) {
        errors.push(`Item ${index + 1}: Either select from catalog or enter item name`)
      }

      if (item.isManual) {
        if (!item.name) {
          errors.push(`Item ${index + 1}: Item name is required`)
        }
        if (!item.code) {
          errors.push(`Item ${index + 1}: Item code is required`)
        }
      }

      if (!item.quantity || item.quantity < 1) {
        errors.push(`Item ${index + 1}: Quantity must be at least 1`)
      }
    })

    return errors
  }

  // Format validation errors for display
  formatValidationErrors(errors) {
    if (errors.length === 0) return ''
    
    if (errors.length === 1) {
      return errors[0]
    }

    return `Please fix the following issues:\n• ${errors.join('\n• ')}`
  }
}

// Export singleton instance
export const deliveryValidation = new DeliveryValidation()
