export interface PriceEntry {
  ow: number       // cheapest one-way
  rt?: number      // cheapest return (round-trip)
}

/** { origin: { destination: { "YYYY-MM": PriceEntry } } } */
export type PricesData = Record<string, Record<string, Record<string, PriceEntry>>>

export interface Airport {
  lat: number
  lon: number
  name: string
  city: string
}

export type AirportsData = Record<string, Airport>

export interface Destination {
  iata: string
  priceOw: number
  priceRt: number | null
  lat: number
  lon: number
  name: string
  city: string
}

export interface DotStyle {
  radius: number
  fill: string
  opacity: number
}
