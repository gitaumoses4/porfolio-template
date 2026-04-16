'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Chip } from '@heroui/react'
import type { FilterOption, ProjectGroup } from '@/actions/projects'
import { ChipFilter } from '@/components/atoms/chip-filter'
import { ProjectGrid } from '@/components/atoms/project-grid'

interface ProjectsListingProps {
  groups: ProjectGroup[]
  areaOptions: FilterOption[]
  skillOptions: FilterOption[]
  activeArea: string | null
  activeSkill: string | null
}

export function ProjectsListing({
  groups,
  areaOptions,
  skillOptions,
  activeArea,
  activeSkill,
}: ProjectsListingProps) {
  const router = useRouter()

  const navigate = useCallback(
    (params: { area?: string | null; skill?: string | null }) => {
      const qs = new URLSearchParams()
      const area = params.area !== undefined ? params.area : activeArea
      const skill = params.skill !== undefined ? params.skill : activeSkill
      if (area) qs.set('area', area)
      if (skill) qs.set('skill', skill)
      const str = qs.toString()
      router.push(str ? `/projects?${str}` : '/projects', { scroll: false })
    },
    [activeArea, activeSkill, router],
  )

  const toggleArea = useCallback(
    (key: string) => {
      navigate(activeArea === key
        ? { area: null, skill: null }
        : { area: key, skill: null },
      )
    },
    [activeArea, navigate],
  )

  const toggleSkill = useCallback(
    (key: string) => {
      navigate(activeSkill === key ? { skill: null } : { skill: key })
    },
    [activeSkill, navigate],
  )

  const hasFilter = activeArea || activeSkill

  return (
    <div>
      {/* Filters */}
      <div className="space-y-3 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <ChipFilter
            label="Area"
            options={areaOptions}
            activeKey={activeArea}
            onToggle={toggleArea}
          />
          {hasFilter && (
            <Chip
              size="sm"
              variant="flat"
              color="danger"
              classNames={{ base: 'cursor-pointer ml-1', content: 'text-xs' }}
              onClick={() => navigate({ area: null, skill: null })}
            >
              Clear
            </Chip>
          )}
        </div>

        {activeArea && skillOptions.length > 0 && (
          <ChipFilter
            label="Skill"
            options={skillOptions}
            activeKey={activeSkill}
            onToggle={toggleSkill}
            variant="flat"
          />
        )}
      </div>

      {/* Grouped results */}
      {groups.length === 0 ? (
        <p className="text-default-400 text-center py-16">
          No projects found{activeSkill ? ` for "${activeSkill}"` : activeArea ? ` in "${activeArea}"` : ''}.
        </p>
      ) : (
        <div className="space-y-12">
          {groups.map(({ type, label, projects }) => (
            <ProjectGrid key={type} heading={label} projects={projects} />
          ))}
        </div>
      )}
    </div>
  )
}
