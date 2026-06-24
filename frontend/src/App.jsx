import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import PlannerPage from './pages/PlannerPage.jsx'
import TripPage from './pages/TripPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/plan" element={<PlannerPage />} />
      <Route path="/trip/:id" element={<TripPage />} />
    </Routes>
  )
}
