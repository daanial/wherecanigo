const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

export interface MonthOption {
  key: string
  label: string
}

/**
 * Returns the next N upcoming months as YYYY-MM keys.
 * Skips the current month if fewer than 10 days remain in it
 * (too late to meaningfully book), otherwise includes it.
 */
export function getUpcomingMonths(count = 6, from = new Date()): MonthOption[] {
  const months: MonthOption[] = []

  // Days remaining in the current month
  const daysInMonth = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate()
  const daysLeft = daysInMonth - from.getDate()

  // Start from next month if fewer than 10 days left this month
  const d = daysLeft < 10
    ? new Date(from.getFullYear(), from.getMonth() + 1, 1)
    : new Date(from.getFullYear(), from.getMonth(), 1)

  for (let i = 0; i < count; i++) {
    const y = d.getFullYear()
    const m = d.getMonth()
    const key = `${y}-${String(m + 1).padStart(2, '0')}`
    months.push({ key, label: `${MONTH_NAMES[m]} ${y}` })
    d.setMonth(d.getMonth() + 1)
  }

  return months
}

export function getDefaultMonth(months: MonthOption[]): string {
  return months[0]?.key ?? ''
}
