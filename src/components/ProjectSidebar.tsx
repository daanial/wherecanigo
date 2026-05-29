interface ProjectSidebarProps {
  className?: string
  onClose?: () => void
}

const linkClass =
  'text-ink underline decoration-border underline-offset-2 hover:text-accent hover:decoration-accent'

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
        <h2 className="font-serif text-xl text-ink">About Where Can I Go?</h2>

        <p className="mt-4 font-sans text-sm leading-relaxed text-ink-soft">
          Where Can I Go? is a free budget flight map for travellers who want
          inspiration before they search. Choose a departure airport — Amsterdam,
          London, Dubai, and other major hubs — set a return budget in euros, and
          pick a month. The map shows cheap flights and affordable destinations
          you can reach from that city.
        </p>

        <p className="mt-4 font-sans text-sm leading-relaxed text-ink-soft">
          This is a discovery tool, not a booking engine or a traditional flight
          search. Cheaper routes appear larger and warmer on the map; destinations
          above your budget fade away as you move the slider. It is built for
          weekend breaks, city trips, and “where can I afford to fly?” planning.
        </p>

        <p className="mt-4 font-sans text-sm leading-relaxed text-ink-soft">
          Fares are updated daily from real price data (one-way and return where
          available). Click any destination to open a return flight search in
          euros. No sign-up, no app — just a map and a budget.
        </p>

        <h3 className="mt-6 font-serif text-base text-ink">How to use it</h3>
        <ul className="mt-2 list-inside list-disc space-y-1.5 font-sans text-sm leading-relaxed text-ink-soft">
          <li>Select your home airport from the dropdown</li>
          <li>Set your return budget with the slider</li>
          <li>Choose a travel month</li>
          <li>Explore dots on the map and click for live prices</li>
        </ul>

        <hr className="my-6 border-border" />

        <h3 className="font-serif text-base text-ink">About the project</h3>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink-soft">
          Where Can I Go? is a side project by{' '}
          <a
            href="https://cubexic.com"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Danial Keshani
          </a>{' '}
          and{' '}
          <a
            href="https://cubexic.com"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Cubex
          </a>
          . More experiments in travel, maps, and simple tools live at{' '}
          <a
            href="https://cubexic.com"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            cubexic.com
          </a>
          .
        </p>

        <p className="mt-4 font-sans text-xs leading-relaxed text-ink-soft/80">
          The site runs as a static web app: no server at request time. Flight
          prices are stored in a JSON file refreshed by an automated job. Map
          tiles by Mapbox; fare data via Travelpayouts / Aviasales affiliate
          links.
        </p>
      </div>
    </aside>
  )
}
