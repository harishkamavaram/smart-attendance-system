import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function StudentLoggedInGaurd() {
  const { studentUser } = useAuth()
  if (studentUser) return <Navigate to="/student/dashboard" replace />
  return <Outlet />
}
