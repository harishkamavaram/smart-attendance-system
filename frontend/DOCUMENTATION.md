# FaceTrack — Smart Attendance Management System
## Frontend Documentation

Static-data, frontend-only prototype. No backend, no real auth, no database — see
"Connecting a Backend" at the end for how to wire one up.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 (JavaScript, no TypeScript) |
| Build tool | Vite 6 |
| Routing | React Router 6 |
| Styling | Tailwind CSS 3 (CSS-variable design tokens, light + dark) |
| Component primitives | Hand-built shadcn/ui-style components (`src/components/ui`) |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | lucide-react |
| Toasts | Sonner |
| Data fetching (provisioned, unused until a real API exists) | TanStack Query |
| Forms | Native controlled inputs (React Hook Form-ready structure) |

---

## 2. Complete Route Map

### 2.1 Public (marketing site) — layout: `PublicLayout`

| Route | Page component | Notes |
|---|---|---|
| `/` | `pages/public/Landing.jsx` | Single-page site with anchored sections: `#features`, `#how-it-works`, `#architecture`, `#testimonials`, `#faqs`, `#contact` |
| `*` (catch-all) | `pages/public/NotFound.jsx` | 404 |

### 2.2 Admin authentication — public routes, no layout wrapper

| Route | Page component | Purpose |
|---|---|---|
| `/admin/login` | `pages/admin/auth/AdminLogin.jsx` | Email + password, sets mock session |
| `/admin/signup` | `pages/admin/auth/AdminSignup.jsx` | Institution + admin account creation |
| `/admin/forgot-password` | `pages/admin/auth/AdminForgotPassword.jsx` | Sends mock OTP, redirects to `/admin/otp` |
| `/admin/otp` | `pages/admin/auth/AdminOtp.jsx` | 6-digit code entry, redirects to `/admin/reset-password` |
| `/admin/reset-password` | `pages/admin/auth/AdminResetPassword.jsx` | New password form, redirects to `/admin/login` |

### 2.3 Student authentication — public routes, no layout wrapper

| Route | Page component | Purpose |
|---|---|---|
| `/student/login` | `pages/student/StudentLogin.jsx` | Email + password, sets mock session |
| `/student/forgot-password` | `pages/student/StudentForgotPassword.jsx` | Sends mock OTP, redirects to `/student/otp` |
| `/student/otp` | `pages/student/StudentOtp.jsx` | 6-digit code entry, redirects to `/student/login` |

*(Admin and student forgot-password/OTP/reset screens share one implementation —
`components/shared/AuthFlows.jsx` — parameterized by role for correct copy and redirects.)*

### 2.4 Admin app — protected by `AdminGuard`, layout: `AdminLayout` (desktop-first, sidebar + topbar)

| Route | Page component | Purpose |
|---|---|---|
| `/admin/dashboard` | `pages/admin/dashboard/AdminDashboard.jsx` | 6 stat cards, weekly line chart, today's pie breakdown, department bar chart, 7-week heatmap, quick actions, recent activity feed, recent uploads, today's sessions |
| `/admin/students` | `pages/admin/students/StudentList.jsx` | Search, department/status filters, paginated table (10/page), row actions dropdown, CSV export |
| `/admin/students/register` | `pages/admin/students/StudentRegister.jsx` | Manual student registration form + face-capture panel |
| `/admin/students/bulk-upload` | `pages/admin/students/BulkUpload.jsx` | Drag-drop CSV/Excel/PDF/DOC upload, simulated progress, upload history table |
| `/admin/students/:id` | `pages/admin/students/StudentDetail.jsx` | Profile card, guardian info, attendance-by-subject table, per-day calendar tab |
| `/admin/attendance/sessions` | `pages/admin/attendance/AttendanceSessions.jsx` | Session cards (completed/scheduled), "Create session" dialog |
| `/admin/attendance/sessions/:id` | `pages/admin/attendance/AttendanceResult.jsx` | Detected-faces grid with bounding boxes, recognized/unknown/duplicate tabs, recognition timeline, export |
| `/admin/recognition` | `pages/admin/attendance/AiRecognition.jsx` | Standalone photo upload → 5-stage pipeline animation → redirects into a session result |
| `/admin/reports` | `pages/admin/reports/Reports.jsx` | Monthly trend + department bar chart, filterable report list, per-report PDF/CSV/Excel export, print |
| `/admin/classes` | `pages/admin/classes/Classes.jsx` | Tabs: Departments, Subjects, Teachers, Timetable |
| `/admin/settings` | `pages/admin/settings/AdminSettings.jsx` | Tabs: Institution profile, Roles & permissions, Appearance (theme), Notifications, AI Configuration (attendance threshold slider, recognition confidence slider) |

### 2.5 Student app — protected by `StudentGuard`, layout: `StudentLayout` (mobile-first, bottom nav + desktop rail)

