'use client'

import type { Company, Project, Role, Skill } from '@payload-types'
import { RenderLexical } from '@/lib/render-lexical'
import { TechStackList } from '@/components/atoms/tech-stack-list'
import { Card, CardBody, Chip, Link } from '@heroui/react'

function formatDateRange(startDate: string, endDate?: string | null, current?: boolean | null): string {
  const fmt = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  const start = fmt(startDate)
  if (current) return `${start} — Present`
  if (endDate) return `${start} — ${fmt(endDate)}`
  return start
}

interface RoleCardProps {
  role: Role
  showCompany?: boolean
  hideDate?: boolean
  projects?: Project[]
}

export function RoleCard({ role, showCompany = true, hideDate, projects }: RoleCardProps) {
  const company = typeof role.company === 'object' ? (role.company as Company) : null
  const skills = (role.skills ?? []).filter((s): s is Skill => typeof s === 'object')
  const metrics = role.impactMetrics ?? []

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
        {showCompany && company && (
          <span className="font-sans text-[12px] font-bold uppercase tracking-wider text-primary">
            {company.name}
          </span>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-[19px] text-foreground">{role.title}</h3>
          {
            !hideDate && (
              <span className="font-mono text-[11px] text-default-400 whitespace-nowrap">
                {formatDateRange(role.startDate, role.endDate, role.current)}
              </span>
            )
          }
        </div>
      </div>

      {/* Description */}
      <RenderLexical
        data={role.description}
        className="font-sans text-[14px] text-default-500 leading-relaxed max-w-2xl mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 ml-4"
      />

      {/* Tech stack */}
      {skills.length > 0 && (
        <TechStackList skills={skills} className="mb-4" />
      )}

      {/* Impact metrics */}
      {metrics.length > 0 && (
        <div className="flex flex-wrap gap-6">
          {metrics.map((metric) => (
            <div key={metric.id} className="flex flex-col">
              <span className="font-mono text-[14px] font-bold text-foreground">
                {metric.value}
              </span>
              <span className="font-sans text-[11px] text-default-400">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <span className="font-mono text-[11px] text-default-400 uppercase tracking-wider">Projects</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {projects.map((project) => (
              <Card key={project.id} as={Link} href={`/projects/${project.slug}`} shadow="none" isPressable className="border-1 border-divider/10">
                <CardBody className="gap-2 p-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-sans text-[13px] font-medium text-foreground">{project.title}</h4>
                    <Chip size="sm" variant="flat" color={project.status === 'live' ? 'success' : project.status === 'in-progress' ? 'warning' : 'default'} className="ml-auto">
                      {project.status}
                    </Chip>
                  </div>
                  <p className="text-[12px] text-default-400 leading-relaxed line-clamp-2">
                    {project.shortDescription}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
