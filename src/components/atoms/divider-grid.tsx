'use client'

import { cn } from '@/lib/utils'
import { Divider } from '@heroui/react'
import { Children, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

type Breakpoint = 'default' | 'sm' | 'md' | 'lg' | 'xl'

interface DividerGridProps {
  children: ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4 | 5
}

const BP_ORDER: Breakpoint[] = ['default', 'sm', 'md', 'lg', 'xl']

// Responsive column mapping per max column count
const RESPONSIVE_COLS: Record<number, Partial<Record<Breakpoint, number>>> = {
  1: { default: 1 },
  2: { default: 1, sm: 2 },
  3: { default: 1, md: 2, lg: 3 },
  4: { default: 1, sm: 2, lg: 4 },
  5: { default: 1, sm: 2, md: 3, lg: 5 },
}

// Grid column classes (static strings for Tailwind detection)
/* prettier-ignore */
const GRID_CLASS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
}

// Static class lookups so Tailwind can detect them at build time
/* prettier-ignore */
const BLOCK_CLASS: Record<Breakpoint, string> = {
  default: 'block', sm: 'sm:block', md: 'md:block', lg: 'lg:block', xl: 'xl:block',
}
/* prettier-ignore */
const HIDDEN_CLASS: Record<Breakpoint, string> = {
  default: 'hidden', sm: 'sm:hidden', md: 'md:hidden', lg: 'lg:hidden', xl: 'xl:hidden',
}
/* prettier-ignore */
const BORDER_R: Record<Breakpoint, string> = {
  default: 'border-r-1', sm: 'sm:border-r-1', md: 'md:border-r-1', lg: 'lg:border-r-1', xl: 'xl:border-r-1',
}
/* prettier-ignore */
const BORDER_R_0: Record<Breakpoint, string> = {
  default: 'border-r-0', sm: 'sm:border-r-0', md: 'md:border-r-0', lg: 'lg:border-r-0', xl: 'xl:border-r-0',
}

function getEffectiveCols(columns: number): Record<Breakpoint, number> {
  const config = RESPONSIVE_COLS[columns] ?? RESPONSIVE_COLS[1]
  const result = {} as Record<Breakpoint, number>
  let last = config.default ?? 1
  for (const bp of BP_ORDER) {
    if (config[bp] !== undefined) last = config[bp]!
    result[bp] = last
  }
  return result
}

// --- Horizontal dividers ---

function getRowPositions(itemCount: number, cols: number): Set<number> {
  if (itemCount === 0) return new Set([0, 1])
  const rows = Math.ceil(itemCount / cols)
  const positions = new Set<number>()
  for (let i = 0; i <= rows; i++) {
    positions.add(Math.round((i / rows) * 10000) / 10000)
  }
  return positions
}

function getVisibilityClass(presentAt: Set<Breakpoint>): string {
  const classes: string[] = []
  let visible = presentAt.has('default')
  if (!visible) classes.push('hidden')

  for (let i = 1; i < BP_ORDER.length; i++) {
    const bp = BP_ORDER[i]
    const shouldShow = presentAt.has(bp)
    if (shouldShow && !visible) {
      classes.push(BLOCK_CLASS[bp])
      visible = true
    } else if (!shouldShow && visible) {
      classes.push(HIDDEN_CLASS[bp])
      visible = false
    }
  }

  return classes.join(' ')
}

function computeHorizontalDividers(
  itemCount: number,
  effectiveCols: Record<Breakpoint, number>,
): { position: number; className: string }[] {
  const positionsPerBp = new Map<Breakpoint, Set<number>>()
  const allPositions = new Set<number>()

  for (const bp of BP_ORDER) {
    const positions = getRowPositions(itemCount, effectiveCols[bp])
    positionsPerBp.set(bp, positions)
    for (const p of positions) allPositions.add(p)
  }

  const dividers: { position: number; className: string }[] = []

  for (const pos of [...allPositions].sort((a, b) => a - b)) {
    const presentAt = new Set<Breakpoint>()
    for (const bp of BP_ORDER) {
      if (positionsPerBp.get(bp)!.has(pos)) presentAt.add(bp)
    }
    dividers.push({ position: pos, className: getVisibilityClass(presentAt) })
  }

  return dividers
}

// --- Vertical dividers (right border per cell) ---

function getVerticalBorderClass(
  index: number,
  itemCount: number,
  effectiveCols: Record<Breakpoint, number>,
): string {
  const isLastItem = index === itemCount - 1
  const hasBorder = new Set<Breakpoint>()

  for (const bp of BP_ORDER) {
    const cols = effectiveCols[bp]
    if (cols <= 1) continue
    if (isLastItem) continue
    if ((index + 1) % cols !== 0) hasBorder.add(bp)
  }

  if (hasBorder.size === 0) return ''

  const classes: string[] = ['border-divider/10']
  let visible = hasBorder.has('default')
  if (visible) classes.push('border-r-1')

  for (let i = 1; i < BP_ORDER.length; i++) {
    const bp = BP_ORDER[i]
    const shouldShow = hasBorder.has(bp)
    if (shouldShow && !visible) {
      classes.push(BORDER_R[bp])
      visible = true
    } else if (!shouldShow && visible) {
      classes.push(BORDER_R_0[bp])
      visible = false
    }
  }

  return classes.join(' ')
}

export function DividerGrid({
  children,
  className,
  columns = 4,
}: DividerGridProps) {
  const itemCount = Children.count(children)
  const effectiveCols = getEffectiveCols(columns)
  const gridRef = useRef<HTMLDivElement>(null)
  const [rowBoundaries, setRowBoundaries] = useState<number[]>([])

  const measure = useCallback(() => {
    const grid = gridRef.current
    if (!grid) return
    const cells = Array.from(grid.children) as HTMLElement[]
    if (cells.length === 0) return

    // Collect unique row top offsets from actual cell positions
    const rowTops = new Set<number>()
    for (const cell of cells) rowTops.add(cell.offsetTop)

    const sorted = [...rowTops].sort((a, b) => a - b)
    // Add top boundary (0) and bottom boundary (container height)
    const boundaries = [0, ...sorted.filter((t) => t > 0), grid.scrollHeight]
    setRowBoundaries(boundaries)
  }, [])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const observer = new ResizeObserver(measure)
    observer.observe(grid)
    // Also observe each child for height changes
    for (const child of Array.from(grid.children)) observer.observe(child)
    measure()
    return () => observer.disconnect()
  }, [measure, itemCount])

  return (
    <div className={cn('relative', className)}>
      {rowBoundaries.map((px) => (
        <Divider
          key={px}
          className="opacity-10 absolute left-1/2 -translate-x-1/2 w-screen"
          style={{ top: `${px}px` }}
        />
      ))}
      <div ref={gridRef} className={cn('grid', GRID_CLASS[columns])}>
        {Children.map(children, (child, index) => (
          <div className={getVerticalBorderClass(index, itemCount, effectiveCols)}>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
