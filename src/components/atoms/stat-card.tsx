import { cn } from '@/lib/utils'

interface StatCardProps {
  value: string
  label: string
  className?: string
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className="font-serif text-lg lg:text-2xl text-primary">{value}</span>
      <span className="font-mono text-xs text-default">{label}</span>
    </div>
  )
}
