const roundMoney = (value) => {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return 0
  return Number(numeric.toFixed(2))
}

const nonNegative = (value) => {
  const numeric = Number(value)
  if (Number.isNaN(numeric) || numeric < 0) return 0
  return numeric
}

export const derivePaymentStatus = (paidAmount, totalAmount) => {
  const paid = nonNegative(paidAmount)
  const total = nonNegative(totalAmount)

  if (paid <= 0) return 'unpaid'
  if (paid < total) return 'partial'
  return 'paid'
}

export const recalculateOrderPayment = ({
  subtotal_amount,
  delivery_fee,
  adjustment_amount,
  paid_amount,
  payment_method
}) => {
  const subtotal = nonNegative(subtotal_amount)
  const deliveryFee = nonNegative(delivery_fee)
  const adjustment = Number.isNaN(Number(adjustment_amount)) ? 0 : Number(adjustment_amount)
  const totalAmount = roundMoney(subtotal + deliveryFee + adjustment)

  if (payment_method === 'cod') {
    return {
      total_amount: totalAmount,
      paid_amount: 0,
      collectible_amount: totalAmount,
      payment_status: 'unpaid',
      is_paid_amount_editable: false
    }
  }

  const paidAmount = nonNegative(paid_amount)
  const collectibleAmount = Math.max(roundMoney(totalAmount - paidAmount), 0)
  const paymentStatus = derivePaymentStatus(paidAmount, totalAmount)

  return {
    total_amount: totalAmount,
    paid_amount: paidAmount,
    collectible_amount: collectibleAmount,
    payment_status: paymentStatus,
    is_paid_amount_editable: true
  }
}

