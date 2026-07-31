import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { statistics, features, howItWorks } from '@/mock/misc'

export function Statistics() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {statistics.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center lg:text-left"
          >
            <p className="font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">Features</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything a registrar's office actually needs
        </h2>
        <p className="mt-3 text-muted-foreground">
          Built around the real workflow — from roster upload to signed-off reports — not just the AI demo.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => {
          const Icon = Icons[f.icon] || Icons.Sparkles
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="h-full p-6 hover:shadow-soft-lg hover:-translate-y-0.5 transition-all">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Five steps, one photo per class</h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {howItWorks.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              <Card className="h-full p-5">
                <span className="font-display text-2xl font-semibold text-primary/30">{step.step}</span>
                <h3 className="mt-3 font-semibold text-sm">{step.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
              {i < howItWorks.length - 1 && (
                <div className="absolute right-[-14px] top-1/2 hidden -translate-y-1/2 lg:block">
                  <Icons.ChevronRight className="h-5 w-5 text-border" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ArchitectureSection() {
  const layers = [
    { title: 'Capture layer', desc: 'Classroom photo upload or connected camera feed.', icon: 'Camera' },
    { title: 'Detection & embedding', desc: 'Face detection, alignment, and embedding generation per frame.', icon: 'ScanFace' },
    { title: 'Matching engine', desc: 'Embeddings matched against the registered student vector store.', icon: 'Cpu' },
    { title: 'Attendance ledger', desc: 'Confirmed matches logged with timestamp and confidence score.', icon: 'Database' },
    { title: 'Reporting layer', desc: 'Aggregation into daily, weekly, and semester reports.', icon: 'FileBarChart' },
  ]
  return (
    <section id="architecture" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">Architecture</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">The AI workflow, layer by layer</h2>
        <p className="mt-3 text-muted-foreground">A frontend built to plug straight into this pipeline once the backend lands.</p>
      </div>
      <div className="mt-12 flex flex-col gap-3">
        {layers.map((l, i) => {
          const Icon = Icons[l.icon] || Icons.Layers
          return (
            <motion.div
              key={l.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">{l.title}</p>
                <p className="text-xs text-muted-foreground">{l.desc}</p>
              </div>
              <span className="ml-auto hidden font-display text-xs text-muted-foreground sm:block">Layer 0{i + 1}</span>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
