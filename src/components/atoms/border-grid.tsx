'use client'

import { cn } from '@/lib/utils'
import { Children, ReactNode, useCallback, useRef } from 'react'

interface BorderGridProps {
  children: ReactNode
  className?: string
  columns: number
}

function BorderGridCell({ children }: { children?: ReactNode }) {
  const cellRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cellRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
  }, [])

  if (!children) {
    return <div className="border-b border-r border-primary/20" />
  }

  return (
    <div
      ref={cellRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'border-b border-r border-primary/20 relative overflow-hidden',
        'transition-[transform,box-shadow] duration-200 ease-out',
        'hover:z-10 hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(var(--heroui-primary-500),0.15)]',
        'hover:ring-1 hover:ring-primary/30',
        // radial glow follows cursor via CSS vars set in onMouseMove
        'before:pointer-events-none before:absolute before:inset-0 before:opacity-0',
        'before:transition-opacity before:duration-200',
        'hover:before:opacity-100',
        'before:[background:radial-gradient(200px_circle_at_var(--glow-x)_var(--glow-y),hsl(var(--heroui-primary-500)/0.08),transparent_70%)]',
      )}
    >
      {children}
    </div>
  )
}

export function BorderGrid({ children, className, columns }: BorderGridProps) {
  const itemCount = Children.count(children)
  const remainder = itemCount % columns
  const emptyCount = remainder === 0 ? 0 : columns - remainder

  return (
    <div
      className={cn('grid border-t border-l border-primary/20', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Children.map(children, (child) => (
        <BorderGridCell>{child}</BorderGridCell>
      ))}
      {Array.from({ length: emptyCount }, (_, i) => (
        <BorderGridCell key={`empty-${i}`} />
      ))}
    </div>
  )
}
