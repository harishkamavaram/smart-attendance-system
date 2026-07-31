import { Routes, Route, Navigate } from 'react-router-dom'

import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'
import StudentLayout from '@/layouts/StudentLayout'
import AdminGuard from '@/routes/AdminGuard'
import StudentGuard from '@/routes/StudentGuard'

import Landing from '@/pages/public/Landing'

import AdminLogin from '@/pages/admin/auth/AdminLogin'
import AdminSignup from '@/pages/admin/auth/AdminSignup'
import AdminForgotPassword from '@/pages/admin/auth/AdminForgotPassword'
import AdminOtp from '@/pages/admin/auth/AdminOtp'
import AdminResetPassword from '@/pages/admin/auth/AdminResetPassword'

import StudentLogin from '@/pages/student/StudentLogin'
import StudentForgotPassword from '@/pages/student/StudentForgotPassword'
import StudentOtp from '@/pages/student/StudentOtp'

import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard'
import StudentList from '@/pages/admin/students/StudentList'
import StudentDetail from '@/pages/admin/students/StudentDetail'
import StudentRegister from '@/pages/admin/students/StudentRegister'
import BulkUpload from '@/pages/admin/students/BulkUpload'
import AttendanceSessions from '@/pages/admin/attendance/AttendanceSessions'
import AttendanceResult from '@/pages/admin/attendance/AttendanceResult'
import AiRecognition from '@/pages/admin/attendance/AiRecognition'
import Reports from '@/pages/admin/reports/Reports'
import Classes from '@/pages/admin/classes/Classes'
import AdminSettings from '@/pages/admin/settings/AdminSettings'

import StudentDashboard from '@/pages/student/StudentDashboard'
import StudentAttendance from '@/pages/student/StudentAttendance'
import StudentProfile from '@/pages/student/StudentProfile'
import StudentNotifications from '@/pages/student/StudentNotifications'
import StudentSettings from '@/pages/student/StudentSettings'
import StudentHelp from '@/pages/student/StudentHelp'

import NotFound from '@/pages/public/NotFound'
import ResendVerification from '@/pages/shared/ResendVerification'
import VerifyEmail from './pages/shared/VerifyEmail'
import AdminLoggedInGaurd from './routes/AdminLoggedInGaurd'
import StudentLoggedInGaurd from './routes/StudentLoggedInGaurd'
import ChangeDefaultPassword from './pages/student/ChangeDefaultPassword'
import StudentResetPassword from './pages/student/auth/StudentResetPassword'

export default function App() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      <Route element={<AdminLoggedInGaurd />}>
        {/* Admin auth (public) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/otp" element={<AdminOtp />} />
      </Route>

      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
      {/* Shared  */}
      <Route path="/resend-verification" element={<ResendVerification />} />
      <Route path="/verify" element={<VerifyEmail />} />

      <Route element={<StudentLoggedInGaurd />}>
        {/* Student auth (public) */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/forgot-password" element={<StudentForgotPassword />} />
        <Route
          path="/student/change-default-password"
          element={<ChangeDefaultPassword />}
        />
        <Route path="/student/otp" element={<StudentOtp />} />

      </Route>
      <Route path="/student/reset-password" element={<StudentResetPassword />} />

      {/* Protected admin app */}
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentList />} />
          <Route path="/admin/students/register" element={<StudentRegister />} />
          <Route path="/admin/students/bulk-upload" element={<BulkUpload />} />
          <Route path="/admin/students/:id" element={<StudentDetail />} />
          <Route path="/admin/attendance/sessions" element={<AttendanceSessions />} />
          <Route path="/admin/attendance/sessions/:id" element={<AttendanceResult />} />
          <Route path="/admin/recognition" element={<AiRecognition />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/classes" element={<Classes />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Protected student app */}
      <Route element={<StudentGuard />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
          <Route path="/student/settings" element={<StudentSettings />} />
          <Route path="/student/help" element={<StudentHelp />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
