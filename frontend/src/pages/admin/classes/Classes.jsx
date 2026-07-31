import { Card, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Misc'
import { Badge } from '@/components/ui/Badge'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Breadcrumb } from '@/components/ui/Controls'
import { departments, teachers, subjects, timetable } from '@/mock/academics'
import { Users, GraduationCap } from 'lucide-react'

export default function Classes() {
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Classes' }]} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Classes</h1>
        <p className="text-sm text-muted-foreground">Departments, subjects, teachers, and the weekly timetable.</p>
      </div>

      <Tabs defaultValue="departments">
        <TabsList>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>

        <TabsContent value="departments">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((d) => (
              <Card key={d.id} className="p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{d.code}</Badge>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mt-3 font-semibold">{d.name}</h3>
                <p className="text-xs text-muted-foreground">HOD: {d.hod}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" /> {d.students} students</span>
                  <span className="text-muted-foreground">{d.faculty} faculty</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <Card>
            <CardContent className="p-0">
              <Table>
                <THead><TR><TH>Subject</TH><TH>Code</TH><TH>Department</TH><TH>Credits</TH><TH>Teacher</TH></TR></THead>
                <TBody>
                  {subjects.map((s) => (
                    <TR key={s.id}>
                      <TD className="font-medium text-foreground">{s.name}</TD>
                      <TD className="font-mono text-xs">{s.code}</TD>
                      <TD><Badge variant="outline">{s.department}</Badge></TD>
                      <TD>{s.credits}</TD>
                      <TD>{s.teacher}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((t) => (
              <Card key={t.id} className="flex items-center gap-3 p-4">
                <Avatar name={t.name} size={44} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.subject}</p>
                  <Badge variant="outline" className="mt-1">{t.department}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timetable">
          <div className="grid gap-4 lg:grid-cols-5">
            {timetable.map((d) => (
              <Card key={d.day} className="p-4">
                <p className="font-semibold text-sm">{d.day}</p>
                <div className="mt-3 space-y-2.5">
                  {d.slots.map((slot, i) => (
                    <div key={i} className="rounded-lg border border-border p-2.5">
                      <p className="text-xs font-medium">{slot.subject}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{slot.time}</p>
                      <p className="text-[11px] text-muted-foreground">{slot.room}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
