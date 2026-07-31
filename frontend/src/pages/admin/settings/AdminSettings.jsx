import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Misc'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Breadcrumb } from '@/components/ui/Controls'
import { useTheme } from '@/hooks/useTheme'
import { Moon, Sun, Monitor, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../../hooks/useAuth'

const roles = [
  { name: 'Super Admin', users: 2, permissions: 'Full access' },
  { name: 'Department Admin', users: 5, permissions: 'Manage students & sessions in own department' },
  { name: 'Faculty', users: 24, permissions: 'Create sessions, view own class attendance' },
  { name: 'Viewer', users: 3, permissions: 'Read-only reports access' },
]

export default function AdminSettings() {
  const { adminUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [threshold, setThreshold] = useState(75)
  const [confidence, setConfidence] = useState(85)
  const institute = adminUser?.institute
  console.log('institute  data in settings:', institute)
  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Settings' }]} />
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your institution profile, roles, and AI configuration.</p>
      </div>

      <Tabs defaultValue="institution">
        <TabsList>
          <TabsTrigger value="institution">Institution</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {/* <TabsTrigger value="ai">AI Configuration</TabsTrigger> */}
        </TabsList>

        <TabsContent value="institution">
          <Card>
            <CardHeader><CardTitle>Institution profile</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="iname">Institution name</Label><Input id="iname" defaultValue={institute?.name} /></div>
              <div><Label htmlFor="code">Institution code</Label><Input id="code" defaultValue={institute?.instituteCode} /></div>
              <div><Label htmlFor="email">Contact email</Label><Input id="email" defaultValue={institute?.email} /></div>
              <div><Label htmlFor="phone">Contact phone</Label><Input id="phone" defaultValue={institute?.mobileNumber} /></div>
              <div className="sm:col-span-2"><Label htmlFor="addr">Address</Label><Input id="addr" defaultValue={institute?.address} /></div>
              {/* <div className="sm:col-span-2 flex justify-end">
                <Button onClick={() => toast.success('Institution profile updated')}>Save changes</Button>
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader><CardTitle>Roles & permissions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {roles.map((r) => (
                <div key={r.name} className="flex items-center justify-between rounded-lg border border-border p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Shield className="h-4 w-4" /></div>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.permissions}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{r.users} users</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {[{ v: 'light', icon: Sun, label: 'Light' }, { v: 'dark', icon: Moon, label: 'Dark' }].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => setTheme(opt.v === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : opt.v)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${theme === opt.v ? 'border-primary bg-accent' : 'border-border hover:bg-muted'}`}
                  >
                    <opt.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Low attendance alerts', desc: 'Notify when a student falls below threshold' },
                { label: 'Bulk upload completion', desc: 'Notify when a roster finishes processing' },
                { label: 'Unknown face detections', desc: 'Notify when AI flags unrecognized faces' },
                { label: 'Weekly summary email', desc: 'Send a digest every Monday morning' },
              ].map((n, i) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch checked={i !== 2} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="ai">
          <Card>
            <CardHeader><CardTitle>AI configuration</CardTitle></CardHeader>
            <CardContent className="space-y-6 max-w-lg">
              <div>
                <div className="flex items-center justify-between">
                  <Label>Minimum attendance threshold</Label>
                  <span className="text-sm font-semibold text-primary">{threshold}%</span>
                </div>
                <input type="range" min={50} max={100} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="mt-2 w-full accent-primary" />
                <p className="mt-1 text-xs text-muted-foreground">Students below this percentage are flagged in reports.</p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Recognition confidence threshold</Label>
                  <span className="text-sm font-semibold text-primary">{confidence}%</span>
                </div>
                <input type="range" min={50} max={99} value={confidence} onChange={(e) => setConfidence(+e.target.value)} className="mt-2 w-full accent-primary" />
                <p className="mt-1 text-xs text-muted-foreground">Matches below this confidence are flagged as unknown.</p>
              </div>
              <Button onClick={() => toast.success('AI configuration saved')}>Save configuration</Button>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
