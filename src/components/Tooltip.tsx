interface TooltipProps {
  city: string
  priceOw: number
  priceRt: number | null
  x: number
  y: number
}

export function Tooltip({ city, priceOw, priceRt, x, y }: TooltipProps) {
  return (
    <div
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full"
      style={{ left: x, top: y - 12 }}
    >
      <div className="rounded-sm bg-paper-raised px-3 py-2 shadow-sm ring-1 ring-border">
        <p className="font-sans text-sm text-ink-soft">{city}</p>
        {priceRt != null ? (
          <>
            <p className="font-serif text-lg text-ink">€{priceRt} return</p>
            <p className="font-sans text-xs text-ink-soft">€{priceOw} one way</p>
          </>
        ) : (
          <p className="font-serif text-lg text-ink">€{priceOw} one way</p>
        )}
      </div>
    </div>
  )
}
