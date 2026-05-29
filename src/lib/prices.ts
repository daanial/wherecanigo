import { AIRPORTS_URL, PRICES_URL } from '../config'
import type { AirportsData, Destination, PriceEntry, PricesData } from './types'

export async function loadPrices(): Promise<PricesData> {
  const res = await fetch(PRICES_URL)
  if (!res.ok) throw new Error(`Failed to load prices: ${res.status}`)
  return res.json()
}

export async function loadAirports(): Promise<AirportsData> {
  const res = await fetch(AIRPORTS_URL)
  if (!res.ok) throw new Error(`Failed to load airports: ${res.status}`)
  return res.json()
}

export function getDestinationsForMonth(
  prices: PricesData,
  airports: AirportsData,
  originIata: string,
  monthKey: string,
): Destination[] {
  const byDest = prices[originIata]
  if (!byDest) return []

  const destinations: Destination[] = []

  for (const [iata, months] of Object.entries(byDest)) {
    const entry: PriceEntry | number | undefined = months[monthKey]
    if (entry == null) continue

    const airport = airports[iata]
    if (!airport) continue

    // Handle both new schema ({ ow, rt }) and legacy plain number
    const priceOw = typeof entry === 'number' ? entry : entry.ow
    const priceRt = typeof entry === 'number' ? null : (entry.rt ?? null)

    destinations.push({
      iata,
      priceOw,
      priceRt,
      lat: airport.lat,
      lon: airport.lon,
      name: airport.name,
      city: airport.city,
    })
  }

  // Sort by return price if available, else one-way
  return destinations.sort((a, b) => {
    const pa = a.priceRt ?? a.priceOw
    const pb = b.priceRt ?? b.priceOw
    return pa - pb
  })
}
