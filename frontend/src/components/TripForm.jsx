import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button, Input, Label, NumberStepper, Spinner } from "@/components/ui"
import { Icon } from "./icons.jsx"


function localNow() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function Field({ id, label, icon, error, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground">{icon}</span>
        )}
        <Input id={id} aria-invalid={!!error} className={cn(icon && "pl-8")} {...props} />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default function TripForm({ onCompute, busy, error, initial }) {
  const [from, setFrom] = useState(initial?.from || "")
  const [pickup, setPickup] = useState(initial?.pickup || "")
  const [to, setTo] = useState(initial?.to || "")
  const [cycle, setCycle] = useState(initial?.cycle ?? 0)
  const [departure, setDeparture] = useState(initial?.departure || localNow())
  const [touched, setTouched] = useState(false)

  const err = (v) => (touched && !String(v).trim() ? "Required" : "")
  const valid = from.trim() && pickup.trim() && to.trim()

  const submit = () => {
    setTouched(true)
    if (!valid || busy) return
    onCompute({
      current_location: from.trim(),
      pickup_location: pickup.trim(),
      dropoff_location: to.trim(),
      current_cycle_used: Number(cycle) || 0,
      departure_datetime: departure || localNow(),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon.route className="text-muted-foreground" />
        <span className="text-[13.5px] font-semibold text-foreground">Trip details</span>
      </div>

      <Field id="from" label="Current location" placeholder="Sacramento, CA" value={from}
        onChange={(e) => setFrom(e.target.value)} error={err(from)} icon={<Icon.pin />} />
      <Field id="pickup" label="Pickup location" placeholder="Port of Sacramento" value={pickup}
        onChange={(e) => setPickup(e.target.value)} error={err(pickup)} icon={<Icon.pin />} />
      <Field id="to" label="Dropoff location" placeholder="Santa Clarita, CA" value={to}
        onChange={(e) => setTo(e.target.value)} error={err(to)} icon={<Icon.pin />} />

      <NumberStepper id="cycle" label="Cycle hours used" value={cycle} onChange={setCycle}
        min={0} max={70} step={0.5} hint="Hours used in your current 70 hr / 8 day cycle" />

      <div className="flex flex-col gap-2">
        <Label htmlFor="departure">Departure</Label>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground">
            <Icon.clock />
          </span>
          <Input id="departure" type="datetime-local" className="pl-8" value={departure}
            onChange={(e) => setDeparture(e.target.value)} />
        </div>
        <p className="text-xs leading-snug text-muted-foreground">Your local start time. Defaults to now.</p>
      </div>

      <Button size="lg" className="mt-1 w-full" disabled={busy} onClick={submit}>
        {busy ? (
          <>
            <Spinner /> Computing route…
          </>
        ) : (
          <>
            Plan trip <Icon.arrow />
          </>
        )}
      </Button>

      {error && <p className="text-xs leading-snug text-destructive">{error}</p>}
      <p className="text-[11.5px] leading-snug text-muted-foreground">
        Plans assume a 10 hr reset is available at each rest stop.
      </p>
    </div>
  )
}
