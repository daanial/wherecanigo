#!/usr/bin/env node
/**
 * Fetches cheapest one-way and return prices per destination from Travelpayouts
 * and writes public/data/prices.json
 *
 * Schema: { origin: { dest: { "YYYY-MM": { ow: number, rt?: number } } } }
 * Requires: TRAVELPAYOUTS_TOKEN env var
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/data/prices.json')

loadDotEnv(join(__dirname, '../.env'))

const TOKEN = process.env.TRAVELPAYOUTS_TOKEN
const MONTHS_AHEAD = parseInt(process.env.MONTHS_AHEAD ?? '6', 10)
const RETURN_WINDOW = parseInt(process.env.RETURN_WINDOW ?? '7', 10)
const ORIGINS = (
  process.env.ORIGINS ??
  'ATL,DXB,HND,DFW,PVG,LHR,DEN,IST,CAN,ORD,CDG,FRA,AMS'
)
  .split(',')
  .map((s) => s.trim().toUpperCase())
  .filter(Boolean)

const API_BASE = 'https://api.travelpayouts.com/aviasales/v3/prices_for_dates'

function getUpcomingMonthKeys(count) {
  const keys = []
  const d = new Date()
  d.setDate(1)
  for (let i = 0; i < count; i++) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    keys.push(`${y}-${m}`)
    d.setMonth(d.getMonth() + 1)
  }
  return keys
}

/** Return the month that is `days` days after the first of `monthKey` */
function returnMonth(monthKey, days) {
  const [y, m] = monthKey.split('-').map(Number)
  const d = new Date(y, m - 1, 1 + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

async function fetchFlights(params) {
  const url = `${API_BASE}?${new URLSearchParams({ ...params, token: TOKEN })}`
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${res.status}: ${body.slice(0, 200)}`)
  }
  const json = await res.json()
  if (!json.success) throw new Error(`API error: ${JSON.stringify(json)}`)
  return json.data ?? []
}

function reduceFlights(flights, monthKey, destMap, field) {
  for (const flight of flights) {
    const iata =
      flight.destination_airport ??
      flight.destination_code ??
      flight.destination
    const price = flight.price
    if (!iata || typeof price !== 'number') continue

    if (!destMap[iata]) destMap[iata] = {}
    if (!destMap[iata][monthKey]) destMap[iata][monthKey] = {}

    const existing = destMap[iata][monthKey][field]
    if (existing == null || price < existing) {
      destMap[iata][monthKey][field] = Math.round(price)
    }
  }
}

async function main() {
  if (!TOKEN) {
    console.error('TRAVELPAYOUTS_TOKEN is required')
    process.exit(1)
  }

  const months = getUpcomingMonthKeys(MONTHS_AHEAD)
  const destMap = {}

  console.log(`Fetching ${ORIGINS.length} origins × ${months.length} months (OW + RT)…`)

  for (const origin of ORIGINS) {
    console.log(`Origin ${origin}`)
    const originMap = {}

    for (const monthKey of months) {
      const retKey = returnMonth(monthKey, RETURN_WINDOW)
      process.stdout.write(`  ${monthKey}  OW…`)

      const owFlights = await fetchFlights({
        origin,
        departure_at: monthKey,
        unique: 'true',
        sorting: 'price',
        one_way: 'true',
        direct: 'false',
        currency: 'eur',
        market: 'nl',
        limit: '1000',
        page: '1',
      })
      reduceFlights(owFlights, monthKey, originMap, 'ow')
      await sleep(350)

      process.stdout.write(` RT…`)

      const rtFlights = await fetchFlights({
        origin,
        departure_at: monthKey,
        return_at: retKey,
        unique: 'true',
        sorting: 'price',
        one_way: 'false',
        direct: 'false',
        currency: 'eur',
        market: 'nl',
        limit: '1000',
        page: '1',
      })
      reduceFlights(rtFlights, monthKey, originMap, 'rt')
      await sleep(350)

      console.log(` done`)
    }
    destMap[origin] = originMap
    console.log(`  → ${Object.keys(originMap).length} destinations`)
  }

  const prices = destMap
  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(prices, null, 2))
  console.log(`Wrote prices for ${Object.keys(destMap).length} origins → ${OUT}`)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function loadDotEnv(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
