/* Maps the Django payload into the shapes the vendored design components expect.
   Keeps all the "our data -> their props" glue in one place. */

const STATUS_MAP = {
  OFF_DUTY: 'off',
  SLEEPER: 'sleeper',
  DRIVING: 'driving',
  ON_DUTY: 'onduty',
}

// "2026-01-01T08:30:00" -> "08:30" (naive wall-clock from the backend).
export function formatTime(iso) {
  const t = String(iso).split('T')[1] || ''
  return t.slice(0, 5)
}

// "2026-06-23" -> "June 23, 2026"
export function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function hoursFromMidnight(iso, dayDate) {
  const midnight = new Date(`${dayDate}T00:00:00`)
  const t = new Date(iso)
  return (t - midnight) / 3600000
}

// Backend stops -> StopsTimeline items, with a synthesized "start" at the origin.
export function timelineStops(trip) {
  const origin = trip.route?.legs?.[0]?.from || 'Origin'
  const items = (trip.stops || []).map((s) => ({
    kind: s.type,
    title: TITLES[s.type] || s.type,
    time: formatTime(s.arrive),
    place: s.label,
    miles: Math.round(s.miles_marker),
  }))
  // Real departure = start of the first duty segment (not the first stop's arrival).
  const startIso = trip.logs?.[0]?.segments?.[0]?.start
  const startTime = startIso ? formatTime(startIso) : (items[0]?.time || '')
  return [{ kind: 'start', title: 'Trip start', time: startTime, place: origin, miles: 0 }, ...items]
}

const TITLES = {
  pickup: 'Pickup', dropoff: 'Dropoff', fuel: 'Fuel',
  break: '30-min break', rest: '10-hr reset',
}

// Backend logs -> array of LogSheet props (one per calendar day), with a running
// 70-hr recap seeded by the starting cycle hours.
export function logSheetDays(trip) {
  const from = trip.route?.legs?.[0]?.from || ''
  const to = trip.route?.legs?.slice(-1)?.[0]?.to || ''
  let cumulativeOnDuty = trip.summary?.cycle_used_start || 0

  return (trip.logs || []).map((day) => {
    const segments = day.segments.map((s) => ({
      status: STATUS_MAP[s.status],
      start: hoursFromMidnight(s.start, day.date),
      end: hoursFromMidnight(s.end, day.date),
    }))
    const remarks = day.segments
      .filter((s) => s.location_label)
      .map((s) => ({
        time: formatTime(s.start),
        location: s.remark ? `${s.location_label} — ${s.remark}` : s.location_label,
        status: STATUS_MAP[s.status],
      }))

    const today = (day.totals.driving || 0) + (day.totals.on_duty || 0)
    cumulativeOnDuty += today
    const recap = {
      today: round1(today),
      last7: round1(cumulativeOnDuty),
      available: round1(Math.max(0, 70 - cumulativeOnDuty)),
    }

    return {
      date: formatDate(day.date),
      from, to,
      totalMiles: day.total_miles,
      segments, remarks, recap,
    }
  })
}

function round1(n) { return Math.round(n * 10) / 10 }
