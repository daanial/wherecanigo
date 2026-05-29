#!/usr/bin/env node
/**
 * Downloads OpenFlights airports.dat and writes public/data/airports.json
 * { IATA: { lat, lon, name, city } }
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/data/airports.json')
const URL =
  'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat'

async function main() {
  console.log('Fetching OpenFlights airports.dat…')
  const res = await fetch(URL)
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
  const text = await res.text()

  const airports = {}

  for (const line of text.split('\n')) {
    if (!line.trim()) continue
    const fields = parseCsvLine(line)
    if (fields.length < 14) continue

    const name = fields[1]
    const city = fields[2]
    const country = fields[3]
    const iata = fields[4]
    const lat = parseFloat(fields[6])
    const lon = parseFloat(fields[7])

    if (!iata || iata === '\\N' || iata.length !== 3) continue
    if (Number.isNaN(lat) || Number.isNaN(lon)) continue

    airports[iata] = {
      lat,
      lon,
      name: name.replace(/^"|"$/g, ''),
      city: city.replace(/^"|"$/g, ''),
      country,
    }
  }

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(airports))
  console.log(`Wrote ${Object.keys(airports).length} airports → ${OUT}`)
}

function parseCsvLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQuotes = !inQuotes
    } else if (c === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += c
    }
  }
  fields.push(current)
  return fields
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
