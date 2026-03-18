'use client'

import { Chip } from '@heroui/react'
import type { Project, Skill } from '@payload-types'
import { getCompanyName, getSkills } from '@/lib/project-utils'

const PROJECT_TYPE_LABELS: Record<Project['projectType'], string> = {
  professional: 'Professional',
  startup: 'Startup',
  'open-source': 'Open Source',
  personal: 'Personal',
  experiment: 'Experiment',
}

interface ProjectAccordionTitleProps {
  project: Project
}

export function ProjectAccordionTitle({ project }: ProjectAccordionTitleProps) {
  const companyName = getCompanyName(project)
  const skills = getSkills(project)
  const firstMetric = project.impactMetrics?.[0]

  return (
    <div className="flex items-center justify-between w-full gap-3 md:gap-6 relative">
      {/* Title + chips */}
      <div className="min-w-0">
        <div className="font-serif text-base md:text-lg text-foreground tracking-tight mb-1.5">
          {project.title}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip size="sm" variant="flat" color="default">
            {companyName ?? PROJECT_TYPE_LABELS[project.projectType]}
          </Chip>
          {skills.slice(0, 2).map((skill: Skill) => (
            <Chip key={skill.id} size="sm" variant="flat" color="primary" className="hidden sm:inline-flex">
              {skill.name}
            </Chip>
          ))}
        </div>
      </div>
      {/* Stat */}
      {firstMetric && (
        <div className="text-right shrink-0 pr-0 md:pr-20 hidden md:block">
          <div className="font-mono text-xl font-semibold text-foreground tracking-tight">
            {firstMetric.value}
          </div>
          <div className="font-sans text-[11px] text-default-400">
            {firstMetric.label}
          </div>
        </div>
      )}
    </div>
  )
}
