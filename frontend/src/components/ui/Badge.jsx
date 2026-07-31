import { cn } from '@/utils/cn'

const variants = {
  default: 'bg-muted text-foreground',
  primary: 'bg-accent text-accent-foreground',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  outline: 'border border-border text-foreground',
}

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

const dotColors = {
  present: 'bg-success',
  absent: 'bg-destructive',
  late: 'bg-warning',
  pending: 'bg-muted-foreground',
  active: 'bg-success',
  inactive: 'bg-muted-foreground',
}

export function StatusChip({ status, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium capitalize">
      <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[status] || 'bg-muted-foreground')} />
      {label || status}
    </span>
  )
}
