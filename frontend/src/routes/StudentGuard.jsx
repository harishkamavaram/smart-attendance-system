import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function StudentGuard() {
  const { studentUser } = useAuth()
  if (!studentUser) return <Navigate to="/student/login" replace />
  return <Outlet />
}
