import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, ScanFace, AlertTriangle, Copy, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusChip } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Misc'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import { Breadcrumb } from '@/components/ui/Controls'
import { EmptyState } from '@/components/ui/Misc'
import { attendanceSessionsMock, detectedFacesForSession } from '@/mock/attendance'
import { toast } from 'sonner'
import { useState } from 'react'

export default function AttendanceResult() {
  const { id } = useParams()
  const [result, setResult] = useState(null);
  const apiResponse = {
    facesDetected: 8,
    imageUrl: "https://dummyimage.com/800x500",
    results: [
      {
        studentId: 2,
        studentName: "Jeff Bezos",
        score: 0.6918292,
        bbox: [302, 86, 404, 218]
      },
      {
        studentId: 3,
        studentName: "Mark Zuckerberg",
        score: 0.729031,
        bbox: [55, 53, 143, 174]
      },
      {
        studentId: null,
        studentName: "Unknown",
        score: 0.07282513,
        bbox: [177, 125, 260, 251]
      }
    ]
  };
  // After API call
  // setResult(response.data);
  const session = attendanceSessionsMock.find((s) => s.id === id)

  if (!session) {
    return <EmptyState title="Session not found" action={<Link to="/admin/attendance/sessions"><Button>Back to sessions</Button></Link>} />
  }

  const faces = detectedFacesForSession(id)
  const recognized = faces.filter((f) => f.status === 'recognized')
  const unknown = faces.filter((f) => f.status === 'unknown')
  const duplicate = faces.filter((f) => f.status === 'duplicate')

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Attendance', href: '/admin/attendance/sessions' }, { label: session.subject }]} />
      <Link to="/admin/attendance/sessions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to sessions
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{session.subject}</h1>
          <p className="text-sm text-muted-foreground">{session.department} · {session.room} · {session.date}, {session.time}</p>
        </div>
        <Button variant="outline" onClick={() => toast.success('Export started')}><Download className="h-4 w-4" /> Export attendance</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: 'Enrolled', value: session.totalStudents, accent: 'text-foreground' },
          { label: 'Present', value: session.present, accent: 'text-success' },
          { label: 'Absent', value: session.absent, accent: 'text-destructive' },
          { label: 'Late', value: session.late, accent: 'text-warning' },
          { label: 'AI accuracy', value: `${session.accuracy}%`, accent: 'text-primary' },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-display font-semibold ${s.accent}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Classroom image</CardTitle>
            <Badge variant="success">Processing complete</Badge>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted">
              <div className="absolute inset-0 grid grid-cols-6 gap-2 p-4">
                {faces.map((f, i) => (
                  <div
                    key={f.id}
                    className={`relative flex items-center justify-center rounded-lg border-2 ${
                      f.status === 'unknown' ? 'border-destructive' : f.status === 'duplicate' ? 'border-warning' : 'border-success'
                    } bg-card/60`}
                  >
                    <ScanFace className="h-5 w-5 text-muted-foreground" />
                    {f.confidence && (
                      <span className="absolute -bottom-1.5 rounded-full bg-card px-1.5 py-0.5 text-[9px] font-semibold shadow-soft">
                        {f.confidence}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border-2 border-success" /> Recognized</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border-2 border-destructive" /> Unknown</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border-2 border-warning" /> Duplicate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recognition summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> Recognized</span>
              <span className="font-semibold">{recognized.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="flex items-center gap-2 text-sm"><AlertTriangle className="h-4 w-4 text-destructive" /> Unknown faces</span>
              <span className="font-semibold">{unknown.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="flex items-center gap-2 text-sm"><Copy className="h-4 w-4 text-warning" /> Duplicate matches</span>
              <span className="font-semibold">{duplicate.length}</span>
            </div>
            <div className="mt-2 space-y-2 border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground">Recognition timeline</p>
              {['Image received', 'Faces detected (18)', 'Embeddings matched', 'Attendance logged'].map((t, i) => (
                <div key={t} className="flex items-center gap-2 text-xs">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success"><CheckCircle2 className="h-3 w-3" /></span>
                  {t}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div> */}

      <Card>
        <CardContent className="p-5">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">
                All ({apiResponse.results.length})
              </TabsTrigger>

              <TabsTrigger value="unknown">
                Unknown (
                {
                  apiResponse.results.filter(r => r.studentId === null).length
                }
                )
              </TabsTrigger>

              <TabsTrigger value="recognized">
                Recognized (
                {
                  apiResponse.results.filter(r => r.studentId !== null).length
                }
                )
              </TabsTrigger>
            </TabsList>

            {["all", "recognized", "unknown"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Table>
                  <THead>
                    <TR>
                      <TH>Student</TH>
                      <TH>Confidence</TH>
                      <TH>Status</TH>
                      <TH>Action</TH>
                    </TR>
                  </THead>

                  <TBody>
                    {apiResponse.results
                      .filter(face => {
                        if (tab === "all") return true;
                        if (tab === "recognized") return face.studentId !== null;
                        if (tab === "unknown") return face.studentId === null;
                      })
                      .map((face, index) => (
                        <TR key={index}>
                          <TD>
                            <div className="flex items-center gap-2.5">
                              <Avatar
                                name={face.studentName}
                                size={28}
                              />

                              <div>
                                <div className="font-medium">
                                  {face.studentName}
                                </div>

                                {face.studentId && (
                                  <div className="text-xs text-muted-foreground">
                                    Student ID: {face.studentId}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TD>

                          <TD>
                            {(face.score * 100).toFixed(2)}%
                          </TD>

                          <TD>
                            <StatusChip
                              status={
                                face.studentId
                                  ? "present"
                                  : "absent"
                              }
                              label={
                                face.studentId
                                  ? "recognized"
                                  : "unknown"
                              }
                            />
                          </TD>

                          <TD>
                            {face.studentId === null ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  toast.info("Assign manually")
                                }
                              >
                                Assign
                              </Button>
                            ) : (
                              <span className="text-green-600 text-sm">
                                ✓ Verified
                              </span>
                            )}
                          </TD>
                        </TR>
                      ))}
                  </TBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
