import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, Sparkles, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

const links = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#testimonials', label: 'Testimonials' },
  { href: '/#faqs', label: 'FAQs' },
  { href: '/#contact', label: 'Contact' },
]

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">FaceTrack</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted">
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <Button variant="ghost" onClick={() => navigate('/student/login')}>Student login</Button>
            <Button onClick={() => navigate('/admin/login')}>Admin login</Button>
          </div>

          <button className="rounded-md p-2 hover:bg-muted lg:hidden" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className={cn('overflow-hidden border-t border-border/60 lg:hidden transition-all', open ? 'max-h-96' : 'max-h-0 border-t-0')}>
          <div className="flex flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2 px-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/student/login')}>Student</Button>
              <Button className="flex-1" onClick={() => navigate('/admin/login')}>Admin</Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <span className="font-display text-lg font-semibold">FaceTrack</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs">
                Face-recognition attendance for classrooms that would rather spend time teaching.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="/#features" className="hover:text-foreground">Features</a></li>
                <li><a href="/#how-it-works" className="hover:text-foreground">How it works</a></li>
                <li><a href="/#architecture" className="hover:text-foreground">Architecture</a></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Access</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/admin/login" className="hover:text-foreground">Admin login</Link></li>
                <li><Link to="/student/login" className="hover:text-foreground">Student login</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">Company</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="/#contact" className="hover:text-foreground">Contact</a></li>
                <li><a href="/#faqs" className="hover:text-foreground">FAQs</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© 2026 FaceTrack. Final year project — smart attendance using face recognition.</p>
            <p>Built with React, Tailwind & a lot of mock data.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
