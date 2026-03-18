'use client'

import { Button, Link } from '@heroui/react'
import { cn } from '@/lib/utils'

interface CtaConfig {
  label: string
  href: string
}

interface CtaButtonGroupProps {
  primary: CtaConfig
  secondary: CtaConfig
  className?: string
}

export function CtaButtonGroup({ primary, secondary, className }: CtaButtonGroupProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <Button
        as={Link}
        href={primary.href}
        color="primary"
        variant="solid"
        className="font-sans font-semibold"
      >
        {primary.label}
      </Button>
      <Button
        as={Link}
        href={secondary.href}
        variant="bordered"
        className="font-sans font-semibold text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/60 transition-colors duration-150"
      >
        {secondary.label}
      </Button>
    </div>
  )
}
