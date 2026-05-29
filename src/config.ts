/** Public Travelpayouts affiliate marker — replace with your partner ID */
export const TRAVELPAYOUTS_MARKER = '733825'

export interface OriginOption {
  code: string
  city: string
  airport: string
}

export const DEFAULT_ORIGIN = 'AMS' as const

// User-provided list: world top airports + requested EU hubs
export const ORIGIN_OPTIONS: OriginOption[] = [
  { code: 'ATL', city: 'Atlanta', airport: 'Hartsfield-Jackson Atlanta International' },
  { code: 'DXB', city: 'Dubai', airport: 'Dubai International' },
  { code: 'HND', city: 'Tokyo', airport: 'Tokyo Haneda' },
  { code: 'DFW', city: 'Dallas/Fort Worth', airport: 'Dallas/Fort Worth International' },
  { code: 'PVG', city: 'Shanghai', airport: 'Shanghai Pudong' },
  { code: 'LHR', city: 'London', airport: 'London Heathrow' },
  { code: 'DEN', city: 'Denver', airport: 'Denver International' },
  { code: 'IST', city: 'Istanbul', airport: 'Istanbul Airport' },
  { code: 'CAN', city: 'Guangzhou', airport: 'Guangzhou Baiyun' },
  { code: 'ORD', city: 'Chicago', airport: "Chicago O'Hare International" },
  { code: 'CDG', city: 'Paris', airport: 'Paris Charles de Gaulle' },
  { code: 'FRA', city: 'Frankfurt', airport: 'Frankfurt' },
  { code: 'AMS', city: 'Amsterdam', airport: 'Amsterdam Schiphol' },
]

export const BUDGET_MIN = 0
export const BUDGET_MAX = 500
export const BUDGET_DEFAULT = 350

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string
export const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v11'

export const PRICES_URL = '/data/prices.json'
export const AIRPORTS_URL = '/data/airports.json'
