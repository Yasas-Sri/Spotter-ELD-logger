const ROWS = [
  { key: 'off', label: '1. Off Duty' },
  { key: 'sleeper', label: '2. Sleeper Berth' },
  { key: 'driving', label: '3. Driving' },
  { key: 'onduty', label: '4. On Duty (Not Driving)' },
]
const ROW_INDEX = { off: 0, sleeper: 1, driving: 2, onduty: 3 }
const COLOR = { off: 'var(--duty-off)', sleeper: 'var(--duty-sleeper)', driving: 'var(--duty-driving)', onduty: 'var(--duty-onduty)' }


const labelW = 160, hourW = 26, totalW = 56, rowH = 30, axisH = 26
const gridW = hourW * 24
const W = labelW + gridW + totalW
const H = axisH + rowH * 4

const xAt = (h) => labelW + h * hourW
const yAt = (status) => axisH + ROW_INDEX[status] * rowH + rowH / 2

function hourLabel(i) {
  if (i === 0 || i === 24) return 'Mid-night'
  if (i === 12) return 'Noon'
  return String(i % 12)
}

export default function LogSheet({
  date, from, to, totalMiles,
  carrier = 'Spotter Logistics, Inc.',
  mileageTotal = '', truckNumbers = '', mainOffice = '', homeTerminal = '',
  shippingDocs = '', manifestNo = '', shipperCommodity = '',
  segments = [], remarks = [], recap,
}) {
  const totals = { off: 0, sleeper: 0, driving: 0, onduty: 0 }
  segments.forEach((s) => { totals[s.status] += s.end - s.start })

  return (
    <div style={{ background: 'var(--paper-bg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-paper)', padding: '24px 26px 22px', color: 'var(--paper-ink)', fontFamily: 'var(--font-sans)' }}>
      

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
        <div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em' }}>Driver's Daily Log</span>
          <span style={{ fontSize: 11, color: 'var(--paper-ink-soft)', marginLeft: 8 }}>(24 hours)</span>
        </div>
        <div style={{ fontSize: 9.5, color: 'var(--paper-faint)', lineHeight: 1.5, textAlign: 'right' }}>
          Original — File at home terminal.<br />
          Duplicate — Driver retains in his/her possession for 8 days.
        </div>
      </div>


      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, borderBottom: '1px solid var(--paper-rule)', padding: '0 28px 3px' }}>{date}</div>
      </div>

      
      <Line label="From" value={from} />
      <Line label="To" value={to} />

      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, margin: '14px 0 4px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Box caption="Total Miles Driving Today" value={String(totalMiles ?? '')} mono />
            <Box caption="Total Mileage Today" value={mileageTotal} mono />
          </div>
          <Box caption="Truck/Tractor and Trailer Numbers or License Plate(s)/State (show each unit)" value={truckNumbers} minH={42} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Box caption="Name of Carrier or Carriers" value={carrier} />
          <Box caption="Main Office Address" value={mainOffice} />
          <Box caption="Home Terminal Address" value={homeTerminal} />
        </div>
      </div>

      
      <div style={{ width: '100%', overflowX: 'auto', marginTop: 14 }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 720, display: 'block' }}>
          
          {Array.from({ length: 25 }, (_, i) => (
            <g key={i}>
              <line x1={xAt(i)} y1={axisH} x2={xAt(i)} y2={H} stroke="var(--paper-grid)" strokeWidth={i % 6 === 0 ? 1.1 : 0.6} />
              <text x={xAt(i)} y={axisH - 8} textAnchor="middle" fontSize={i === 0 || i === 12 || i === 24 ? '7.5' : '8.5'} fontFamily="var(--font-mono)" fill="var(--paper-faint)">{hourLabel(i)}</text>
            </g>
          ))}
          
          {Array.from({ length: 24 * 4 + 1 }, (_, q) => {
            if (q % 4 === 0) return null
            const x = labelW + (q / 4) * hourW
            return <line key={`q${q}`} x1={x} y1={axisH} x2={x} y2={H} stroke="var(--paper-grid-fine)" strokeWidth="0.5" />
          })}
          
          {ROWS.map((r, idx) => {
            const yTop = axisH + idx * rowH
            return (
              <g key={r.key}>
                <line x1={0} y1={yTop} x2={W} y2={yTop} stroke="var(--paper-grid)" strokeWidth="0.8" />
                <rect x={0} y={yTop} width={labelW} height={rowH} fill={idx % 2 ? 'var(--paper-fill)' : 'transparent'} opacity="0.5" />
                <text x={10} y={yTop + rowH / 2 + 3.5} fontSize="10.5" fill="var(--paper-ink-soft)">{r.label}</text>
                <text x={labelW + gridW + totalW / 2} y={yTop + rowH / 2 + 4} textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600" fill="var(--paper-ink)">{fmt(totals[r.key])}</text>
              </g>
            )
          })}
          <line x1={0} y1={H} x2={W} y2={H} stroke="var(--paper-rule)" strokeWidth="1" />
          <line x1={labelW} y1={axisH} x2={labelW} y2={H} stroke="var(--paper-rule)" strokeWidth="1" />
          <line x1={labelW + gridW} y1={axisH} x2={labelW + gridW} y2={H} stroke="var(--paper-rule)" strokeWidth="1" />
          <text x={labelW + gridW + totalW / 2} y={axisH - 8} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--paper-faint)">Total Hours</text>

          
          {segments.map((s, i) => (
            <line key={`h${i}`} x1={xAt(s.start)} y1={yAt(s.status)} x2={xAt(s.end)} y2={yAt(s.status)}
              stroke={COLOR[s.status]} strokeWidth="2.4" strokeLinecap="round" />
          ))}
          {segments.slice(1).map((s, i) => {
            const prev = segments[i]
            return <line key={`v${i}`} x1={xAt(s.start)} y1={yAt(prev.status)} x2={xAt(s.start)} y2={yAt(s.status)}
              stroke="var(--paper-ink-soft)" strokeWidth="1.6" />
          })}
        </svg>
      </div>

    
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Remarks</div>
        <div style={{ fontSize: 10, color: 'var(--paper-faint)', margin: '2px 0 10px', lineHeight: 1.5 }}>
          Enter name of place you reported and where released from work and when and where each change of duty occurred. Use time standard of home terminal.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderLeft: '1px solid var(--paper-rule)', paddingLeft: 12 }}>
          {remarks.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: COLOR[r.status] || 'var(--paper-faint)', flex: 'none' }} />
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--paper-ink)', flex: 'none' }}>{r.time}</span>
              <span style={{ color: 'var(--paper-ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.location}</span>
            </div>
          ))}
        </div>
      </div>

      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 16 }}>
        <Box caption="Shipping Documents" value={shippingDocs} />
        <Box caption="DVL or Manifest No." value={manifestNo} />
        <Box caption="Shipper & Commodity" value={shipperCommodity} />
      </div>

      
      <div style={{ marginTop: 18, borderTop: '1px solid var(--paper-grid)', paddingTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Recap — complete at end of day</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <RecapBlock title="70 Hour / 8 Day Drivers"
            a={recap ? fmt(recap.today) : ''}
            b={recap ? fmt(recap.available) : ''}
            c={recap ? fmt(recap.last7) : ''}
            limit="70" />
          <RecapBlock title="60 Hour / 7 Day Drivers" a="" b="" c="" limit="60" />
        </div>
        <div style={{ fontSize: 9.5, color: 'var(--paper-faint)', marginTop: 10, lineHeight: 1.5 }}>
          * If you took 34 consecutive hours off duty you have 60 / 70 hours available.
        </div>
      </div>
    </div>
  )
}


