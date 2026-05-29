/// <reference types="vite/client" />

declare module 'react-simple-maps' {
  import type { ComponentType, ReactNode, SVGProps } from 'react'

  export interface ProjectionConfig {
    scale?: number
    center?: [number, number]
    rotate?: [number, number, number]
  }

  export interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string
    projectionConfig?: ProjectionConfig
    width?: number
    height?: number
    children?: ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (data: {
      geographies: Array<{
        rsmKey: string
        properties: Record<string, unknown>
        [key: string]: unknown
      }>
    }) => ReactNode
  }

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: object
    style?: {
      default?: SVGProps<SVGPathElement>
      hover?: SVGProps<SVGPathElement>
      pressed?: SVGProps<SVGPathElement>
    }
  }

  export interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
  }

  export interface ZoomableGroupProps {
    zoom?: number
    center?: [number, number]
    minZoom?: number
    maxZoom?: number
    translateExtent?: [[number, number], [number, number]]
    onMoveEnd?: (pos: { coordinates: [number, number]; zoom: number }) => void
    children?: ReactNode
  }

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
  export const Marker: ComponentType<MarkerProps>
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>
}
