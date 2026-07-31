import { useState } from 'react'
import { FileText, FileSpreadsheet, Printer, Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select, Breadcrumb } from '@/components/ui/Controls'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { AttendanceAreaChart, DepartmentBarChart } from '@/components/charts/ChartWrappers'
import { reportsList } from '@/mock/misc'
import { monthlyAttendanceTrend, departmentAttendance } from '@/mock/attendance'
import { toast } from 'sonner'

const reportTypes = ['Daily', 'Weekly', 'Monthly', 'Semester', 'Department', 'Student']

export default function Reports() {
  const [type, setType] = useState('')

  const filtered = reportsList.filter((r) => !type || r.type === type)

  const exportReport = (format) => toast.success(`Exporting as ${format}…`)

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Reports' }]} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Generate and export attendance reports across any timeframe.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport('PDF')}><FileText className="h-4 w-4" /> PDF</Button>
          <Button variant="outline" onClick={() => exportReport('CSV')}><FileSpreadsheet className="h-4 w-4" /> CSV</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly attendance trend</CardTitle></CardHeader>
          <CardContent><AttendanceAreaChart data={monthlyAttendanceTrend} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Attendance by department</CardTitle></CardHeader>
          <CardContent><DepartmentBarChart data={departmentAttendance} /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Generated reports</CardTitle>
          <Select value={type} onChange={setType} placeholder="All types" className="w-44" options={reportTypes.map((t) => ({ value: t, label: t }))} />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="divide-y divide-border">
                {filtered.map((r) => (
                  <div key={r.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{r.type}</Badge>
                        <span>{r.department}</span>
                        <span>· Generated {r.generatedOn}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {r.format.map((f) => (
                        <Button key={f} size="sm" variant="outline" onClick={() => exportReport(f)}>
                          <Download className="h-3.5 w-3.5" /> {f}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="scheduled">
              <p className="py-6 text-center text-sm text-muted-foreground">No scheduled reports configured yet. Set one up in Settings → Notifications.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
