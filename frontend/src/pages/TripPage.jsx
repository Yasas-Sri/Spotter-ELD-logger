import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Badge, Button, Card, CardContent } from "@/components/ui"
import Dashboard from "../components/Dashboard.jsx"
import TripResult from "../components/TripResult.jsx"
import { getTrip, planTrip } from "../api/client.js"

export default function TripPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    let alive = true
    setTrip(null)
    setError("")
    setBusy(false) // new id loaded -> clear the recompute spinner
    getTrip(id).then((t) => alive && setTrip(t)).catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [id])

  const compute = async (input) => {
    setBusy(true)
    setFormError("")
    try {
      const t = await planTrip(input)
      navigate(`/trip/${t.id}`)
    } catch (e) {
      setFormError(e.message)
      setBusy(false)
    }
  }

  const initial = trip
    ? {
        from: trip.route?.legs?.[0]?.from,
        pickup: trip.route?.legs?.[0]?.to,
        to: trip.route?.legs?.slice(-1)?.[0]?.to,
        cycle: trip.summary?.cycle_used_start ?? 0,
      }
    : undefined

  const headerNote = trip && (
    <div className="border-b border-(--border-subtle) bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3">
        {/* <Badge variant="accent">
          <span className="size-1.5 rounded-full bg-current" />
          Trip #{trip.id}
        </Badge> */}
        <span className="text-[13px] text-muted-foreground">
          {trip.route?.legs?.[0]?.from} <span className="text-(--text-disabled)">→</span>{" "}
          {trip.route?.legs?.slice(-1)?.[0]?.to}
        </span>
        {trip.meta?.route_source === "mock" && <Badge variant="warning">Demo route</Badge>}
        {/* <span className="ml-auto text-xs text-muted-foreground">Shareable · saved plan</span> */}
      </div>
    </div>
  )

  return (
    <Dashboard headerNote={headerNote} formProps={{ onCompute: compute, busy, error: formError, initial }}>
      {error && <ErrorState message={error} onBack={() => navigate("/plan")} />}
      {!error && !trip && <LoadingState />}
      {!error && trip && <TripResult trip={trip} />}
    </Dashboard>
  )
}

function Sk({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-(--bg-elevated-2)", className)} />
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-7">
      <div className="text-[13px] text-muted-foreground">Loading trip… the server may be waking up.</div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="flex flex-col gap-3.5">
              <Sk className="h-2.5 w-3/5" />
              <Sk className="h-5 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Sk className="h-85" />
        <Card>
          <CardContent className="flex flex-col gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2.5">
                <Sk className="size-6.5" />
                <div className="flex-1">
                  <Sk className="h-2.5 w-[70%]" />
                  <div className="h-1.5" />
                  <Sk className="h-2 w-[45%]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Sk className="h-75" />
    </div>
  )
}

function ErrorState({ message, onBack }) {
  return (
    <Card>
      <CardContent className="py-10 text-center">
        <div className="mb-2 text-base font-semibold">Could not load this trip</div>
        <p className="mb-4.5 text-[13.5px] text-muted-foreground">{message}</p>
        <Button variant="secondary" onClick={onBack}>
          Back to planner
        </Button>
      </CardContent>
    </Card>
  )
}
