import { forwardRef, cloneElement, isValidElement } from 'react'
import { cn } from '@/utils/cn'

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-soft',
  outline: 'border border-border bg-transparent hover:bg-muted text-foreground',
  ghost: 'bg-transparent hover:bg-muted text-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  link: 'bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto',
}

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-md',
  md: 'h-10 px-4 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-lg',
  icon: 'h-10 w-10 rounded-lg',
}

export function buttonVariants({ variant = 'primary', size = 'md', className } = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150',
    'disabled:opacity-50 disabled:pointer-events-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'active:scale-[0.98]',
    variants[variant],
    sizes[size],
    className
  )
}

// asChild: when true, renders `children` directly (e.g. a <Link>) styled as a button,
// instead of wrapping it in a <button> element.
const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', asChild, children, ...props }, ref) => {
    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        ref,
        className: cn(buttonVariants({ variant, size }), children.props.className),
      })
    }
    return (
      <button ref={ref} className={buttonVariants({ variant, size, className })} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
