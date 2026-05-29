import { BUDGET_MAX, BUDGET_MIN } from '../config'

interface BudgetSliderProps {
  value: number
  onChange: (value: number) => void
}

export function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <span className="shrink-0 font-sans text-xs text-ink-soft">Return budget</span>
      <input
        type="range"
        className="budget-slider min-w-0 flex-1"
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Budget in euros"
        aria-valuemin={BUDGET_MIN}
        aria-valuemax={BUDGET_MAX}
        aria-valuenow={value}
      />
      <span className="font-serif shrink-0 text-lg tabular-nums text-ink">
        €{value}
      </span>
    </div>
  )
}
