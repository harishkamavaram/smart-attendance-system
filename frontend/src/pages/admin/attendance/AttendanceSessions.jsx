import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusChip } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { Input, Label } from '@/components/ui/Input'
import { Select, Breadcrumb } from '@/components/ui/Controls'
import { attendanceSessions } from '@/mock/attendance'
import { subjects } from '@/mock/academics'
import { toast } from 'sonner'

export default function AttendanceSessions() {
  const [open, setOpen] = useState(false)

  const createSession = (e) => {
    e.preventDefault()
    toast.success('Session created')
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Attendance' }]} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Attendance sessions</h1>
          <p className="text-sm text-muted-foreground">Create a session, then upload a classroom photo for AI recognition.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create session</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {attendanceSessions.map((s) => (
          <Link key={s.id} to={s.status === 'scheduled' ? '#' : `/admin/attendance/sessions/${s.id}`}>
            <Card className="h-full p-5 hover:shadow-soft-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{s.subject}</p>
                  <p className="text-xs text-muted-foreground">{s.department} · Section {s.section}</p>
                </div>
                <StatusChip status={s.status === 'completed' ? 'present' : 'pending'} label={s.status} />
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {s.date} · {s.time}</div>
                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {s.room} · {s.teacher}</div>
                <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {s.totalStudents} enrolled</div>
              </div>
              {s.status === 'completed' && (
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                  <div><p className="text-sm font-semibold text-success">{s.present}</p><p className="text-[10px] text-muted-foreground">Present</p></div>
                  <div><p className="text-sm font-semibold text-destructive">{s.absent}</p><p className="text-[10px] text-muted-foreground">Absent</p></div>
                  <div><p className="text-sm font-semibold text-warning">{s.late}</p><p className="text-[10px] text-muted-foreground">Late</p></div>
                </div>
              )}
              {s.status === 'scheduled' && (
                <Button size="sm" variant="outline" className="mt-4 w-full" onClick={(e) => { e.preventDefault(); toast.info('Upload a classroom photo to begin') }}>
                  Start session
                </Button>
              )}
            </Card>
          </Link>
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title="Create attendance session">
        <form className="space-y-4" onSubmit={createSession}>
          <div>
            <Label>Subject</Label>
            <Select placeholder="Select subject" options={subjects.map((s) => ({ value: s.id, label: s.name }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label htmlFor="date">Date</Label><Input id="date" type="date" required /></div>
            <div><Label htmlFor="time">Time</Label><Input id="time" type="time" required /></div>
          </div>
          <div><Label htmlFor="room">Room</Label><Input id="room" placeholder="Lab 204" required /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create session</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
