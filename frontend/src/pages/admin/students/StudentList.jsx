import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Upload, Download, MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusChip } from '@/components/ui/Badge'
import { Avatar, Progress } from '@/components/ui/Misc'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import { SearchInput, Select, Pagination, Dropdown } from '@/components/ui/Controls'
import { Breadcrumb } from '@/components/ui/Controls'
import { students } from '@/mock/students'
import { toast } from 'sonner'

const PAGE_SIZE = 10

export default function StudentList() {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = `${s.name} ${s.rollNumber} ${s.email}`.toLowerCase().includes(search.toLowerCase())
      const matchesDept = !department || s.department === department
      const matchesStatus = !status || s.registrationStatus === status
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [search, department, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Students' }]} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} students across all departments</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/students/bulk-upload"><Button variant="outline"><Upload className="h-4 w-4" /> Bulk upload</Button></Link>
          <Link to="/admin/students/register"><Button><Plus className="h-4 w-4" /> Add student</Button></Link>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search by name, roll number, email…" className="sm:flex-1" />
          <Select
            value={department}
            onChange={(v) => { setDepartment(v); setPage(1) }}
            placeholder="All departments"
            className="sm:w-48"
            options={[...new Set(students.map((s) => s.department))].map((d) => ({ value: d, label: d }))}
          />
          <Select
            value={status}
            onChange={(v) => { setStatus(v); setPage(1) }}
            placeholder="All statuses"
            className="sm:w-44"
            options={[{ value: 'registered', label: 'Registered' }, { value: 'pending', label: 'Pending' }]}
          />
          <Button variant="outline" onClick={() => toast.success('Export started — CSV will download shortly')}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </Card>

      <Table>
        <THead>
          <TR>
            <TH>Student</TH>
            <TH>Roll No.</TH>
            <TH>Department</TH>
            <TH>Year</TH>
            <TH>Attendance</TH>
            <TH>Registration</TH>
            <TH>Face status</TH>
            <TH></TH>
          </TR>
        </THead>
        <TBody>
          {pageItems.map((s) => (
            <TR key={s.id}>
              <TD>
                <Link to={`/admin/students/${s.id}`} className="flex items-center gap-3">
                  <Avatar name={s.name} size={32} />
                  <div>
                    <p className="font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </div>
                </Link>
              </TD>
              <TD className="font-mono text-xs">{s.rollNumber}</TD>
              <TD><Badge variant="outline">{s.department}</Badge></TD>
              <TD>{s.year}</TD>
              <TD>
                <div className="flex items-center gap-2">
                  <Progress value={s.attendancePercent} className="w-16" indicatorClassName={s.status === 'critical' ? 'bg-destructive' : s.status === 'warning' ? 'bg-warning' : 'bg-success'} />
                  <span className="text-xs font-medium">{s.attendancePercent}%</span>
                </div>
              </TD>
              <TD><StatusChip status={s.registrationStatus === 'registered' ? 'active' : 'pending'} label={s.registrationStatus} /></TD>
              <TD>
                <Badge variant={s.faceRegistrationStatus === 'completed' ? 'success' : s.faceRegistrationStatus === 'processing' ? 'warning' : 'default'}>
                  {s.faceRegistrationStatus.replace('_', ' ')}
                </Badge>
              </TD>
              <TD>
                <Dropdown
                  align="right"
                  trigger={<button className="rounded-md p-1.5 hover:bg-muted"><MoreVertical className="h-4 w-4" /></button>}
                  items={[
                    { label: 'View details', icon: Eye, onClick: () => {} },
                    { label: 'Edit student', icon: Pencil, onClick: () => toast.info('Edit form would open here') },
                    { divider: true },
                    { label: 'Remove student', icon: Trash2, destructive: true, onClick: () => toast.error('Student removed (mock)') },
                  ]}
                />
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
