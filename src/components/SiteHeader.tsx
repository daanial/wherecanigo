import { BurgerButton } from './BurgerButton'

const TAGLINE =
  'Set a budget and a month — see where you can fly from, on one map.'

interface SiteHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function SiteHeader({ sidebarOpen, onToggleSidebar }: SiteHeaderProps) {
  return (
    <header className="relative shrink-0 px-5 pt-6 pb-4 pr-16 md:px-6 md:pt-8 md:pr-20">
      <h1 className="font-serif text-4xl tracking-tight text-ink md:text-5xl">
        Where Can I Go?
      </h1>
      <p className="mt-2 max-w-xl font-sans text-sm text-ink-soft md:text-base">
        {TAGLINE}
      </p>
      <BurgerButton
        open={sidebarOpen}
        onClick={onToggleSidebar}
        className="absolute top-6 right-5 md:top-8 md:right-6"
      />
    </header>
  )
}
