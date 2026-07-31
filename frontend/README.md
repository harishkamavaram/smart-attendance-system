# FaceTrack — Smart Attendance Management System (Frontend)

A frontend-only, static-data prototype for a face-recognition attendance system.
**No backend, no real auth, no database** — everything runs on mock JSON in `src/mock/`,
structured so a real API can be dropped in later (see "Connecting a backend" below).

## Stack

React 19 · JavaScript (no TS) · Vite · React Router 6 · Tailwind CSS · Recharts ·
Framer Motion · React Hook Form-ready inputs · Sonner (toasts) · TanStack Query (wired,
unused until there's a real API) · lucide-react icons.

UI primitives (`src/components/ui`) are hand-built in the shadcn/ui visual style —
same CSS-variable token system — so you can swap in the real shadcn CLI later without
restructuring anything.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build in `dist/`.

## Folder structure

```
src/
  components/
    ui/         reusable primitives (Button, Card, Table, Dialog, Tabs, etc.)
    shared/      Sidebar, Topbar, StatCard, AuthShell, layout-level pieces
    charts/      Recharts wrappers themed to the design tokens
  layouts/       PublicLayout, AdminLayout (desktop-first), StudentLayout (mobile-first)
  pages/
    public/      Landing page + sections, 404
    admin/       auth, dashboard, students, attendance, reports, classes, settings
    student/     dashboard, attendance history, profile, notifications, settings, help
  routes/        AdminGuard / StudentGuard (mock session-based route protection)
  hooks/         useAuth (mock session in sessionStorage), useTheme (light/dark)
  mock/          all static/mock data — students, attendance, academics, misc
  utils/         cn() classname helper
  styles/        global.css with design tokens (CSS variables, light + dark)
```

## Design decisions worth knowing

- **Landing page is a single page with anchored sections** (`/#features`, `/#how-it-works`,
  `/#testimonials`, `/#faqs`, `/#contact`) rather than separate routes — this matches how
  Vercel/Linear/Stripe structure their marketing sites, and keeps the narrative flowing.
- **Forgot password / OTP / Reset password** are shared components
  (`components/shared/AuthFlows.jsx`) parameterized by role, used by both
  `pages/admin/auth/*` and `pages/student/*` — same UI, correct redirect targets per role.
- **Auth is fully mocked**: `useAuth` stores a fake session in `sessionStorage`. Any
  email/password combination "succeeds". Swap the two `login*` functions in
  `src/hooks/useAuth.js` for real API calls when a backend exists.
- **Theme**: light/dark via a `.dark` class on `<html>`, persisted to `localStorage`,
  toggle available in both admin and student topbars.
- **No shadcn CLI / no Radix**: the sandbox this was built in has no network access to
  pull the shadcn registry, so the primitives are hand-rolled with the same token
  conventions. They're drop-in compatible if you later run the shadcn CLI for real.

## Information architecture (in place of a Figma file)

**Public**
- `/` — Landing (Hero, Statistics, Features, How it Works, Architecture, Testimonials, FAQs, Contact, Footer)

**Admin auth** — `/admin/login`, `/admin/signup`, `/admin/forgot-password`, `/admin/otp`, `/admin/reset-password`

**Admin app** (desktop-first, sidebar + topbar)
- `/admin/dashboard` — stat cards, weekly trend, department bar chart, heatmap, quick actions, recent activity, today's sessions
- `/admin/students` — searchable/filterable/paginated table
- `/admin/students/register` — manual registration + face-capture panel
- `/admin/students/bulk-upload` — CSV/Excel/PDF/DOC drag-drop + upload history
- `/admin/students/:id` — profile, attendance-by-subject, calendar
- `/admin/attendance/sessions` — session cards + create-session dialog
- `/admin/attendance/sessions/:id` — detected faces grid, recognized/unknown/duplicate tabs, export
- `/admin/recognition` — standalone upload → pipeline animation → redirects to result
- `/admin/reports` — trend charts, report list with per-format export
- `/admin/classes` — Departments / Subjects / Teachers / Timetable tabs
- `/admin/settings` — Institution / Roles / Appearance / Notifications / AI Configuration tabs

**Student auth** — `/student/login`, `/student/forgot-password`, `/student/otp`

**Student app** (mobile-first, bottom nav + desktop rail)
- `/student/dashboard`, `/student/attendance` (list + calendar), `/student/profile`,
  `/student/notifications`, `/student/settings`, `/student/help`

## Connecting a backend later

1. Replace the arrays/objects in `src/mock/*.js` with fetch calls (React Query is already
   installed and provisioned in `main.jsx`).
2. Replace `useAuth`'s mock `loginAdmin`/`loginStudent` with real API calls + token storage.
3. `AdminGuard` / `StudentGuard` already gate routes on session presence — no routing
   changes needed once real auth returns a session.
4. Bulk upload and AI recognition pages already simulate the exact async states
   (uploading → processing → result) a real backend would drive via websockets/polling.

## Responsive behavior

Tested breakpoints: 320, 375, 768, 1024, 1280, 1440px. Student layout collapses to a
bottom tab bar under `lg`; Admin sidebar collapses to a slide-over drawer under `lg`.
All tables scroll horizontally on narrow viewports instead of breaking layout.
