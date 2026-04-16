import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  label: string
  heading: string
  linkHref?: string
  linkText?: string
  className?: string
  id: string;
}

export function SectionHeader({
  id,
  label,
  heading,
  linkHref,
  linkText,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex justify-between items-baseline group', className)}>
      <div>
        <span className="font-mono text-[11px] text-default-400 tracking-widest uppercase block mb-2 scroll-mt-20" id={id}>
          {label}
        </span>
        <h2 className="font-serif text-2xl lg:text-4xl italic text-foreground tracking-tight">
          {heading}
        </h2>
      </div>
      {linkHref && linkText && (
        <Link
          href={linkHref}
          className="font-sans text-sm font-medium text-primary hover:underline"
        >
          {linkText}
        </Link>
      )}
    </div>
  )
}
