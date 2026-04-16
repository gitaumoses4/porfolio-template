import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const toneBorder: Record<string, string> = {
  primary: 'border-primary',
  secondary: 'border-secondary',
  success: 'border-success',
  warning: 'border-warning',
}

const toneBg: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
}

interface TimelineItemProps {
  tone: 'primary' | 'secondary' | 'success' | 'warning'
  isLast: boolean
  sticky?: boolean
  children: ReactNode
}

export function TimelineItem({ tone, isLast, sticky, children }: TimelineItemProps) {
  return (
    <div className={cn('flex gap-4 w-full', sticky && 'sticky top-0 z-100 py-2')}>
      {/* Left column: dot + line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-[11px] h-[11px] rounded-full border-2 shrink-0 mt-1.5',
            toneBorder[tone],
          )}
        >
          <div className={cn('w-full h-full rounded-full scale-50', toneBg[tone])} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-divider/10" />}
      </div>

      {/* Right column: content */}
      <div className={cn('w-full', sticky ? 'pb-0' : 'pb-10')}>{children}</div>
    </div>
  )
}
