const KIND = {
  start: { color: 'var(--text-secondary)', label: 'Start', glyph: 'dot' },
  pickup: { color: 'var(--duty-onduty)', label: 'Pickup', glyph: 'box' },
  dropoff: { color: 'var(--duty-onduty)', label: 'Dropoff', glyph: 'flag' },
  fuel: { color: 'var(--duty-onduty)', label: 'Fuel', glyph: 'fuel' },
  break: { color: 'var(--duty-off)', label: '30-min break', glyph: 'pause' },
  rest: { color: 'var(--duty-sleeper)', label: '10-hr reset', glyph: 'moon' },
}

function Glyph({ type }) {
  const p = { width: 13, height: 13, viewBox: '0 0 13 13', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'box': return <svg {...p}><path d="M6.5 1.5 11 4v5L6.5 11.5 2 9V4Z" /><path d="M2 4l4.5 2.5L11 4" /></svg>
    case 'flag': return <svg {...p}><path d="M3 1.5v10" /><path d="M3 2.2h7l-1.6 2L10 6.2H3" /></svg>
    case 'fuel': return <svg {...p}><path d="M3 11.5V3a1.5 1.5 0 0 1 1.5-1.5H7A1.5 1.5 0 0 1 8.5 3v8.5" /><path d="M2 11.5h7.5M8.5 5.5h1.2a1 1 0 0 1 1 1V9a.8.8 0 0 0 1.3.6" /></svg>
    case 'pause': return <svg {...p}><path d="M5 3.5v6M8 3.5v6" /></svg>
    case 'moon': return <svg {...p}><path d="M10 7.2A4 4 0 1 1 5.8 3a3 3 0 0 0 4.2 4.2Z" /></svg>
    default: return <svg {...p}><circle cx="6.5" cy="6.5" r="2.4" fill="currentColor" stroke="none" /></svg>
  }
}

export default function StopsTimeline({ stops = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {stops.map((s, i) => {
        const k = KIND[s.kind] || KIND.start
        const last = i === stops.length - 1
        return (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 26, flex: 'none' }}>
              <span style={{ width: 26, height: 26, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated-2)', border: '1px solid var(--border-default)', color: k.color, flex: 'none' }}>
                <Glyph type={k.glyph} />
              </span>
              {!last && <span style={{ flex: 1, width: 2, minHeight: 22, background: 'var(--border-default)', margin: '2px 0' }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: last ? 0 : 16, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{s.title || k.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-data-sm)', color: 'var(--text-secondary)', flex: 'none' }}>{s.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginTop: 2 }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.place}</span>
                {s.miles != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', flex: 'none' }}>{s.miles} mi</span>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
