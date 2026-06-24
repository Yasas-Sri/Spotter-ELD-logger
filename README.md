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

## Live deliverables

- **App:** `https://<your-web-service>.onrender.com`
- **API:** `https://<your-api-service>.onrender.com`
- **Repo:** this repository
- **Loom:** `<link>`

---

## HOS rules modeled

Property-carrying driver, **70 hr / 8 day** cycle, no adverse conditions:

- 11-hour driving limit · 14-hour on-duty window (no pause for breaks)
- 30-minute break required after 8 cumulative hours driving
- 10 consecutive hours off duty resets the 11- and 14-hour clocks
- 70 hr / 8 day cycle (seeded by `current_cycle_used`) · 34-hour restart

**Assumptions** (stated per the assignment): avg speed 55 mph · fuel stop every 1,000 mi
(1 hr on-duty) · 1 hr pickup + 1 hr dropoff. **Known limitation:** split sleeper-berth is
not modeled — only full 10-hour off-duty rests.

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

## API

- `POST /api/plan-trip/` — validate input, compute the plan, save a `Trip`, return it with `id`.
- `GET /api/trips/<id>/` — fetch a saved trip's stored result.

---

## Deploying to Render (frontend + backend) + Neon (Postgres)

### 1. Create the database (Neon)
1. Create a free project at [neon.tech], copy the **pooled** connection string
   (`postgresql://…?sslmode=require`).

### 2. Deploy both services (Render Blueprint)
The repo ships a `render.yaml` that defines both services.

1. In Render → **New → Blueprint**, point it at this repo. It creates:
   - `spotter-eld-api` — Django web service (`./build.sh`, `gunicorn config.wsgi:application`)
   - `spotter-eld-web` — Vite static site (`npm ci && npm run build`, publish `dist`, SPA rewrite)
2. Set the env vars Render marks as required:

   **spotter-eld-api**
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | the Neon pooled connection string |
   | `ORS_API_KEY` | your OpenRouteService key |
   | `CORS_ALLOWED_ORIGINS` | `https://spotter-eld-web.onrender.com` |
   | `CSRF_TRUSTED_ORIGINS` | `https://spotter-eld-web.onrender.com` |

   (`SECRET_KEY` is auto-generated; `DEBUG=false`; the API host is trusted automatically
   via `RENDER_EXTERNAL_HOSTNAME`.)

   **spotter-eld-web**
   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE_URL` | `https://spotter-eld-api.onrender.com` |

3. `build.sh` runs `collectstatic` + `migrate` on each deploy. Whitenoise serves Django's
   own static files.

### Notes
- Render's free web service **sleeps after ~15 min idle** (~50s cold start). Hit the API
  once before recording a demo; the UI has a loading state for this.
- The static site is on a global CDN and does not sleep.

