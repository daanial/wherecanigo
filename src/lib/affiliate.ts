import { TRAVELPAYOUTS_MARKER } from '../config'

/**
 * Builds an Aviasales.com international search deep-link.
 *
 * Round-trip path format (returns HTTP 200 directly on aviasales.com):
 *   /search/ORIGIN + DDMM(depart) + DEST + DDMM(return) + ORIGIN + pax
 *   e.g. /search/AMS0106BCN0806AMS1 → AMS→BCN 1 Jun, return 8 Jun
 *
 * Departure: 1st of the chosen month
 * Return: 7 days later
 */
export function buildAffiliateUrl(
  originIata: string,
  destinationIata: string,
  monthKey: string,
): string {
  const [year, month] = monthKey.split('-')

  // Departure: 8th of the month — always in the future for any upcoming month,
  // gives ~1 week of lead time and avoids sending past dates to Aviasales.
  const departDay = '08'
  const departMM = month

  // Return: 7 days after departure (the 15th)
  const retDate = new Date(Number(year), Number(month) - 1, 15)
  const retDay = String(retDate.getDate()).padStart(2, '0')
  const retMM = String(retDate.getMonth() + 1).padStart(2, '0')

  // Round-trip path: ORIGIN + DDMM(depart) + DEST + DDMM(return) + ORIGIN + pax
  const path = `/search/${originIata}${departDay}${departMM}${destinationIata}${retDay}${retMM}${originIata}1`

  const params = new URLSearchParams({
    cy: 'eur',
    locale: 'en',
  })
  if (TRAVELPAYOUTS_MARKER !== 'YOUR_MARKER_HERE') {
    params.set('marker', TRAVELPAYOUTS_MARKER)
  }

  return `https://www.aviasales.com${path}?${params.toString()}`
}
