import { motion } from 'framer-motion'
import { Marker } from 'react-simple-maps'
import type { DotStyle } from '../lib/types'

interface DestinationDotProps {
  coordinates: [number, number]
  style: DotStyle
  city: string
  showLabel: boolean
  onHover: (active: boolean, clientX?: number, clientY?: number) => void
  onClick: () => void
}

export function DestinationDot({
  coordinates,
  style,
  city,
  showLabel,
  onHover,
  onClick,
}: DestinationDotProps) {
  return (
    <Marker coordinates={coordinates}>
      <motion.circle
        r={style.radius}
        fill={style.fill}
        initial={false}
        animate={{
          r: style.radius,
          fill: style.fill,
          opacity: style.opacity,
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="cursor-pointer"
        style={{ pointerEvents: 'all' }}
        onMouseEnter={(e) => onHover(true, e.clientX, e.clientY)}
        onMouseMove={(e) => onHover(true, e.clientX, e.clientY)}
        onMouseLeave={() => onHover(false)}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      />
      {showLabel && (
        <motion.text
          textAnchor="middle"
          y={-(style.radius + 4)}
          initial={{ opacity: 0 }}
          animate={{ opacity: style.opacity * 0.9 }}
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '5px',
            fill: 'var(--color-ink)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {city}
        </motion.text>
      )}
    </Marker>
  )
}
