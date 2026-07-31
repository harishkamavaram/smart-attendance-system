import { createContext, useContext, useState } from 'react'
import { cn } from '@/utils/cn'

const TabsContext = createContext(null)

export function Tabs({ defaultValue, value, onValueChange, className, children }) {
  const [internal, setInternal] = useState(defaultValue)
  const active = value !== undefined ? value : internal
  const setActive = (v) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }) {
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-lg bg-muted p-1', className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, className, children }) {
  const { active, setActive } = useContext(TabsContext)
  const isActive = active === value
  return (
    <button
      type="button"
      onClick={() => setActive(value)}
      className={cn(
        'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        isActive ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children }) {
  const { active } = useContext(TabsContext)
  if (active !== value) return null
  return <div className={cn('mt-4 animate-fade-in', className)}>{children}</div>
}
