import { Link } from 'react-router-dom'
import { CalendarDays, Clock, BookOpen, TrendingUp, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Progress, Avatar } from '@/components/ui/Misc'
import { Badge, StatusChip } from '@/components/ui/Badge'
import { AttendanceAreaChart } from '@/components/charts/ChartWrappers'
import { useAuth } from '@/hooks/useAuth'
import { monthlyAttendanceTrend } from '@/mock/attendance'
import { subjects, timetable } from '@/mock/academics'
import { studentNotifications } from '@/mock/misc'

const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
const todaySchedule = timetable.find((d) => d.day === todayName) || timetable[0]

export default function StudentDashboard() {
  const { studentUser } = useAuth()

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Avatar name={studentUser?.firstName} size={48} />
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Hi, {studentUser?.firstName + " " + studentUser?.lastName || 'Student'} </h1>
          <p className="text-sm text-muted-foreground">{studentUser?.rollNumber} · {studentUser?.courseName || 'AC'}, {studentUser?.batch || '2026'} </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="mt-1"><StatusChip status="present" label="Present" /></p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Monthly %</p>
          <p className="mt-1 text-xl font-display font-semibold">87%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Classes today</p>
          <p className="mt-1 text-xl font-display font-semibold">{todaySchedule.slots.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Profile</p>
          <p className="mt-1 text-xl font-display font-semibold">92%</p>
        </Card>
      </div>

      {/* <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Profile completion</p>
          <span className="text-xs text-muted-foreground">92%</span>
        </div>
        <Progress value={92} className="mt-2" />
        <p className="mt-2 text-xs text-muted-foreground">Add your guardian's phone number to reach 100%.</p>
      </Card> */}

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Attendance trend</CardTitle>
          <Link to="/student/attendance" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View history <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent><AttendanceAreaChart data={monthlyAttendanceTrend} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Today's classes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {todaySchedule.slots.map((s, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.subject}</p>
                <p className="text-xs text-muted-foreground">{s.time} · {s.room}</p>
              </div>
              <Badge variant="outline">{s.teacher.split(' ').slice(-1)}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Subjects</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {subjects.slice(0, 4).map((s, i) => (
              <div key={s.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm">{s.name}</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{78 + i * 3}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Link to="/student/notifications" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentNotifications.slice(0, 3).map((n) => (
              <div key={n.id} className="flex items-start gap-2.5">
                <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${n.read ? 'bg-muted-foreground/40' : 'bg-primary'}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
