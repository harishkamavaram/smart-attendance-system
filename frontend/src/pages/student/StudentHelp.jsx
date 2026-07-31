import { LifeBuoy, Mail, MessageCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { faqs } from '@/mock/misc'
import { toast } from 'sonner'

export default function StudentHelp() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Help & support</h1>
        <p className="text-sm text-muted-foreground">Answers to common questions, or reach out directly.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><MessageCircle className="h-5 w-5" /></div>
          <div className="flex-1">
            <p className="text-sm font-medium">Chat with support</p>
            <p className="text-xs text-muted-foreground">Avg. reply time: 2 hours</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => toast.info('Chat widget would open here')}>Start</Button>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Mail className="h-5 w-5" /></div>
          <div className="flex-1">
            <p className="text-sm font-medium">Email us</p>
            <p className="text-xs text-muted-foreground">support@FaceTrack.example</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => toast.success('Opening mail client')}>Email</Button>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><LifeBuoy className="h-4 w-4" /> Frequently asked questions</CardTitle></CardHeader>
        <CardContent className="divide-y divide-border">
          {faqs.slice(0, 4).map((f) => (
            <div key={f.q} className="py-3 first:pt-0">
              <p className="text-sm font-medium">{f.q}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
