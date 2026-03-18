'use client'

import { cn } from '@/lib/utils'
import { Chip, ChipProps, Link } from '@heroui/react'
import { DividerGrid } from '@/components/atoms/divider-grid'
import { motion } from 'framer-motion'

interface ImpactMetric {
  label: string
  value: string
  description?: string | null
  source: { type: 'project' | 'role'; name: string; id: string; href: string }
}

const backgrounds = ['bg-primary/50', 'bg-secondary/50', 'bg-success/50', 'bg-warning/50'] as const
const chipColors = backgrounds.map(bg => bg.replace('/50', '').replace('bg-', '')) as Array<ChipProps['color']>

interface ImpactMetricsGridProps {
  metrics: ImpactMetric[]
  className?: string
}

export function ImpactMetricsGrid({ metrics, className }: ImpactMetricsGridProps) {
  if (!metrics.length) return null

  return (
    <DividerGrid className={className}>
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="flex flex-col gap-2 sm:gap-4 relative py-6 sm:py-12 px-4"
        >
          <span className={cn("w-12 md:w-20 h-1 absolute left-0 top-0 rounded-md -translate-y-1/2", backgrounds[index % backgrounds.length])}></span>
          <div className="flex flex-col gap-1">
            <span className="font-serif text-lg lg:text-3xl text-default-500">{metric.value}</span>
            <span className="font-mono text-xs text-default">{metric.label}</span>
          </div>
          {metric.description && (
            <span className="text-xs text-default-500">{metric.description}</span>
          )}
          <Chip as={Link} href={metric.source.href} size="sm" variant="flat" color={chipColors[index % chipColors.length]} className="cursor-pointer">
            {metric.source.name}
          </Chip>
        </motion.div>
      ))}
    </DividerGrid>
  )
}
