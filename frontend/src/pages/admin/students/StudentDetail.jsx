import { useParams, Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Calendar, ScanFace, Pencil, ArrowLeft, GraduationCap } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusChip } from '@/components/ui/Badge'
import { Avatar, Progress } from '@/components/ui/Misc'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import { Breadcrumb } from '@/components/ui/Controls'
import { getStudentById } from '@/mock/students'
import { subjects } from '@/mock/academics'
import { generateStudentCalendar } from '@/mock/attendance'
import { EmptyState } from '@/components/ui/Misc'

export default function StudentDetail() {
  const { id } = useParams()
  const student = getStudentById(id)

  if (!student) {
    return <EmptyState title="Student not found" description="This student may have been removed." action={<Link to="/admin/students"><Button>Back to students</Button></Link>} />
  }

  const calendar = generateStudentCalendar(student.name.length)
  const subjectAttendance = subjects.slice(0, 4).map((s, i) => ({ ...s, percent: 65 + ((i * 13 + student.name.length) % 33) }))

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Students', href: '/admin/students' }, { label: student.name }]} />

      <Link to="/admin/students" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to students
      </Link>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar name={student.name} size={80} />
            <h2 className="mt-4 text-lg font-semibold">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline">{student.department}</Badge>
              <Badge variant="outline">{student.year}</Badge>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full"><Pencil className="h-3.5 w-3.5" /> Edit profile</Button>
          </div>
          <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-muted-foreground" /> {student.email}</div>
            <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-muted-foreground" /> {student.phone}</div>
            <div className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-muted-foreground" /> {student.address}</div>
            <div className="flex items-center gap-2.5"><Calendar className="h-4 w-4 text-muted-foreground" /> Joined {student.joinedOn}</div>
            <div className="flex items-center gap-2.5"><GraduationCap className="h-4 w-4 text-muted-foreground" /> Section {student.section}</div>
          </div>
          <div className="mt-5 rounded-xl bg-muted p-4">
            <p className="text-xs font-semibold text-muted-foreground">Guardian</p>
            <p className="mt-1 text-sm font-medium">{student.guardianName}</p>
            <p className="text-xs text-muted-foreground">{student.guardianPhone}</p>
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-2">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-display font-semibold">{student.attendancePercent}%</p>
              <p className="text-xs text-muted-foreground">Overall attendance</p>
            </Card>
            <Card className="p-4 text-center">
              <StatusChip status={student.registrationStatus === 'registered' ? 'active' : 'pending'} label={student.registrationStatus} />
              <p className="mt-2 text-xs text-muted-foreground">Registration</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <ScanFace className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium capitalize">{student.faceRegistrationStatus.replace('_', ' ')}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Face registration</p>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Attendance overview</CardTitle></CardHeader>
            <CardContent>
              <Tabs defaultValue="subjects">
                <TabsList>
                  <TabsTrigger value="subjects">By subject</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                </TabsList>
                <TabsContent value="subjects">
                  <Table>
                    <THead>
                      <TR><TH>Subject</TH><TH>Code</TH><TH>Teacher</TH><TH>Attendance</TH></TR>
                    </THead>
                    <TBody>
                      {subjectAttendance.map((s) => (
                        <TR key={s.id}>
                          <TD className="font-medium text-foreground">{s.name}</TD>
                          <TD className="font-mono text-xs">{s.code}</TD>
                          <TD>{s.teacher}</TD>
                          <TD>
                            <div className="flex items-center gap-2">
                              <Progress value={s.percent} className="w-20" indicatorClassName={s.percent < 75 ? 'bg-warning' : 'bg-success'} />
                              <span className="text-xs font-medium">{s.percent}%</span>
                            </div>
                          </TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </TabsContent>
                <TabsContent value="calendar">
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
