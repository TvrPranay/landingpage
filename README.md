# Teklozy — learning platform

A React/Vite frontend with a FastAPI development API and a Supabase-ready data/auth layer. The project contains two application folders: `frontend/` and `backend/`.

## What is included

- Public sign-in experience based on the approved split-screen reference. It renders independently of the authenticated application shell: **no dashboard header or sidebar appears on sign-in**.
- White-background Teklozy wordmark treatment with a blue T mark and dark navy wordmark.
- Home dashboard with an immersive 10-level mountain career map and an in-place Map/List toggle; selecting Discover opens career-path choice on first visit and the saved path on later visits.
- Development and Artificial Intelligence path-selection cards and a full-width path-details experience without the global sidebar.
- Course-player learning workspace with module navigation, video/reading/visual lesson content, About, Key Takeaways, Resources, Notes and a scored Quiz/Test tab. The right-side progress/takeaway/quick-check cards have been removed.
- **Teklozy CodeLab**: Full-featured in-browser coding IDE and isolated runtime sandbox accessible via the **Build** sidebar menu. Includes Monaco code editor, real Python isolated sandbox with interactive `stdin` streaming, hidden backend test suite verification, independent practice anti-paste deterrence, and pedagogical Socratic AI Mentor providing progressive 3-level guidance.
- Sidebar open/close control; expanded and icon-only modes; mobile drawer; no sidebar-internal scrollbar. The promotional tile is suppressed on short desktop viewports so navigation is not clipped.
- Smooth transitions, responsive layouts, focus states, and a consistent blue / black-navy / white palette.
- Supabase client wiring for email/password sign-in, sign-up, Google OAuth and GitHub OAuth when environment values and providers are configured.
- Supabase-backed lesson catalogue loading, user lesson progress, saved career-path selection, lesson notes, quiz attempts and XP award RPC.
- SQL migration for profiles, paths, levels, modules, lessons, progress, stats, notes, announcements, events, saved career-path selection, quiz attempts and Row Level Security policies.
- FastAPI + SQLite demo fallback for local UI development when Supabase is not configured.

## Requirements

- Node.js 18+ and npm
- Python 3.10+
- A Supabase project for real authentication and cloud persistence

## 1. Configure Supabase

1. Create a Supabase project.
2. Open **SQL Editor** and run `backend/supabase/migrations/0001_teklozy_core.sql`.
3. In Supabase **Authentication → Providers**, enable Email. Enable Google and GitHub only after adding their OAuth client credentials and callback URLs.
4. Copy `frontend/.env.example` to `frontend/.env` and fill in:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
VITE_API_URL=http://localhost:8000
```

Use only the Supabase publishable/anon key in the browser. **Never put the service-role key in frontend code or commit it to Git.**

The SQL migration creates the public curriculum tables and RLS policies. Learner-specific progress, stats and notes are restricted to the authenticated owner. The lesson-completion RPC awards XP once per lesson, rather than on every repeat click.

## 2. Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## 3. Run the FastAPI demo fallback (optional)

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# Copy .env.example to .env if you need to change defaults
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs
Health: http://localhost:8000/health

The FastAPI demo-sign-in route is only a local preview helper; it is **not production authentication**. With Supabase configured, the sign-in screen uses Supabase Auth instead. Do not expose the numeric-ID demo endpoints as a production identity system.

## Dynamic data status

- When Supabase is configured, published lesson rows are loaded from `public.lessons`; learner progress is read from `public.lesson_progress`; completion is saved through `award_lesson_xp`; XP is read from `public.user_stats`.
- The migration also establishes editable data tables for paths, levels, modules, notes, announcements and events. Additional product areas (jobs, projects, challenges, community, leaderboards, admin content management) still need their dedicated screens, workflows and policies before production launch.
- The bundled sample curriculum is a fallback preview. Replace or extend it in Supabase with approved Teklozy lesson content.

## Production readiness notes

This ZIP is an implementation baseline, **not a claim of completed production certification**. Before launch, configure Supabase project credentials and OAuth callbacks, run migrations, add verified admin/content-management workflows, test all routes and devices, configure production domains/CORS/HTTPS, add monitoring/backups/rate limits, and conduct security/accessibility/performance testing. No Supabase credentials were supplied in this conversation, so the project is wired for your Supabase project but cannot be connected to your live instance from this ZIP alone.

## Build

```bash
cd frontend
npm run build
```


## Guest preview account

Use the built-in local preview account on the sign-in screen:

- **Guest ID:** `guest@teklozy.demo`
- **Password:** `TeklozyGuest@2026`

Select **Enter guest workspace** to open the learning dashboard without Supabase credentials.
The guest preview uses browser-local storage for its demo progress and XP. It is intended only
for product review and UI testing; it is not a secure production account and must not be used
for real learner data. Sign out from the profile menu to return to the sign-in screen.

Real learner accounts continue to use Supabase Auth when `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` are configured.


## Updated learning flow

1. From Home, choose **Discover** on the immersive 10-level career map.
2. On the first visit, choose Development or Artificial Intelligence. The choice is saved locally for guest preview and in `public.user_path_selection` for authenticated learners.
3. On later visits, Discover opens the saved path details directly.
4. The path details and lesson workspace use the full available width without the global dashboard sidebar.
5. The lesson workspace includes module navigation, the central learning area and five tabs: About, Key Takeaways, Resources, Notes and Quiz / Test. The quiz is a three-question multiple-choice knowledge check with score feedback; authenticated attempts are written to `public.quiz_attempts`.

The supplied original Teklozy logo artwork and the original sign-in reference's campus visual are included as frontend public assets. The login view is fixed to a single desktop viewport; mobile uses a vertically stacked layout for usability.
