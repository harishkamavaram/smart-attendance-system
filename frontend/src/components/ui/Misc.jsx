import { cn } from '@/utils/cn'
import { useState } from 'react'

export function Avatar({ src, name, className, size = 40 }) {
  const initials = (name || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div
      className={cn('relative flex shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold overflow-hidden', className)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </div>
  )
}

export function Progress({ value = 0, className, indicatorClassName }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}>
      <div
        className={cn('h-full rounded-full bg-primary transition-all duration-500', indicatorClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function Switch({ checked, onChange, className }) {
  const [internal, setInternal] = useState(!!checked)
  const isControlled = checked !== undefined
  const value = isControlled ? checked : internal
  const toggle = () => {
    if (!isControlled) setInternal((v) => !v)
    onChange?.(!value)
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={toggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
        value ? 'bg-primary' : 'bg-muted',
        className
      )}
    >
      <span
        className={cn(
          'inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform',
          value ? 'translate-x-6' : 'translate-x-1'
        )}
        style={{ height: 18, width: 18 }}
      />
    </button>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

export function Alert({ variant = 'default', title, children, className }) {
  const styles = {
    default: 'bg-muted border-border text-foreground',
    success: 'bg-success/10 border-success/30 text-success',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    destructive: 'bg-destructive/10 border-destructive/30 text-destructive',
  }
  return (
    <div className={cn('rounded-xl border p-4 text-sm', styles[variant], className)}>
      {title && <p className="font-semibold mb-0.5">{title}</p>}
      <div className="text-foreground/80">{children}</div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 px-6 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        {description && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  )
}
