interface ProjectSidebarProps {
  className?: string
  onClose?: () => void
}

export function ProjectSidebar({ className = '', onClose }: ProjectSidebarProps) {
  return (
    <aside
      className={[
        'relative flex h-full flex-col border-border bg-paper-raised/95',
        'border-l ring-1 ring-border',
        className,
      ].join(' ')}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-sm bg-paper px-2 py-1 font-sans text-xs text-ink ring-1 ring-border"
        >
          Close
        </button>
      )}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <h2 className="font-serif text-xl text-ink">About this map</h2>

        <p className="mt-4 font-sans text-sm leading-relaxed text-ink-soft">
          Where Can I Go? is a budget-first flight discovery toy — not a search
          engine. Pick a home airport, set a return budget, and choose a month.
          The world lights up with everywhere you can afford to go.
        </p>

        <p className="mt-4 font-sans text-sm leading-relaxed text-ink-soft">
          Cheaper destinations appear larger and warmer. Drag the budget slider
          and watch places fade in and out — the receding of the unaffordable is
          the whole point.
        </p>

        <p className="mt-4 font-sans text-sm leading-relaxed text-ink-soft">
          Prices are refreshed daily from real fare data. Click a dot to open a
          return search in euros. No accounts, no booking flow — just inspiration.
        </p>

        <hr className="my-6 border-border" />

        <p className="font-sans text-xs leading-relaxed text-ink-soft/80">
          Built as a static site: no backend, no API keys in the browser. Data
          lives in a JSON file updated by a scheduled job.
        </p>
      </div>
    </aside>
  )
}
