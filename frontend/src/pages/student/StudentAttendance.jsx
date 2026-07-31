import { Card, CardContent } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Misc'
import { StatusChip } from '@/components/ui/Badge'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { subjects } from '@/mock/academics'
import { generateStudentCalendar } from '@/mock/attendance'

const history = [
  { date: '2026-07-25', subject: 'Data Structures & Algorithms', status: 'present', time: '09:02 AM' },
  { date: '2026-07-25', subject: 'Computer Networks', status: 'present', time: '10:01 AM' },
  { date: '2026-07-24', subject: 'Operating Systems', status: 'late', time: '11:18 AM' },
  { date: '2026-07-24', subject: 'Machine Learning', status: 'present', time: '09:00 AM' },
  { date: '2026-07-23', subject: 'Data Structures & Algorithms', status: 'absent', time: '—' },
  { date: '2026-07-22', subject: 'Computer Networks', status: 'present', time: '10:03 AM' },
  { date: '2026-07-21', subject: 'Operating Systems', status: 'present', time: '11:05 AM' },
]

export default function StudentAttendance() {
  const calendar = generateStudentCalendar(12)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Attendance history</h1>
        <p className="text-sm text-muted-foreground">Track your attendance by subject or day.</p>
      </div>

      <Card>
        <CardContent className="space-y-3 divide-y divide-border p-5">
          {subjects.slice(0, 5).map((s, i) => {
            const percent = 65 + ((i * 11) % 33)
            return (
              <div key={s.id} className="flex items-center justify-between pt-3 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.teacher}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Progress value={percent} className="w-20" indicatorClassName={percent < 75 ? 'bg-warning' : 'bg-success'} />
                  <span className="text-xs font-medium w-9 text-right">{percent}%</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Recent</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <Table>
                <THead><TR><TH>Date</TH><TH>Subject</TH><TH>Time</TH><TH>Status</TH></TR></THead>
                <TBody>
                  {history.map((h, i) => (
                    <TR key={i}>
                      <TD className="text-xs">{h.date}</TD>
                      <TD className="font-medium text-foreground">{h.subject}</TD>
                      <TD className="text-xs text-muted-foreground">{h.time}</TD>
                      <TD><StatusChip status={h.status} /></TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="p-5">
            <div className="grid grid-cols-7 gap-2">
              {calendar.map((d) => (
                <div
                  key={d.date}
                  className={`flex aspect-square items-center justify-center rounded-lg text-xs font-medium ${
                    d.status === 'present' ? 'bg-success/15 text-success' : d.status === 'late' ? 'bg-warning/15 text-warning' : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {d.date}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success/40" /> Present</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warning/40" /> Late</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-destructive/30" /> Absent</span>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