| Route | Page component | Purpose |
|---|---|---|
| `/student/dashboard` | `pages/student/StudentDashboard.jsx` | Greeting, today/monthly/classes-today/profile stat cards, profile completion bar, attendance trend chart, today's schedule, subjects list, notification preview |
| `/student/attendance` | `pages/student/StudentAttendance.jsx` | Per-subject attendance bars; tabs for recent list vs. monthly calendar |
| `/student/profile` | `pages/student/StudentProfile.jsx` | Personal details, face-registration status card, profile completion, guardian details form |
| `/student/notifications` | `pages/student/StudentNotifications.jsx` | Notification feed, "mark all read" |
| `/student/settings` | `pages/student/StudentSettings.jsx` | Dark mode toggle, notification preferences, change password |
| `/student/help` | `pages/student/StudentHelp.jsx` | Contact support cards, FAQ excerpt |

---

## 3. Route Guards & Session Model

- `src/hooks/useAuth.js` — `AuthProvider` holds `adminUser` / `studentUser` state, backed by
  `sessionStorage` (`mock_admin_user`, `mock_student_user`). Any email/password "succeeds" —
  there is no real validation.
- `src/routes/AdminGuard.jsx` / `StudentGuard.jsx` — thin wrappers using React Router's
  `<Outlet />`; redirect to the relevant `/login` if no mock session exists.
- Logging out (from either topbar's profile dropdown) clears the session key and redirects
  to that role's login page.

---

## 4. Layouts

| Layout | Used by | Behavior |
|---|---|---|
| `PublicLayout` | `/` | Sticky navbar with anchor links, mobile hamburger menu, footer with sitemap links |
| `AdminLayout` | all `/admin/*` protected routes | Fixed sidebar (desktop) / slide-over drawer (< `lg`), topbar with theme toggle, notification dropdown, profile dropdown |
| `StudentLayout` | all `/student/*` protected routes | Bottom tab bar (< `lg`): Home / History / Alerts / Profile; left rail nav (≥ `lg`) with additional Settings/Help/Logout |

---

## 5. Component Inventory (`src/components/ui`)

Button, Card (+Header/Title/Description/Content/Footer), Input/Textarea/Label, Badge,
StatusChip, Avatar, Progress, Switch, Skeleton, Alert, EmptyState, Tabs
(+List/Trigger/Content), Dialog, Drawer, Table (+THead/TBody/TR/TH/TD), Select,
SearchInput, Dropdown, Pagination, Breadcrumb.

Shared composite components (`src/components/shared`): `AdminSidebar`, `Topbar`,
`StatCard`, `AuthShell` (split-screen auth wrapper), `AuthFlows` (forgot
password/OTP/reset, role-parameterized).

Chart wrappers (`src/components/charts/ChartWrappers.jsx`): `AttendanceLineChart`,
`AttendanceAreaChart`, `DepartmentBarChart`, `StatusPieChart`, `AttendanceHeatmap`.

---

## 6. Mock Data (`src/mock/`)

| File | Contents |
|---|---|
| `students.js` | 64 generated students (deterministic seeded random) with roll number, department, year, section, attendance %, registration + face-registration status, guardian info; `bulkUploadHistory` |
| `academics.js` | `departments`, `teachers`, `subjects`, `timetable` (Mon–Fri slots) |
| `attendance.js` | `attendanceSessions`, `weeklyAttendanceTrend`, `monthlyAttendanceTrend`, `departmentAttendance`, `attendanceHeatmap`, `generateStudentCalendar()`, `detectedFacesForSession()` |
| `misc.js` | `notifications`, `studentNotifications`, `recentActivity`, `dashboardStats`, `reportsList`, `testimonials`, `faqs`, `features`, `howItWorks`, `statistics` |

All data is static/generated at module load — no network calls.

---

## 7. Design Tokens

Defined as CSS variables in `src/styles/globals.css`, mapped into Tailwind via
`tailwind.config.js`: `background`, `foreground`, `card`, `muted`, `border`, `primary`
(indigo), `secondary` (teal), `accent`, `destructive`, `success`, `warning`, `ring`,
`radius`. Full light and `.dark` variants. Fonts: Inter (body), Space Grotesk (display/
headings).

---

## 8. Connecting a Backend Later

1. Replace exports in `src/mock/*.js` with real fetch calls — React Query is already
   installed and provisioned in `src/main.jsx`.
2. Replace the mock `loginAdmin` / `loginStudent` functions in `src/hooks/useAuth.js`
   with real API calls that store a real token instead of a fake session object.
3. No routing changes are needed — `AdminGuard` / `StudentGuard` already gate on session
   presence, so they'll work as-is once real auth populates that state.
4. `BulkUpload.jsx` and `AiRecognition.jsx` already model the exact async states
   (idle → uploading → processing → result) a real backend would drive via polling or
   websockets — swap the `setTimeout` simulations for real request/response handling.

---

## 9. Responsive Breakpoints Tested

320px · 375px · 768px · 1024px · 1280px · 1440px

Student layout collapses to a bottom tab bar below `lg` (1024px); Admin sidebar collapses
to a slide-over drawer below `lg`. All data tables scroll horizontally on narrow
viewports rather than breaking the layout.
