/* Planner (/plan): the dashboard with the form. On submit, compute and navigate
   to the shareable /trip/:id result. */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Dashboard, { EmptyState } from '../components/Dashboard.jsx'
import { planTrip } from '../api/client.js'

export default function PlannerPage() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const compute = async (input) => {
    setBusy(true); setError('')
    try {
      const trip = await planTrip(input)
      navigate(`/trip/${trip.id}`)
    } catch (e) {
      setError(e.message); setBusy(false)
    }
  }

  return (
    <Dashboard formProps={{ onCompute: compute, busy, error }}>
      <EmptyState />
    </Dashboard>
  )
}
