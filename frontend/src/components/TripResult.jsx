import { Badge, Button, Card, CardContent, DutyLegend, SummaryCard } from "@/components/ui"
import { Icon } from "./icons.jsx"
import RouteMap from "./RouteMap.jsx"
import StopsTimeline from "./StopsTimeline.jsx"
import LogSheet from "./LogSheet.jsx"
import { timelineStops, logSheetDays } from "../utils/adapt.js"

function Section({ title, right, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-(length:--text-overline) font-semibold tracking-(--ls-overline) text-muted-foreground uppercase">
          {title}
        </span>
        {right}
      </div>
      {children}
    </div>
  )
}

export default function TripResult({ trip }) {
  const s = trip.summary || {}
  const days = logSheetDays(trip)
  const stops = timelineStops(trip)

  return (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <SummaryCard label="Distance" value={Math.round(s.total_distance_miles)} unit="mi" icon={<Icon.route />} accent />
        <SummaryCard label="Drive time" value={fmtHours(s.total_driving_hours)} unit="hrs" icon={<Icon.clock />} />
        <SummaryCard label="Days" value={s.total_days} sub={`${s.total_days} log sheet${s.total_days > 1 ? "s" : ""}`} icon={<Icon.doc />} />
        <SummaryCard label="Rest stops" value={s.rest_stops} sub="incl. resets" icon={<Icon.pin />} />
        <SummaryCard label="Fuel stops" value={s.fuel_stops} sub="every ~1,000 mi" icon={<Icon.gauge />} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Section title="Route" right={<DutyLegend size="sm" />}>
          <RouteMap trip={trip} height={340} />
        </Section>
        <Section title="Stops timeline">
          <Card>
            <CardContent>
              <StopsTimeline stops={stops} />
            </CardContent>
          </Card>
        </Section>
      </div>

      <Section
        title="Daily log sheets"
        right={
          <div className="flex items-center gap-2.5">
            <Badge variant="neutral">{days.length} day{days.length > 1 ? "s" : ""}</Badge>
            <Button variant="secondary" size="sm" onClick={() => window.print()}>
              <Icon.doc /> Download PDF
            </Button>
          </div>
        }
      >
        <div className="logs-print flex flex-col gap-5">
          {days.map((d, i) => (
            <LogSheet key={i} {...d} />
          ))}
        </div>
      </Section>
    </div>
  )
}

function fmtHours(h) {
  if (h == null) return "—"
  const hh = Math.floor(h)
  const mm = Math.round((h - hh) * 60)
  return `${hh}:${String(mm).padStart(2, "0")}`
}
