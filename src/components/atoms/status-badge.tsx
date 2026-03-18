import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  text: string
  className?: string
}

export function StatusBadge({ text, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-xs text-default',
        'px-2.5 py-0.5',
        className,
      )}
    >
      <span
        className="size-1.5 rounded-full bg-primary animate-[pulse_2s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      {text}
    </span>
  )
}
