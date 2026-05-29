interface BurgerButtonProps {
  onClick: () => void
  open: boolean
  className?: string
}

export function BurgerButton({ onClick, open, className = '' }: BurgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? 'Close menu' : 'Open about panel'}
      className={[
        'flex h-10 w-10 flex-col items-center justify-center gap-1.5',
        'rounded-sm bg-paper-raised/95 ring-1 ring-border shadow-sm backdrop-blur-sm',
        'transition-colors hover:bg-paper-raised',
        className,
      ].join(' ')}
    >
      <span
        className={[
          'block h-0.5 w-5 bg-ink transition-transform duration-200',
          open ? 'translate-y-2 rotate-45' : '',
        ].join(' ')}
      />
      <span
        className={[
          'block h-0.5 w-5 bg-ink transition-opacity duration-200',
          open ? 'opacity-0' : '',
        ].join(' ')}
      />
      <span
        className={[
          'block h-0.5 w-5 bg-ink transition-transform duration-200',
          open ? '-translate-y-2 -rotate-45' : '',
        ].join(' ')}
      />
    </button>
  )
}
