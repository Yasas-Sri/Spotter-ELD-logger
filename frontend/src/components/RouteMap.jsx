import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import { useEffect } from 'react'


const STOP_COLOR = {
  start: '#A0A0AB', pickup: '#E0913D', dropoff: '#E0913D',
  fuel: '#E0913D', rest: '#5B8DEF', break: '#8A93A3',
}
const ACCENT = '#6E56CF'

function FitBounds({ geometry }) {
  const map = useMap()
  useEffect(() => {
    if (geometry?.length) map.fitBounds(geometry, { padding: [28, 28] })
  }, [geometry, map])
  return null
}

export default function RouteMap({ trip, height = 340 }) {
  const geometry = trip.route?.geometry || []
  const center = geometry[Math.floor(geometry.length / 2)] || [39.5, -98.35]
  const origin = trip.route?.legs?.[0]?.from

  return (
    <div className="route-map" style={{
      width: '100%', height, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      border: '1px solid var(--border-default)', background: 'var(--map-bg)',
    }}>
      <MapContainer center={center} zoom={5} style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false} attributionControl>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {geometry.length > 1 && (
          <Polyline positions={geometry} pathOptions={{ color: ACCENT, weight: 4, opacity: 0.95 }} />
        )}
        {origin && geometry[0] && (
          <StopDot pos={geometry[0]} color={STOP_COLOR.start} title="Start" sub={origin} />
        )}
        {(trip.stops || []).map((s, i) =>
          s.lat != null && s.lng != null ? (
            <StopDot key={i} pos={[s.lat, s.lng]} color={STOP_COLOR[s.type] || ACCENT}
              title={s.label} sub={`mile ${Math.round(s.miles_marker)}`} />
          ) : null
        )}
        <FitBounds geometry={geometry} />
      </MapContainer>
    </div>
  )
}

function StopDot({ pos, color, title, sub }) {
  return (
    <CircleMarker center={pos} radius={6}
      pathOptions={{ color, weight: 2.5, fillColor: '#0E0E13', fillOpacity: 1 }}>
      <Tooltip direction="top" offset={[0, -6]}>
        <span style={{ fontWeight: 600 }}>{title}</span>{sub ? ` · ${sub}` : ''}
      </Tooltip>
    </CircleMarker>
  )
}
