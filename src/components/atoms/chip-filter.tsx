'use client'

import { Chip, ChipProps } from '@heroui/react'
import { cn } from '@/lib/utils'

interface ChipFilterOption {
  key: string
  label: string
}

interface ChipFilterProps {
  label: string
  options: ChipFilterOption[]
  activeKey: string | null
  onToggle: (key: string) => void
  variant?: ChipProps['variant']
  className?: string
}

export function ChipFilter({
  label,
  options,
  activeKey,
  onToggle,
  variant = 'flat',
  className,
}: ChipFilterProps) {
  if (options.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-[11px] font-mono text-default-400 uppercase tracking-widest mr-1">
        {label}
      </span>
      {options.map((option) => {
        const isActive = activeKey === option.key
        return (
          <Chip
            key={option.key}
            size="sm"
            variant={isActive ? 'solid' : variant}
            color={isActive ? 'primary' : 'default'}
            classNames={{
              base: cn(
                'cursor-pointer transition-colors',
                isActive
                  ? ''
                  : variant === 'bordered'
                    ? 'border-divider/30 hover:border-primary/50'
                    : 'hover:bg-default-200',
              ),
              content: cn('text-xs', variant === 'bordered' && 'font-medium'),
            }}
            onClick={() => onToggle(option.key)}
          >
            {option.label}
          </Chip>
        )
      })}
    </div>
  )
}
