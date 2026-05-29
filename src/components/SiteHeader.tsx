import logo from '../assets/logo.png'
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
      <div className="flex items-center gap-3 md:gap-4">
        <img
          src={logo}
          alt="Where Can I Go"
          className="block h-10 w-auto shrink-0 md:h-12"
        />
        <div className="min-w-0">
          <h1 className="font-serif text-4xl tracking-tight text-ink md:text-5xl">
            Where Can I Go?
          </h1>
          <p className="mt-2 max-w-xl font-sans text-sm text-ink-soft md:text-base">
            {TAGLINE}
          </p>
        </div>
      </div>
      <BurgerButton
        open={sidebarOpen}
        onClick={onToggleSidebar}
        className="absolute top-6 right-5 md:top-8 md:right-6"
      />
    </header>
  )
}
