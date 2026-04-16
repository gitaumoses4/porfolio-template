'use client'

import type { Company, Experience, Project, Role } from '@payload-types'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/atoms/section-header'
import { TimelineItem } from '@/components/atoms/timeline-item'
import { RoleCard } from '@/components/atoms/role-card'
import { formatDateRange, slugify } from '@/lib/utils'

const tones = ['primary', 'secondary', 'success', 'warning'] as const

interface CareerSectionProps {
  experiences: Experience[]
  projectsByRole?: Record<string, Project[]>
}

export function CareerSection({ experiences, projectsByRole = {} }: CareerSectionProps) {
  const groups = experiences
    .map((exp, i) => {
      const company =
        typeof exp.company === 'object' ? (exp.company as Company) : null
      const roles = (exp.roles ?? []).filter(
        (r): r is Role => typeof r === 'object',
      ).sort((a, b) => (a.startDate ?? '') < (b.startDate ?? '') ? 1 : -1)
      return { company, roles, experience: exp, tone: tones[i % tones.length] }
    })
    .filter((g) => g.roles.length > 0)

  if (groups.length === 0) return null

  // Total role count for isLast tracking
  let roleIndex = 0
  const totalRoles = groups.reduce((sum, g) => sum + g.roles.length, 0)

  return (
    <section className="py-20 max-w-4xl w-full">
      <SectionHeader id="career" label="Career" heading="Where I've worked" className="mb-12" />

      <div>
        {groups.map(({ company, roles, experience, tone }, groupIdx) => (
          <motion.div
            key={company?.id ?? roles[0].id}
            id={slugify(company?.name ?? 'unknown')}
            className="scroll-mt-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: groupIdx * 0.1 }}
          >
            <TimelineItem tone={tone} isLast={false} sticky>
              <div className="flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span className="font-sans text-[12px] font-bold uppercase tracking-wider text-primary">
                    {company?.name ?? 'Unknown'}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {experience.startDate && (
                    <span className="font-mono text-[11px] text-default-400 whitespace-nowrap">
                      {formatDateRange(experience.startDate, experience.endDate)}
                    </span>
                  )}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-default-400 font-mono">
                    {company?.location && <span>{company.location}</span>}
                    {company?.location && <span className="text-divider">·</span>}
                    <span className="capitalize">{experience.employmentType}</span>
                    <span className="text-divider">·</span>
                    <span className="capitalize">{experience.locationType}</span>
                  </div>
                </div>
              </div>
            </TimelineItem>

            {/* Roles within this experience */}
            {roles.map((role) => {
              roleIndex++
              return (
                <TimelineItem
                  key={role.id}
                  tone={tone}
                  isLast={roleIndex === totalRoles}
                >
                  <RoleCard role={role} showCompany={false} projects={projectsByRole[role.id]} hideDate={roles.length === 1} />
                </TimelineItem>
              )
            })}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
