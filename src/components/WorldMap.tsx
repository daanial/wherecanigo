import { useCallback, useMemo, useRef, useState } from 'react'
import type { FeatureCollection } from 'geojson'
import Map, {
  Layer,
  type MapMouseEvent,
  type MapRef,
  Marker,
  Source,
} from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { buildAffiliateUrl } from '../lib/affiliate'
import { displayPrice, getDotStyle, getPriceRange } from '../lib/tiers'
import type { Destination } from '../lib/types'
import { MAPBOX_STYLE, MAPBOX_TOKEN } from '../config'
import { Tooltip } from './Tooltip'

interface WorldMapProps {
  originIata: string
  originLabel: string
  originCoords: [number, number]
  destinations: Destination[]
  budget: number
  monthKey: string
}

interface Hovered {
  dest: Destination
  x: number
  y: number
}

const DOTS_SOURCE = 'destinations'
const DOTS_LAYER = 'destination-dots'

function buildGeoJSON(
  destinations: Destination[],
  budget: number,
  minPrice: number,
  maxPrice: number,
): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: destinations.map((dest) => {
      const price = displayPrice(dest.priceOw, dest.priceRt)
      const style = getDotStyle(price, budget, minPrice, maxPrice)
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [dest.lon, dest.lat] },
        properties: {
          iata: dest.iata,
          city: dest.city || dest.name,
          priceOw: dest.priceOw,
          priceRt: dest.priceRt,
          dotColor: style.fill,
          dotRadius: style.radius,
          dotOpacity: style.opacity,
        },
      }
    }),
  }
}

export function WorldMap({
  originIata,
  originLabel,
  originCoords,
  destinations,
  budget,
  monthKey,
}: WorldMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [hovered, setHovered] = useState<Hovered | null>(null)
  const [cursor, setCursor] = useState('grab')

  const { min: minPrice, max: maxPrice } = useMemo(() => {
    const prices = destinations.map((d) => displayPrice(d.priceOw, d.priceRt))
    return getPriceRange(prices)
  }, [destinations])

  const geojson = useMemo(
    () => buildGeoJSON(destinations, budget, minPrice, maxPrice),
    [destinations, budget, minPrice, maxPrice],
  )

  const handleMouseMove = useCallback(
    (e: MapMouseEvent) => {
      const map = mapRef.current?.getMap()
      if (!map) return

      const features = map.queryRenderedFeatures(e.point, {
        layers: [DOTS_LAYER],
      })

      if (features.length > 0) {
        const props = features[0].properties as { iata: string }
        const dest = destinations.find((d) => d.iata === props.iata)
        if (dest) {
          setHovered({ dest, x: e.originalEvent.clientX, y: e.originalEvent.clientY })
          setCursor('pointer')
          return
        }
      }
      setHovered(null)
      setCursor('grab')
    },
    [destinations],
  )

  const handleMouseLeave = useCallback(() => {
    setHovered(null)
    setCursor('grab')
  }, [])

  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      const map = mapRef.current?.getMap()
      if (!map) return

      const features = map.queryRenderedFeatures(e.point, {
        layers: [DOTS_LAYER],
      })

      if (features.length > 0) {
        const props = features[0].properties as { iata: string }
        window.open(
          buildAffiliateUrl(originIata, props.iata, monthKey),
          '_blank',
          'noopener,noreferrer',
        )
      }
    },
    [monthKey, originIata],
  )

  return (
    <div className="relative h-full w-full">
      <Map
        key={originIata}
        ref={mapRef}
        initialViewState={{
          longitude: originCoords[0],
          latitude: originCoords[1],
          zoom: 3.2,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAPBOX_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        cursor={cursor}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        attributionControl={false}
      >
        <Source id={DOTS_SOURCE} type="geojson" data={geojson}>
          <Layer
            id={DOTS_LAYER}
            type="circle"
            paint={{
              'circle-radius': ['get', 'dotRadius'],
              'circle-color': ['get', 'dotColor'],
              'circle-opacity': ['get', 'dotOpacity'],
              'circle-stroke-width': 0,
            }}
          />
        </Source>

        {/* Origin pin */}
        <Marker longitude={originCoords[0]} latitude={originCoords[1]}>
          <div className="flex flex-col items-center" style={{ pointerEvents: 'none' }}>
            <span
              className="mb-1 rounded-sm px-1.5 py-0.5 font-sans text-xs text-ink shadow-sm"
              style={{
                background: 'var(--color-paper-raised)',
                border: '1px solid var(--color-border)',
              }}
            >
              {originLabel}
            </span>
            <div className="h-2.5 w-2.5 rounded-full bg-ink shadow-sm" />
          </div>
        </Marker>
      </Map>

      {hovered && (
        <Tooltip
          city={hovered.dest.city || hovered.dest.name}
          priceOw={hovered.dest.priceOw}
          priceRt={hovered.dest.priceRt}
          x={hovered.x}
          y={hovered.y}
        />
      )}
    </div>
  )
}
