export const LOW_STOCK_LIMIT = 5

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

export const getTimestampValue = (value) => {
  if (!value) return 0

  if (typeof value?.toDate === 'function') {
    return value.toDate().getTime()
  }

  if (typeof value === 'object' && typeof value.seconds === 'number') {
    return value.seconds * 1000
  }

  const parsedDate = new Date(value)

  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime()
}

export const getOrderStatusMeta = (status) => {
  switch (status) {
    case 'completed':
      return {
        label: 'Виконано',
        tone: 'success',
      }
    case 'cancelled':
      return {
        label: 'Скасовано',
        tone: 'danger',
      }
    case 'pending':
    default:
      return {
        label: 'В обробці',
        tone: 'warning',
      }
  }
}

export const getReviewStatusMeta = (isApproved) => ({
  label: isApproved ? 'Опубліковано' : 'На модерації',
  tone: isApproved ? 'success' : 'warning',
})

export const renderRating = (rating) => {
  const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))

  return `${'★'.repeat(safeRating)}${'☆'.repeat(5 - safeRating)}`
}

export const normalizeAmenities = (amenities) =>
  amenities
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
