import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UploadCloud, ScanEye, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select, Breadcrumb } from '@/components/ui/Controls'
import { Progress } from '@/components/ui/Misc'
import { subjects } from '@/mock/academics'
import { toast } from 'sonner'
import { handleFetchAttendanceSessions } from '../../../services/api/attendance/api'
import { uploadImage, identifyFaces } from '../../../services/api/ai-recognition/api'

const stages = ['Uploading image', 'Detecting faces', 'Generating embeddings', 'Matching students', 'Logging attendance']

export default function AiRecognition() {
  const { id } = useParams()
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)
  const [sessions, setSessions] = useState([])
  const [sessionId, setSessionId] = useState(id || null)
  console.log("Session ID:", sessionId);
  const [imageUrl, setImageUrl] = useState(null)
  const [respImageUrl, setRespImageUrl] = useState(null)
  const navigate = useNavigate()

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!sessionId) {
      toast.error("Please select a session first");
      return;
    }
    try {
      setProcessing(true);

      const imageUrl = await uploadImage(file);
      console.log("Uploaded image URL:", imageUrl);
      // Call face recognition API
      const courseId = sessions.find((s) => s.id == id).courseId;
      const sectionId = sessions.find((s) => s.id == id).sectionId.toString();
      const hasUploadedImage = sessions.find((s) => s.id == id).hasUploadedImage;
      const totalStudents = sessions.find((s) => s.id == id).totalStudents
      const admin = JSON.parse(localStorage.getItem("admin_user"));
      const adminId = parseInt(admin?.institute.id)
      // console.log("Course Id: ",courseId)
      // console.log("Section Id:",sectionId)
      // console.log("Has Image Uploaded: ",!hasUploadedImage)

      const payload =
      {
        "sessionId": parseInt(sessionId),
        "courseId": courseId,
        "sectionId": sectionId,
        "imageUrl": imageUrl,
        "isFirstImage": !hasUploadedImage,
        "adminId": adminId,
        "totalStudents": totalStudents
      }
      console.log("Payload: ", payload)
      const response = await identifyFaces(payload);
      setImageUrl(imageUrl);
      console.log(response);
      if (response.status == 200) {
        toast.success("Attendance generated");
        setRespImageUrl(response.data?.imageUrl);
        // navigate(`/admin/attendance/sessions/${response.sessionId}`);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };
  const fetchSessions = async () => {
    try {
      const response = await handleFetchAttendanceSessions();
      console.log("Fetched attendance sessions:", response);
      setSessions(response);
    } catch (error) {
      console.error("Failed to fetch attendance sessions:", error);
    }
  };
  useEffect(() => {
    fetchSessions()
  }, [])
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'AI Recognition' }]} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">AI Recognition</h1>
        <p className="text-sm text-muted-foreground">Upload a classroom photo to detect and match every face in the frame.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="grid gap-3 sm:grid-cols-2 mb-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Sessions</label>
                <Select placeholder="Select session" value={sessionId} options={sessions.map((s) => ({ value: s.id, label: s.sessionName }))}
                  onValueChange={(value) => {
                    setSessionId(value);
                  }} />
              </div>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); runPipeline() }}
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${dragging ? 'border-primary bg-accent' : 'border-border'
                }`}
            >
              {!processing ? (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <p className="font-medium">Drop a classroom photo here</p>
                  <p className="text-sm text-muted-foreground">JPG or PNG, up to 15MB</p>
                  <label>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <span className="mt-1 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      Browse photo
                    </span>
                  </label>
                </>
              ) : (
                <div className="w-full max-w-sm">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-3 text-sm font-medium">{stages[Math.min(stageIndex, stages.length - 1)]}…</p>
                  <Progress value={(stageIndex / stages.length) * 100} className="mt-3" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {imageUrl ? (
          <>{imageUrl && (
            <Card className="lg:col-span-1 sticky top-5">
              <CardHeader>
                <CardTitle>Image Preview</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">

                <div>
                  <p className="mb-2 text-sm font-medium">
                    Original Image
                  </p>

                  <div className="overflow-hidden rounded-xl border bg-muted">
                    <img
                      src={imageUrl}
                      alt="Original"
                      className="aspect-video w-full object-contain"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">
                    Processed Image
                  </p>

                  <div className="overflow-hidden rounded-xl border bg-muted">
                    {respImageUrl ? (
                      <img
                        src={respImageUrl}
                        alt="Processed"
                        className="aspect-video w-full object-contain"
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}</>

        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recognition Pipeline</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {stages.map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${processing && i < stageIndex
                      ? "bg-success/15 text-success"
                      : processing && i === stageIndex
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {i + 1}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {s}
                  </span>
                </div>
              ))}

              <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                Faces below the confidence threshold are flagged for manual review.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
