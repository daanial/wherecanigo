import type { OriginOption } from '../config'
import type { MonthOption } from '../lib/months'
import { BudgetSlider } from './BudgetSlider'
import { MonthChips } from './MonthChips'

interface ControlBarProps {
  origins: OriginOption[]
  selectedOrigin: string
  onOriginChange: (origin: string) => void
  budget: number
  onBudgetChange: (value: number) => void
  months: MonthOption[]
  selectedMonth: string
  onMonthChange: (key: string) => void
  layout?: 'bar' | 'sheet'
}

export function ControlBar({
  origins,
  selectedOrigin,
  onOriginChange,
  budget,
  onBudgetChange,
  months,
  selectedMonth,
  onMonthChange,
  layout = 'bar',
}: ControlBarProps) {
  const selectedOriginOption = origins.find((origin) => origin.code === selectedOrigin)

  const inner = (
    <>
      <div className="w-full min-w-0">
        <div className="flex items-center gap-2">
          <span className="shrink-0 font-serif text-sm text-ink-soft">from</span>
          <label className="sr-only" htmlFor={`origin-select-${layout}`}>
            Departure airport
          </label>
          <select
            id={`origin-select-${layout}`}
            value={selectedOrigin}
            onChange={(e) => onOriginChange(e.target.value)}
            className="min-w-0 flex-1 rounded-sm border border-border bg-paper px-2 py-1 font-sans text-sm text-ink"
          >
            {origins.map((origin) => (
              <option key={origin.code} value={origin.code}>
                {origin.city} ({origin.code})
              </option>
            ))}
          </select>
        </div>
        <p className="mt-1 truncate pl-10 font-sans text-xs text-ink-soft">
          {selectedOriginOption?.airport ?? ''}
        </p>
      </div>

      <div className="w-full min-w-0">
        <BudgetSlider value={budget} onChange={onBudgetChange} />
      </div>

      <div className="w-full min-w-0">
        <MonthChips
          months={months}
          selected={selectedMonth}
          onSelect={onMonthChange}
          wrap={layout === 'sheet'}
        />
      </div>
    </>
  )

  if (layout === 'sheet') {
    return <div className="flex w-full flex-col gap-4">{inner}</div>
  }

  return (
    <div className="hidden w-full lg:grid lg:grid-cols-3 lg:items-center lg:gap-6">
      {inner}
    </div>
  )
}
