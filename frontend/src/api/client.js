// Talks to the Django API. Base URL comes from VITE_API_BASE_URL (set per env);
// defaults to the local dev server.
const BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

async function request(path, options) {
  let resp
  try {
    resp = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error('Could not reach the server. It may be waking up — try again in a moment.')
  }
  let body = null
  try { body = await resp.json() } catch { /* no body */ }
  if (!resp.ok) {
    const msg = body?.detail || firstError(body) || `Request failed (${resp.status}).`
    throw new Error(msg)
  }
  return body
}

// DRF validation errors come back as { field: ["msg", ...] }.
function firstError(body) {
  if (!body || typeof body !== 'object') return null
  const first = Object.values(body)[0]
  return Array.isArray(first) ? first[0] : (typeof first === 'string' ? first : null)
}

export function planTrip(input) {
  return request('/api/plan-trip/', { method: 'POST', body: JSON.stringify(input) })
}

export function getTrip(id) {
  return request(`/api/trips/${id}/`, { method: 'GET' })
}
