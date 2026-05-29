import type { DotStyle } from './types'

const ACCENT = '#c8553d'
const MID_WARM = '#a67c5b'
const COOL = '#7a8f7e'
const OVER_BUDGET_OPACITY = 0.05
const IN_BUDGET_MIN_OPACITY = 0.35

export function getPriceRange(prices: number[]): { min: number; max: number } {
  if (prices.length === 0) return { min: 0, max: 500 }
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

/**
 * Map price → dot radius, fill, and opacity relative to budget ceiling.
 * Uses the display price (RT if available, else OW).
 * Cheaper = larger / warmer; over budget fades to near-zero.
 */
export function getDotStyle(
  price: number,
  budget: number,
  minPrice: number,
  maxPrice: number,
): DotStyle {
  if (price > budget) {
    const overRatio = Math.min(1, (price - budget) / Math.max(budget, 1))
    return {
      radius: 3,
      fill: COOL,
      opacity: OVER_BUDGET_OPACITY + (1 - overRatio) * 0.08,
    }
  }

  const span = Math.max(maxPrice - minPrice, 1)
  const t = (price - minPrice) / span

  const radius = 10 - t * 5
  let fill: string
  if (t < 0.2) fill = ACCENT
  else if (t < 0.55) fill = MID_WARM
  else fill = COOL

  const budgetHeadroom = budget > 0 ? 1 - price / budget : 0
  const opacity = IN_BUDGET_MIN_OPACITY + budgetHeadroom * 0.65

  return { radius, fill, opacity: Math.min(1, opacity) }
}

/** The price used for dot sizing and budget filtering (RT preferred) */
export function displayPrice(priceOw: number, priceRt: number | null): number {
  return priceRt ?? priceOw
}
