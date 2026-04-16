'use client'

import { cn } from '@/lib/utils'
import type { Skill } from '@payload-types'
import { Chip } from '@heroui/react'

interface TechStackListProps {
  skills: Skill[]
  className?: string
}

export function TechStackList({ skills, className }: TechStackListProps) {
  if (skills.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {skills.map((skill) => (
        <Chip
          variant="flat"
          color="primary"
          size="sm"
          key={skill.id}
        >
          {skill.name}
        </Chip>
      ))}
    </div>
  )
}
