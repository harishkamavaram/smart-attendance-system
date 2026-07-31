import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Mail, MapPin, Phone, Send, Quote } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Label, Textarea } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Misc'
import { testimonials, faqs } from '@/mock/misc'
import { toast } from 'sonner'

export function Testimonials() {
  return (
    <section id="testimonials" className="border-y border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">Testimonials</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Faculty notice the missing ten minutes</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Card className="h-full p-6">
                <Quote className="h-6 w-6 text-primary/30" />
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar name={t.name} size={38} />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faqs() {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <section id="faqs" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">FAQs</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Questions institutions actually ask</h2>
      </div>
      <div className="mt-10 flex flex-col gap-3">
        {faqs.map((f, i) => (
          <Card key={f.q} className="overflow-hidden p-0">
            <button
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-medium text-sm sm:text-base">{f.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === i && (
              <div className="px-5 pb-5 text-sm text-muted-foreground animate-fade-in">{f.a}</div>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const submit = (e) => {
    e.preventDefault()
    toast.success('Message sent — our team will get back to you shortly.')
    setForm({ name: '', email: '', message: '' })
  }
  return (
    <section id="contact" className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-primary">Contact</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Bring FaceTrack to your campus</h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Tell us about your institution and we'll walk you through a pilot rollout for one department.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> hello@FaceTrack.example</div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> +91 40 2345 6789</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> Hitech City, Hyderabad, India</div>
          </div>
        </div>
        <Card className="p-6">
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ananya Reddy" />
            </div>
            <div>
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@institution.edu" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your institution and rollout timeline..." />
            </div>
            <Button type="submit" className="w-full">
              <Send className="h-4 w-4" /> Send message
            </Button>
          </form>
        </Card>
      </div>
    </section>
  )
}
