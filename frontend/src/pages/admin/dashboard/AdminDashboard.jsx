import { Users, UserCheck, UserX, Clock, ScanFace, ClipboardList, ArrowRight, Upload, ScanEye, FileBarChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '@/components/shared/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Misc'
import { StatusChip } from '@/components/ui/Badge'
import { AttendanceLineChart, DepartmentBarChart, StatusPieChart, AttendanceHeatmap } from '@/components/charts/ChartWrappers'
import { dashboardStats, recentActivity } from '@/mock/misc'
import { weeklyAttendanceTrend, departmentAttendance, attendanceHeatmap, attendanceSessions } from '@/mock/attendance'
import { bulkUploadHistory } from '@/mock/students'
import { useAuth } from '../../../hooks/useAuth'

const statusPie = [
  { name: 'Present', value: dashboardStats.attendanceToday },
  { name: 'Absent', value: (dashboardStats.absentToday / 1493) * 100 },
  { name: 'Late', value: (dashboardStats.lateToday / 1493) * 100 },
]

const quickActions = [
  { label: 'Upload student sheet', icon: Upload, to: '/admin/students/bulk-upload' },
  { label: 'Start AI recognition', icon: ScanEye, to: '/admin/recognition' },
  { label: 'Create session', icon: ClipboardList, to: '/admin/attendance/sessions' },
  { label: 'Generate report', icon: FileBarChart, to: '/admin/reports' },
]

export default function AdminDashboard() {
  const { adminUser } = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Good morning, {adminUser?.name || "Admin"}</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening across {adminUser?.institute.name || "institute"}.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard index={0} label="Total students" value={dashboardStats.totalStudents.toLocaleString()} icon={Users} accent="primary" trend={4.2} />
        <StatCard index={1} label="Attendance today" value={`${dashboardStats.attendanceToday}%`} icon={UserCheck} accent="success" trend={1.8} />
        <StatCard index={2} label="Absent today" value={dashboardStats.absentToday} icon={UserX} accent="destructive" trend={-3.1} />
        <StatCard index={3} label="Late today" value={dashboardStats.lateToday} icon={Clock} accent="warning" trend={-1.2} />
        <StatCard index={4} label="AI accuracy" value={`${dashboardStats.aiAccuracy}%`} icon={ScanFace} accent="secondary" trend={0.6} />
        <StatCard index={5} label="Pending registrations" value={dashboardStats.pendingRegistrations} icon={ClipboardList} accent="warning" trend={-8.4} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Weekly attendance trend</CardTitle>
            <Link to="/admin/reports" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View reports <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <AttendanceLineChart data={weeklyAttendanceTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Today's breakdown</CardTitle></CardHeader>
          <CardContent>
            <StatusPieChart data={statusPie.map((s) => ({ ...s, value: Math.round(s.value) }))} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Attendance by department</CardTitle></CardHeader>
          <CardContent><DepartmentBarChart data={departmentAttendance} /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Attendance heatmap</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-3 text-xs text-muted-foreground">Last 7 weeks, Mon–Sun</p>
            <AttendanceHeatmap data={attendanceHeatmap} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2.5">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.to}>
                <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
                  <a.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">{a.label}</span>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <Avatar name={a.actor} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{a.actor}</span> {a.action} <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent uploads</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {bulkUploadHistory.slice(0, 3).map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{u.fileName}</p>
                  <p className="text-xs text-muted-foreground">{u.registered}/{u.totalRows} registered</p>
                </div>
                <StatusChip status={u.status === 'completed' ? 'active' : 'pending'} label={u.status} />
              </div>
            ))}
            <Link to="/admin/students/bulk-upload">
              <Button variant="ghost" size="sm" className="w-full">View all uploads</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Today's sessions</CardTitle>
          <Link to="/admin/attendance/sessions" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {attendanceSessions.slice(0, 3).map((s) => (
            <Link key={s.id} to={`/admin/attendance/sessions/${s.id}`} className="rounded-xl border border-border p-4 hover:shadow-soft transition-shadow">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{s.subject}</p>
                <StatusChip status={s.status === 'completed' ? 'present' : 'pending'} label={s.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{s.department} · {s.room} · {s.time}</p>
              <p className="mt-2 text-xs">
                <span className="font-medium text-success">{s.present}</span> present ·{' '}
                <span className="font-medium text-destructive">{s.absent}</span> absent
              </p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
