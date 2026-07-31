import { Mail, Phone, MapPin, ScanFace, Pencil, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Avatar, Progress } from '@/components/ui/Misc'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { useRef, useState } from "react";
import { Upload, Camera, ImagePlus } from "lucide-react";
import FaceRegistrationCard from './FaceRegistrationCard'

export default function StudentProfile() {
  const { studentUser } = useAuth()
  const [parentName, setParentName] = useState(studentUser?.parentName || '');
  const [parentPhone, setParentPhone] = useState(studentUser?.parentMobileNumber || '');
  const [parentEmail, setParentEmail] = useState(studentUser?.parentEmail || '');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Profile</h1>
        <p className="text-sm text-muted-foreground">Your personal details and face registration status.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <Avatar name={studentUser?.firstName} size={72} />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{studentUser?.firstName} {studentUser?.lastName}</h2>
            <p className="text-sm text-muted-foreground">{studentUser?.rollNumber} · {studentUser?.courseName || 'AC'}, {studentUser?.batch || '2026'}</p>
          </div>
          {/* <Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5" /> Edit</Button> */}
        </div>
        <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {studentUser?.email}</div>
          <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> +91 {studentUser?.parentMobileNumber}</div>
          <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /> Hyderabad, India</div>
        </div>
      </Card>

      <FaceRegistrationCard />

      {/* <Card>
        <CardHeader><CardTitle>Profile completion</CardTitle></CardHeader>
        <CardContent>
          <Progress value={92} />
          <p className="mt-2 text-xs text-muted-foreground">92% complete — add your guardian's phone number to finish.</p>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>Guardian Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="gname">Guardian Name</Label>
              <Input
                id="gname"
                value={parentName || ""}
                readOnly
              />
            </div>

            <div>
              <Label htmlFor="gphone">Guardian Mobile Number</Label>
              <Input
                id="gphone"
                type="tel"
                value={parentPhone || ""}
                readOnly
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="gemail">Guardian Email</Label>
              <Input
                id="gemail"
                type="email"
                value={parentEmail || ""}
                readOnly
              />
            </div>
          </div>

          {/* <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Guardian details are currently managed by your institution. Editing will
              be available in a future update.
            </p>

            <Button
              type="button"
              disabled
              className="sm:w-auto w-full"
            >
              Save Changes
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
