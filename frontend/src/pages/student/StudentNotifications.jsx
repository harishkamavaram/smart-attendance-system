import { Bell, CheckCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/Misc'
import { studentNotifications } from '@/mock/misc'
import { toast } from 'sonner'

const typeStyles = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  info: 'bg-accent text-accent-foreground',
}

export default function StudentNotifications() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay updated on attendance and account activity.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success('All notifications marked as read')}>
          <CheckCheck className="h-4 w-4" /> Mark all read
        </Button>
      </div>

      {studentNotifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New notifications will appear here." />
      ) : (
        <div className="space-y-2.5">
          {studentNotifications.map((n) => (
            <Card key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? 'border-primary/30' : ''}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${typeStyles[n.type]}`}>
                <Bell className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
