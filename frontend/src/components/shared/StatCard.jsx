import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'

export default function StatCard({ label, value, icon: Icon, trend, trendLabel, accent = 'primary', index = 0 }) {
  const positive = trend >= 0
  const accents = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/15 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="p-5 hover:shadow-soft-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-display font-semibold tracking-tight">{value}</p>
          </div>
          {Icon && (
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', accents[accent])}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            <span className={cn('flex items-center gap-0.5 font-medium', positive ? 'text-success' : 'text-destructive')}>
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(trend)}%
            </span>
            <span className="text-muted-foreground">{trendLabel || 'vs last week'}</span>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
