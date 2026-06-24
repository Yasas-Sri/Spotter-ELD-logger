# Spotter ELD Trip Planner

A full-stack app for property carrying truck drivers: enter a trip (current / pickup /
dropoff locations + cycle hours used) and get back **a routed map with required stops and
rests**, plus **FMCSA daily log sheets** — one per calendar day, with the duty-status line
drawn on a 24-hour grid.

- **Backend:** Django + Django REST Framework (HOS simulation, routing, log building)
- **Frontend:** React (Vite) + React Router + Tailwind/shadcn + Leaflet
- **Routing/geocoding:** OpenRouteService
- **DB:** SQLite locally · Postgres (Neon) in production

---

## Live deliverable

- **App:** `https://spotter-eld-web.onrender.com/`

---

## HOS rules modeled

Property-carrying driver, **70 hr / 8 day** cycle, no adverse conditions:

- 11-hour driving limit · 14-hour on-duty window (no pause for breaks)
- 30-minute break required after 8 cumulative hours driving
- 10 consecutive hours off duty resets the 11- and 14-hour clocks
- 70 hr / 8 day cycle (seeded by `current_cycle_used`) · 34-hour restart

---

## Assumptions & limitations

The assignment left some operational details unspecified, so the following were assumed.
They are deliberate, documented choices — not gaps:

**Driving & timing**
- **Average speed 55 mph** — no speed was given, so drive time is derived from distance at a
  constant 55 mph. (Real ORS distance is used; only the *time* is normalized to this speed so
  the map summary and the HOS logs never disagree.)
- **Trip start time** defaults to the driver's current local time, or an optional explicit
  **Departure** datetime from the form.

**On-duty events (per the brief)**
- **Fuel stop every 1,000 miles**, modeled as **1 hour** on-duty (not driving).
- **1 hour for pickup** and **1 hour for dropoff**, each on-duty (not driving).

**Hours-of-Service scope**
- Property-carrying driver on the **70-hour / 8-day** cycle. The 60/7 cycle is shown on the
  log form but not computed.
- `current_cycle_used` **seeds** the 70-hour counter (never ignored).
- **No adverse driving conditions** exemption is applied.
- **Split sleeper-berth is not modeled** — only full **10-hour** off-duty resets are used.
  This is the single biggest simplification; stated as a known limitation.

**Data & accounts**
- **No authentication / accounts** — trips are saved and fetched by `id` only; any `/trip/:id`
  URL is shareable.
- A trip's full computed result is stored as one JSON blob (no normalized schema) — sufficient
  for read-back, simplest correct option for the scope.

**Hosting**
- Free tiers: the Render web service **sleeps after ~15 min idle** (~50s cold start on the next
  request). The UI shows a loading state for this; a paid instance removes it.


---

## Local development

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # fill in ORS_API_KEY
python manage.py migrate
python manage.py runserver    # http://localhost:8000
python manage.py test trips   # run the HOS / log / API tests
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_BASE_URL=http://localhost:8000
npm run dev                   # http://localhost:5173
```

---


### Notes
- Render's free web service **sleeps after ~15 min idle** (~50s cold start). Hit the API
  once before recording a demo; the UI has a loading state for this.
- The static site is on a global CDN and does not sleep.

