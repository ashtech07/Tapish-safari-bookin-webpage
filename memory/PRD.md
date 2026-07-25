# Ranthambore Curator — PRD

## Original problem statement
Node.js/Express + React + MongoDB safari booking site ("Ranthambore Curator").
This session's task (from a fresh /app that had the default FastAPI template,
while the actual project — uploaded as a zip — is Node.js/Express):
1. Replace every instance of the admin/contact email across the whole codebase
   with theranthambhorecurator@gmail.com.
2. Add Telegram Bot admin notifications (Node/Express only) fired from the
   existing booking (/api/bookings) and inquiry (/api/inquiries) route
   handlers, using TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID env vars, non-blocking
   (try/catch, never breaks the save or the user-facing success response).
Hard constraints: backend must remain 100% Node.js/Express (no FastAPI/Python
left anywhere), and the existing frontend<->backend wiring (REACT_APP_BACKEND_URL,
CORS, /api routes) must stay intact.

## Architecture
- Frontend: React (CRA + craco), Tailwind, shadcn/radix, react-router — /app/frontend
- Backend: Node.js + Express + native `mongodb` driver — /app/backend/server.js (single file)
- DB: MongoDB, collections: bookings, inquiries, reviews, hotels, site_images
- Admin auth: shared PIN via `X-Admin-Pin` header (no JWT/sessions)

## What was done this session (2026-07-25)
- Migrated /app from the default FastAPI/Python template to the user's actual
  Node.js/Express backend (extracted from uploaded zip): removed server.py,
  requirements.txt, pytest.ini; added backend/server.js + package.json.
- Updated /etc/supervisor/conf.d/supervisord.conf `backend` program to run
  `node server.js` instead of uvicorn (required — base image defaults to
  FastAPI; project is Node-only per explicit user constraint).
- Copied frontend source from zip into /app/frontend/src (preserved protected
  frontend/.env with REACT_APP_BACKEND_URL).
- Regenerated frontend/yarn.lock (old one pointed at a dead Replit-internal
  registry) and ran yarn install (pulled missing react-easy-crop dep).
- EMAIL_ADDRESS constant in frontend/src/lib/api.js updated to
  theranthambhorecurator@gmail.com (single source of truth used by Contact
  page + Footer — confirmed no other hardcoded emails/mailto links exist).
- Added backend/utils/telegram.js: sendTelegramNotification(message), reads
  TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID from process.env at call time (not
  module load time — fixes a dotenv load-order bug caught by testing agent),
  POSTs to https://api.telegram.org/bot<token>/sendMessage, never throws.
- Hooked sendTelegramNotification into POST /api/bookings and POST
  /api/inquiries (existing routes, no duplicates), wrapped in try/catch,
  fires after res.json() so it never blocks the response.
- backend/.env: added TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, kept MONGO_URL,
  DB_NAME, CORS_ORIGINS, ADMIN_PIN.
- Verified end-to-end via testing_agent: backend 29/30 (Telegram bug found &
  fixed post-report), frontend 100% of tested flows, email fully replaced
  everywhere, no FastAPI/Python left in backend, frontend-backend wiring intact.

## Known pre-existing (out of scope) issue flagged by testing agent
- SafariBooking.jsx never sends per_person/total/nationality/zone to the
  backend, so Admin "Total Revenue" always shows 0 and Zone is blank for
  UI-created bookings. Pre-existing, not part of this change request.

## Backlog / next steps
- P1: Wire real pricing (SAFARI_PRICES in lib/content.js) + zone/nationality
  selection into the booking flow so admin revenue KPIs are meaningful.
- P2: Split backend/server.js (now ~760 lines) into routes/ + schemas/ modules.
- P2: Surface Telegram notification health (e.g. log once at boot if
  TELEGRAM_* env vars are missing) so failures aren't silent to operators.
