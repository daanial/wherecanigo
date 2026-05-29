import type { MonthOption } from '../lib/months'

interface MonthChipsProps {
  months: MonthOption[]
  selected: string
  onSelect: (key: string) => void
  wrap?: boolean
}

export function MonthChips({
  months,
  selected,
  onSelect,
  wrap = true,
}: MonthChipsProps) {
  return (
    <div
      className={[
        'flex gap-1.5',
        wrap ? 'flex-wrap' : 'overflow-x-auto whitespace-nowrap',
      ].join(' ')}
    >
      {months.map((m) => {
        const active = m.key === selected
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => onSelect(m.key)}
            className={[
              'rounded-full px-3 py-1 font-sans text-xs transition-colors duration-200',
              active
                ? 'bg-ink text-paper'
                : 'bg-transparent text-ink-soft ring-1 ring-border hover:text-ink',
            ].join(' ')}
          >
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