function Line({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--paper-ink-soft)', flex: 'none' }}>{label}:</span>
      <span style={{ flex: 1, borderBottom: '1px solid var(--paper-rule)', fontSize: 12.5, fontWeight: 500, paddingBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || ' '}</span>
    </div>
  )
}


function Box({ caption, value, mono, minH = 30 }) {
  return (
    <div>
      <div style={{
        border: '1px solid var(--paper-rule)', borderRadius: 3, minHeight: minH,
        display: 'flex', alignItems: 'center', padding: '4px 8px',
        fontSize: 12, fontWeight: 500, color: 'var(--paper-ink)',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{value || ' '}</div>
      <div style={{ fontSize: 8.5, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--paper-faint)', textAlign: 'center', marginTop: 3, lineHeight: 1.3 }}>{caption}</div>
    </div>
  )
}

function RecapBlock({ title, a, b, c, limit }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--paper-ink-soft)', marginBottom: 6 }}>{title}</div>
      <RecapRow label="A. Total hours on duty today (lines 3 & 4)" value={a} />
      <RecapRow label={`B. Total hours available tomorrow (${limit} hr minus A)`} value={b} strong />
      <RecapRow label="C. Total hours last 7 days including today" value={c} />
    </div>
  )
}

function RecapRow({ label, value, strong }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, borderBottom: '1px solid var(--paper-grid-fine)', padding: '4px 0' }}>
      <span style={{ fontSize: 10.5, color: 'var(--paper-ink-soft)', lineHeight: 1.3 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: strong ? 700 : 500, color: strong ? 'var(--accent-active)' : 'var(--paper-ink)', flex: 'none' }}>{value !== '' ? `${value} h` : '—'}</span>
    </div>
  )
}

function fmt(n) {
  const v = Math.round((n || 0) * 4) / 4
  return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0$/, '')
}
