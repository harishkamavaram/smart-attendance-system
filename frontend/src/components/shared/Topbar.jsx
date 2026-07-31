import { Bell, Menu, Moon, Sun, LogOut, User, Settings as SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Dropdown } from '@/components/ui/Controls'
import { Avatar } from '@/components/ui/Misc'
import { useTheme } from '@/hooks/useTheme'

export default function Topbar({ onMenuClick, user, notifications = [], onLogout, title, profileHref, settingsHref }) {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <button className="rounded-md p-2 hover:bg-muted lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </button>
        {title && <h1 className="text-base font-semibold lg:text-lg">{title}</h1>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <Dropdown
          align="right"
          trigger={
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors">
              <Bell className="h-4.5 w-4.5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive" />
              )}
            </button>
          }
          items={
            notifications.length
              ? [
                  ...notifications.slice(0, 4).map((n) => ({
                    label: (
                      <span className="flex flex-col">
                        <span className="font-medium text-foreground">{n.title}</span>
                        <span className="text-xs text-muted-foreground">{n.time}</span>
                      </span>
                    ),
                  })),
                  { divider: true },
                  { label: 'View all notifications', onClick: () => navigate(settingsHref?.replace('settings', 'notifications') || '#') },
                ]
              : [{ label: 'No notifications yet' }]
          }
        />

        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-muted transition-colors">
              <Avatar name={user?.name} size={32} />
              <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
            </button>
          }
          items={[
            { label: 'View profile', icon: User, onClick: () => profileHref && navigate(profileHref) },
            { label: 'Settings', icon: SettingsIcon, onClick: () => settingsHref && navigate(settingsHref) },
            { divider: true },
            { label: 'Log out', icon: LogOut, destructive: true, onClick: onLogout },
          ]}
        />
      </div>
    </header>
  )
}
