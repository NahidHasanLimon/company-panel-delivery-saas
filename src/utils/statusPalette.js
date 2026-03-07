const TONE_CLASSES = {
  neutral: {
    badge: 'border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-500 dark:bg-gray-700 dark:text-white',
    dot: 'bg-gray-400'
  },
  info: {
    badge: 'border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-500 dark:bg-gray-700 dark:text-white',
    dot: 'bg-blue-500'
  },
  success: {
    badge: 'border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-500 dark:bg-gray-700 dark:text-white',
    dot: 'bg-emerald-500'
  },
  warning: {
    badge: 'border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-500 dark:bg-gray-700 dark:text-white',
    dot: 'bg-amber-500'
  },
  danger: {
    badge: 'border border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-500 dark:bg-gray-700 dark:text-white',
    dot: 'bg-rose-500'
  }
}

// Explicit status-to-tone mapping for all current known statuses.
const STATUS_TONE_MAP = {
  new: 'warning',
  pending: 'warning',
  partial: 'warning',
  on_hold: 'warning',
  onhold: 'warning',
  awaiting: 'warning',

  assigned: 'info',
  confirmed: 'info',
  in_progress: 'info',
  in_transit: 'info',
  processing: 'info',

  completed: 'success',
  delivered: 'success',
  paid: 'success',
  verified: 'success',
  active: 'success',

  cancelled: 'danger',
  canceled: 'danger',
  returned: 'danger',
  failed: 'danger',
  unpaid: 'danger',
  expired: 'danger',
  inactive: 'danger',
  rejected: 'danger',

  draft: 'neutral',
  unknown: 'neutral'
}

export function normalizeStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

export function getStatusTone(status) {
  const normalized = normalizeStatus(status)

  if (!normalized) return 'neutral'
  if (STATUS_TONE_MAP[normalized]) return STATUS_TONE_MAP[normalized]

  // Fallbacks for unlisted/coming statuses.
  if (/(cancel|fail|reject|expire|inactive|unpaid|return)/.test(normalized)) return 'danger'
  if (/(complete|deliver|verify|active|paid|success)/.test(normalized) && !/unpaid/.test(normalized)) return 'success'
  if (/(pending|new|partial|await|hold)/.test(normalized)) return 'warning'
  if (/(assign|confirm|progress|transit|process|review)/.test(normalized)) return 'info'

  return 'neutral'
}

export function getStatusBadgeClass(status) {
  const tone = getStatusTone(status)
  return TONE_CLASSES[tone]?.badge || TONE_CLASSES.neutral.badge
}

export function getStatusDotClass(status) {
  const tone = getStatusTone(status)
  return TONE_CLASSES[tone]?.dot || TONE_CLASSES.neutral.dot
}
