'use client'

import { useMemo } from 'react'
import { Tooltip } from '@heroui/react'
import NextLink from 'next/link'
import { cn } from '@/lib/utils'
import type { SkillWithYears } from '@/actions/skills'

interface SkillTimelineProps {
  skills: SkillWithYears[]
  minYear: number
  maxYear: number
  /** When provided, shows an aggregate row merging all skill years in a secondary color. */
  aggregateLabel?: string
}

export function SkillTimeline({ skills, minYear, maxYear, aggregateLabel }: SkillTimelineProps) {
  const years: number[] = []
  for (let y = minYear; y <= maxYear; y++) years.push(y)

  const aggregateSet = useMemo(() => {
    if (!aggregateLabel) return null
    return new Set(skills.flatMap((s) => s.activeYears))
  }, [skills, aggregateLabel])

  return (
    <div className="flex flex-col gap-1">
      {/* Year axis */}
      <div className="flex items-center gap-2">
        <div className="flex gap-px flex-1 min-w-0">
          {years.map((year) => (
            <div
              key={year}
              className="flex-1 text-center font-mono text-[10px] text-default-400 max-w-5"
            >
              {`'${String(year).slice(2)}`}
            </div>
          ))}
        </div>
      </div>

      {/* Aggregate row */}
      {aggregateLabel && aggregateSet && (
        <div className="flex items-center gap-2 group mb-1">
          <div className="flex gap-px min-w-48">
            {years.map((year) => {
              const isActive = aggregateSet.has(year)
              return (
                <Tooltip key={year} content={year} size="sm" delay={0} closeDelay={0}>
                  <div
                    className={cn(
                      'h-3 flex-1 rounded-[2px] transition-colors max-w-5',
                      isActive
                        ? 'bg-secondary/80 group-hover:bg-secondary'
                        : 'bg-secondary/10',
                    )}
                  />
                </Tooltip>
              )
            })}
          </div>
          <span className="truncate font-mono text-xs font-medium text-secondary">
            {aggregateLabel}
          </span>
        </div>
      )}

      {/* Skill rows */}
      {skills.map(({ skill, activeYears }) => {
        const activeSet = new Set(activeYears)
        return (
          <div key={skill.id} className="flex items-center gap-2 group">
            <div className="flex gap-px min-w-48">
              {years.map((year) => {
                const isActive = activeSet.has(year)
                return (
                  <Tooltip key={year} content={year} size="sm" delay={0} closeDelay={0}>
                    <div
                      className={cn(
                        'h-3 flex-1 rounded-[2px] transition-colors max-w-5',
                        isActive
                          ? 'bg-primary/80 group-hover:bg-primary'
                          : 'bg-primary/10',
                      )}
                    />
                  </Tooltip>
                )
              })}
            </div>
            <NextLink
              href={`/projects?skill=${encodeURIComponent(skill.name)}`}
              className="truncate font-mono text-xs text-default-500 hover:text-foreground transition-colors text-right"
              title={skill.name}
            >
              {skill.name}
            </NextLink>
          </div>
        )
      })}
    </div>
  )
}
