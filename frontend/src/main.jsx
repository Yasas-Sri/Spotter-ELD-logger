import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import './styles/tailwind.css'
import './styles/theme.css'

// Apply the saved theme before first paint to avoid a flash. Dark is the default.
if (localStorage.getItem('theme') === 'light') {
  document.documentElement.classList.add('light')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
