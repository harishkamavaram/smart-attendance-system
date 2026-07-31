import { Link } from 'react-router-dom'
import { ScanFace } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <ScanFace className="h-8 w-8" />
      </div>
      <h1 className="font-display text-3xl font-semibold">404 — Face not recognized</h1>
      <p className="max-w-sm text-sm text-muted-foreground">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/"><Button>Back to home</Button></Link>
    </div>
  )
}
