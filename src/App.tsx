import { useEffect, useMemo, useState } from 'react'
import { BottomSheet } from './components/BottomSheet'
import { ControlBar } from './components/ControlBar'
import { ProjectSidebar } from './components/ProjectSidebar'
import { SiteHeader } from './components/SiteHeader'
import { WorldMap } from './components/WorldMap'
import {
  BUDGET_DEFAULT,
  BUDGET_MAX,
  BUDGET_MIN,
  DEFAULT_ORIGIN,
  ORIGIN_OPTIONS,
} from './config'
import { getDefaultMonth, getUpcomingMonths } from './lib/months'
import {
  getDestinationsForMonth,
  loadAirports,
  loadPrices,
} from './lib/prices'
import type { AirportsData, PricesData } from './lib/types'

export default function App() {
  const months = useMemo(() => getUpcomingMonths(6), [])
  const [budget, setBudget] = useState(BUDGET_DEFAULT)
  const [selectedOrigin, setSelectedOrigin] = useState<string>(DEFAULT_ORIGIN)
  const [selectedMonth, setSelectedMonth] = useState(() =>
    getDefaultMonth(months),
  )
  const [prices, setPrices] = useState<PricesData | null>(null)
  const [airports, setAirports] = useState<AirportsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    Promise.all([loadPrices(), loadAirports()])
      .then(([p, a]) => {
        setPrices(p)
        setAirports(a)
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load'),
      )
      .finally(() => setLoading(false))
  }, [])

  const destinations = useMemo(() => {
    if (!prices || !airports) return []
    return getDestinationsForMonth(
      prices,
      airports,
      selectedOrigin,
      selectedMonth,
    )
  }, [prices, airports, selectedOrigin, selectedMonth])

  const selectedOriginAirport = useMemo(
    () => (airports ? airports[selectedOrigin] : undefined),
    [airports, selectedOrigin],
  )
  const selectedOriginOption = useMemo(
    () => ORIGIN_OPTIONS.find((o) => o.code === selectedOrigin),
    [selectedOrigin],
  )
  const originCoords: [number, number] = selectedOriginAirport
    ? [selectedOriginAirport.lon, selectedOriginAirport.lat]
    : [4.897, 52.374]
  const originLabel = selectedOriginOption?.city ?? selectedOrigin

  const clampedBudget = Math.min(BUDGET_MAX, Math.max(BUDGET_MIN, budget))

  const controlBarProps = {
    origins: ORIGIN_OPTIONS,
    selectedOrigin,
    onOriginChange: setSelectedOrigin,
    budget: clampedBudget,
    onBudgetChange: setBudget,
    months,
    selectedMonth,
    onMonthChange: setSelectedMonth,
  }

  return (
    <div className="relative flex h-full min-h-dvh flex-col overflow-hidden bg-paper">
      <SiteHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />

      <main className="relative min-h-0 flex-1 pb-[min(45vh,260px)] lg:pb-28">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-paper">
            <p className="font-sans text-sm text-ink-soft">Loading map…</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-paper px-6">
            <p className="text-center font-sans text-sm text-accent">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <WorldMap
            originIata={selectedOrigin}
            originLabel={originLabel}
            originCoords={originCoords}
            destinations={destinations}
            budget={clampedBudget}
            monthKey={selectedMonth}
          />
        )}
      </main>

      {/* Desktop: full-width bottom control bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 hidden border-t border-border bg-paper-raised/95 backdrop-blur-sm lg:block">
        <div className="pointer-events-auto w-full px-4 py-4 md:px-6">
          <ControlBar {...controlBarProps} layout="bar" />
        </div>
      </div>

      {/* Mobile: full-width bottom sheet */}
      <BottomSheet>
        <ControlBar {...controlBarProps} layout="sheet" />
      </BottomSheet>

      {/* Sidebar drawer (all screen sizes) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/25"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-[min(100%,20rem)] shadow-xl md:w-80">
            <ProjectSidebar
              className="h-full"
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
