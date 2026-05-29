# Where Can I Go?

A budget-first flight discovery map. Set a home airport, a budget, and a month — the world lights up with everywhere you can afford to go.

**Stack:** React + Vite + TypeScript, Tailwind CSS, react-simple-maps. No backend — prices are a static JSON file refreshed daily by GitHub Actions.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

### First-time data setup

Airports are bundled; regenerate if needed:

```bash
npm run build:airports
```

Seed `public/data/prices.json` is committed. To refresh from Travelpayouts locally:

```bash
cp .env.example .env   # add TRAVELPAYOUTS_TOKEN
npm run fetch:prices
```

The token is read from `.env` (gitignored). Never commit it.

## Configuration

Edit [`src/config.ts`](src/config.ts):

| Constant | Description |
|----------|-------------|
| `TRAVELPAYOUTS_MARKER` | Your public affiliate partner ID (required for commission on click-outs) |

## GitHub Action (daily price refresh)

1. Add repository secret: **`TRAVELPAYOUTS_TOKEN`** — your Travelpayouts Data API token
2. Workflow [`.github/workflows/refresh-prices.yml`](.github/workflows/refresh-prices.yml) runs daily at 06:00 UTC (and on manual dispatch)
3. On change, it commits `public/data/prices.json` and pushes — Vercel redeploys automatically

## Deploy to Vercel

1. Import this repo in [Vercel](https://vercel.com)
2. Framework preset: **Vite**
3. Build command: `npm run build` · Output: `dist`
4. Add domain e.g. `fly.cubexic.com` in project settings

No server environment variables required for the frontend.

## Data shape

`public/data/prices.json`:

```json
{
  "AMS": {
    "BCN": { "2026-06": 49, "2026-07": 55 },
    "LIS": { "2026-06": 72 }
  }
}
```

## Affiliate links

Clicks open Aviasales search with your marker:

`https://search.aviasales.com/flights/?origin_iata=AMS&destination_iata=…&depart_date=YYYY-MM&marker=…`

## v0 scope

- Origin: AMS only
- Budget slider €0–500 (default €350)
- Next 6 months
- World map with price-sized/coloured dots; over-budget fades out smoothly
