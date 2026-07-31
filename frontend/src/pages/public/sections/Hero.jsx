import { motion } from 'framer-motion'
import { ArrowRight, PlayCircle, ScanFace } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden scan-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-soft">
              <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse-slow" />
              Roll call, replaced by a single photo
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Attendance that
              <span className="text-primary"> marks itself</span>, from one classroom photo.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Upload a roster, register faces once, and let AI take attendance every class — with
              confidence scores on every match and instant reports your registrar will actually use.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/admin/login" className="flex items-center gap-2">
                  Get started as Admin <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works" className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" /> See how it works
                </a>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div><span className="font-semibold text-foreground">120+</span> institutions</div>
              <div className="h-4 w-px bg-border" />
              <div><span className="font-semibold text-foreground">97.8%</span> match accuracy</div>
              <div className="h-4 w-px bg-border" />
              <div><span className="font-semibold text-foreground">8 min</span> saved / class</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-soft-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
              <div className="grid h-full grid-cols-3 gap-2 p-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="relative flex items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-muted/60"
                  >
                    <ScanFace className="h-6 w-6 text-primary/50" />
                    {i !== 4 && (
                      <span className="absolute -bottom-1.5 rounded-full bg-success px-1.5 py-0.5 text-[9px] font-semibold text-success-foreground">
                        {(94 + (i % 5)).toFixed(1)}%
                      </span>
                    )}
                    {i === 4 && (
                      <span className="absolute -bottom-1.5 rounded-full bg-warning px-1.5 py-0.5 text-[9px] font-semibold text-warning-foreground">
                        unknown
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">Lab 204 — 09:00 AM session</span>
                  <span className="text-success font-semibold">8 / 9 recognized</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
