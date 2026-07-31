import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from '@/components/shared/AdminSidebar'
import Topbar from '@/components/shared/Topbar'
import { useAuth } from '@/hooks/useAuth'
import { notifications } from '@/mock/misc'
import { toast } from 'sonner'
import { handleLogoutApi } from '../services/api/auth/admin/auth'

export default function AdminLayout() {
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { adminUser, logoutAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await handleLogoutApi();
      console.log('Logout API response:', response);
      if (response && response.success) {
        logoutAdmin()
        toast.success(response.data.message || 'Logged out successfully')
        navigate('/admin/login')
      }
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to log out')
    }
    finally {
      setIsLoading(false)
    }
  }
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          user={adminUser}
          notifications={notifications}
          onLogout={handleLogout}
          profileHref="/admin/settings"
          settingsHref="/admin/settings"
        />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
