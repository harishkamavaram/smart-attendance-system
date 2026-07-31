import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CalendarDays, Bell, Sparkles, LogOut,
  HelpCircle,
  Settings,
  User,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Avatar } from '@/components/ui/Misc'
import { studentNotifications } from '@/mock/misc'
import { toast } from 'sonner'
import { cn } from '@/utils/cn'
import { useState } from "react";
import { handleStudentLogoutApi } from '../services/api/auth/student/auth'

const navItems = [
  { to: '/student/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/student/attendance', label: 'History', icon: CalendarDays },
  { to: '/student/notifications', label: 'Alerts', icon: Bell },
  { to: '/student/profile', label: 'Profile', icon: User },
]

export default function StudentLayout() {
  const { studentUser, logoutStudent } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const unread = studentNotifications.filter((n) => !n.read).length

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await handleStudentLogoutApi();
      console.log("Respomse: ", response)
      if (response.success) {
        logoutStudent()
        toast.success('Logged out successfully')
        navigate('/student/login')
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-background lg:flex">
      {/* Desktop rail */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card lg:flex lg:sticky lg:top-0 lg:h-screen">
        <div className="flex h-16 items-center gap-2 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-display font-semibold">FaceTrack</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/student/settings"
            className={({ isActive }) =>
              cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')
            }
          >
            <Settings className="h-4.5 w-4.5" /> Settings
          </NavLink>
          <NavLink
            to="/student/help"
            className={({ isActive }) =>
              cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')
            }
          >
            <HelpCircle className="h-4.5 w-4.5" /> Help
          </NavLink>
        </nav>
        <button onClick={handleLogout} className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10">
          <LogOut className="h-4.5 w-4.5" /> Log out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile-first top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:h-16 lg:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display font-semibold text-sm">FaceTrack</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted">
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <NavLink to="/student/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted">
              <Bell className="h-4.5 w-4.5" />
              {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />}
            </NavLink>
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-1 rounded-full p-1 hover:bg-muted transition"
              >
                <Avatar name={studentUser?.firstName} size={40} />
                {/* <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" /> */}
              </button>

              {openMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpenMenu(false)}
                  />

                  <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                    <NavLink
                      to="/student/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
                      onClick={() => setOpenMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </NavLink>

                    <NavLink
                      to="/student/settings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
                      onClick={() => setOpenMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </NavLink>

                    <NavLink
                      to="/student/help"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
                      onClick={() => setOpenMenu(false)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      Help
                    </NavLink>

                    {/* <button
                      onClick={() => {
                        toggleTheme();
                        setOpenMenu(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 hover:bg-muted"
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </button> */}

                    <div className="border-t" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-4 lg:px-6 lg:pb-6 lg:pt-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-card/95 py-2 backdrop-blur-md lg:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground')
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
