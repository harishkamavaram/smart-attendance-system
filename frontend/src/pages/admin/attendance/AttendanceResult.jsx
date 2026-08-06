import { useParams, Link, useNavigate, Await } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  ScanFace,
  AlertTriangle,
  Copy,
  CheckCircle2
} from "lucide-react";
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
import { useEffect, useState } from 'react'
import { handleDeleteSessionBySessionId, handlefetchAttendanceResult, handleFetchStudentsBySessionId, handleMarkAction } from '../../../services/api/attendance/api'

export default function AttendanceResult() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null);
  const [session, setSession] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  const fetchSession = async () => {
    try {
      setIsLoading(true)
      const response = await handlefetchAttendanceResult(id);
      console.log('Fetched session data:', response);
      setSession(response);
      // setResult(response.data);
    } catch (error) {
      console.error('Error fetching session data:', error);
    } finally {
      setIsLoading(false)
    }
  };
  const fetchStudents = async (id) => {
    try {
      setIsLoading(true)
      const response = await handleFetchStudentsBySessionId(id);
      console.log("handleFetchStudentsBySessionId Rsponse: ", response)
      setApiResponse(response);
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleDelete = async () => {
    console.log("Delete session with ID:", id);
    try {
      setIsLoading(true)
      const response = await handleDeleteSessionBySessionId(id)
      console.log(response)
      setDeleteDialogOpen(false);
      navigate('/admin/attendance/sessions');
    } catch (err) {
      console.error(err);

    } finally {
      setIsLoading(false)
    }

  }
  const handleAction = async (studentData) => {
    try {
      setIsLoading(true)
      console.log("Mark Action Data: ", studentData)
      const response = await handleMarkAction(studentData);
      console.log("Handle Action Assign response:", response);
      fetchStudents(id)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (!id) return;
    if (!session) {
      fetchSession();
      fetchStudents(id)
    }
  }, [id], session);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }
  if (!session && !isLoading) {
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
          <h1 className="font-display text-2xl font-semibold tracking-tight">{session.sessionName}</h1>
          <p className="text-sm text-muted-foreground">{session.courseName} {session.room} · {session.date}</p>
          <span className="text-sm text-muted-foreground">{session.startTime} - {session.endTime},</span> <span className="text-sm ">{session.status}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* <Button variant="outline" onClick={() => exportReport('PDF')}>
            <Download className="h-4 w-4" /> PDF
          </Button> */}
          <Button
            variant="outline"
            onClick={() => navigate('/admin/recognition/' + session.id)}
          >
            {session.hasUploadedImage ? "Re-upload image" : "Add Image"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>

          {/* <Button
            variant="outline"
            onClick={() => toast.success("Export started")}
          >
            <Download className="h-4 w-4" />
            Export
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {[
          { label: 'Enrolled', value: session.totalStudents, accent: 'text-foreground' },
          { label: 'Present', value: session.present, accent: 'text-success' },
          { label: 'Absent', value: session.absent, accent: 'text-destructive' },
          // { label: 'Late', value: session.late, accent: 'text-warning' },
          // { label: 'AI accuracy', value: `${session.accuracy}%`, accent: 'text-primary' },
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
      {apiResponse.length != 0 ? (
        <Card>
          <CardContent className="p-5">
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">
                    All ({apiResponse.length})
                  </TabsTrigger>

                  <TabsTrigger value="unknown">
                    Unknown (
                    {
                      apiResponse.filter(r => r.status === "ABSENT").length
                    }
                    )
                  </TabsTrigger>

                  <TabsTrigger value="recognized">
                    Recognized (
                    {
                      apiResponse.filter(r => r.status !== "ABSENT").length
                    }
                    )
                  </TabsTrigger>
                </TabsList>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/admin/attendance/images/${id}`)
                  }
                >
                  View Uploaded Images
                </Button>
              </div>
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
                      {apiResponse
                        .filter(face => {
                          if (tab === "all") return true;
                          if (tab === "recognized") return face.status !== "ABSENT";
                          if (tab === "unknown") return face.status === "ABSENT";
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
                              {(face.confidence).toFixed(2)}%
                            </TD>

                            <TD>
                              <StatusChip
                                status={
                                  face.status === "ABSENT"
                                    ? "present"
                                    : "absent"
                                }
                                label={
                                  face.imageName
                                    ? "recognized"
                                    : "unknown"
                                }
                              />
                            </TD>

                            <TD>
                              {face.status === "ABSENT" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleAction(face)
                                  }
                                >
                                  Assign Present
                                </Button>
                              ) : (
                                <span className="text-green-600 text-sm">
                                  ✓ Present
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
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <p className="text-sm text-muted-foreground">
            No image uploaded.
          </p>

          <Button
            variant="outline"
            onClick={() => navigate(`/admin/recognition/${session.id}`)}
          >
            {session.hasUploadedImage ? "Re-upload Image" : "Add Image"}
          </Button>
        </div>
      )}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">
                Delete Attendance Session
              </h2>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this attendance session?
              </p>

              <p className="mt-2 text-sm text-red-600 font-medium">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
