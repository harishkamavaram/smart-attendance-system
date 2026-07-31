import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, ScanEye, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select, Breadcrumb } from '@/components/ui/Controls'
import { Progress } from '@/components/ui/Misc'
import { subjects } from '@/mock/academics'
import { toast } from 'sonner'

const stages = ['Uploading image', 'Detecting faces', 'Generating embeddings', 'Matching students', 'Logging attendance']

export default function AiRecognition() {
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)
  const navigate = useNavigate()

  const runPipeline = () => {
    setProcessing(true)
    setStageIndex(0)
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setStageIndex(i)
      if (i >= stages.length) {
        clearInterval(interval)
        toast.success('Attendance generated for 57 of 62 students')
        setTimeout(() => navigate('/admin/attendance/sessions/ses-001'), 500)
      }
    }, 600)
  }

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
                <label className="mb-1.5 block text-sm font-medium">Subject</label>
                <Select placeholder="Select subject" options={subjects.map((s) => ({ value: s.id, label: s.name }))} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Section</label>
                <Select placeholder="Select section" options={[{ value: 'A', label: 'Section A' }, { value: 'B', label: 'Section B' }, { value: 'C', label: 'Section C' }]} />
              </div>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); runPipeline() }}
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
                dragging ? 'border-primary bg-accent' : 'border-border'
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
                    <input type="file" accept="image/*" className="hidden" onChange={runPipeline} />
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

        <Card>
          <CardHeader><CardTitle>Recognition pipeline</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {stages.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  processing && i < stageIndex ? 'bg-success/15 text-success' : processing && i === stageIndex ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </span>
                <span className="text-sm text-muted-foreground">{s}</span>
              </div>
            ))}
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <ScanEye className="h-4 w-4 shrink-0" /> Faces below the confidence threshold are flagged as unknown for manual review.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
