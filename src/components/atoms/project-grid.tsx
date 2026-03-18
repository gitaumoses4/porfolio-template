'use client'

import type { Project } from '@payload-types'
import { ProjectCard } from '@/components/atoms/project-card'
import { cn } from '@/lib/utils'

interface ProjectGridProps {
  projects: Project[]
  heading?: string
  count?: boolean
  className?: string
}

export function ProjectGrid({ projects, heading, count = true, className }: ProjectGridProps) {
  if (projects.length === 0) return null

  return (
    <div className={cn(className)}>
      {heading && (
        <div className="flex items-baseline gap-3 mb-5">
          <h3 className="font-serif text-lg text-foreground">{heading}</h3>
          {count && (
            <span className="font-mono text-[11px] text-default-400">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </span>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
