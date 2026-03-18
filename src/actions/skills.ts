import { cache } from 'react'
import type { Project, Skill } from '@payload-types'
import { payload } from '@/lib/payload'

export interface SkillWithYears {
  skill: Skill
  years: number
  activeYears: number[] // sorted calendar years this skill was used
}

export interface CapabilityArea {
  label: string
  description: string
  skills: SkillWithYears[]
}

/** Skills that share years bidirectionally (same language family). */
const SHARED_YEARS: [string, string][] = [['TypeScript', 'JavaScript']]

/** Max gap (in years) between active years before they're treated as separate spans. */
const BRIDGE_GAP = 2

/**
 * Check whether a project's techStack includes a given skill ID.
 */
function projectUsesSkill(project: Project, skillId: string): boolean {
  const stack = project.techStack
  if (!Array.isArray(stack)) return false
  return stack.some((s) => (typeof s === 'object' ? s.id === skillId : s === skillId))
}

/**
 * Collect the set of calendar years a project spans (startDate → endDate).
 * If endDate is missing, only the start year is counted.
 */
function getProjectYearRange(project: Project, fallback: number): Set<number> {
  const start = project.startDate ? new Date(project.startDate).getFullYear() : fallback
  const end = project.endDate ? new Date(project.endDate).getFullYear() : start
  const years = new Set<number>()
  for (let y = start; y <= end; y++) years.add(y)
  return years
}

/**
 * Given a set of active years, merge spans separated by gaps ≤ BRIDGE_GAP
 * and return the total number of years covered.
 *
 * Example (BRIDGE_GAP = 2):
 *   {2018, 2019, 2022, 2025} → [2018–2022] + [2025] → 5 + 1 = 6
 */
function computeBridgedYears(activeYears: Set<number>): number {
  if (activeYears.size === 0) return 0

  const sorted = [...activeYears].sort((a, b) => a - b)
  let total = 0
  let rangeStart = sorted[0]
  let rangeEnd = sorted[0]

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - rangeEnd <= BRIDGE_GAP) {
      rangeEnd = sorted[i]
    } else {
      total += rangeEnd - rangeStart + 1
      rangeStart = sorted[i]
      rangeEnd = sorted[i]
    }
  }

  return total + (rangeEnd - rangeStart + 1)
}

export const getCapabilities = cache(async (): Promise<CapabilityArea[]> => {
  const [{ docs: areas }, { docs: projects }, { docs: skills }] = await Promise.all([
    payload.find({ collection: 'capability-areas', sort: 'order', limit: 0 }),
    payload.find({ collection: 'projects', where: { public: { equals: true } }, depth: 1, limit: 0 }),
    payload.find({ collection: 'skills', sort: 'order', limit: 0 }),
  ])

  const currentYear = new Date().getFullYear()

  // 1. Collect raw active years per skill from project date ranges
  const rawYears = new Map<string, Set<number>>()
  for (const skill of skills) {
    const years = new Set<number>()
    for (const project of projects) {
      if (projectUsesSkill(project, skill.id)) {
        for (const y of getProjectYearRange(project, currentYear)) years.add(y)
      }
    }
    rawYears.set(skill.id, years)
  }

  // 2. Merge years between related skills (e.g. TS ↔ JS)
  const skillByName = new Map(skills.map((s) => [s.name, s.id]))
  for (const [nameA, nameB] of SHARED_YEARS) {
    const idA = skillByName.get(nameA)
    const idB = skillByName.get(nameB)
    if (!idA || !idB) continue
    const yrsA = rawYears.get(idA)
    const yrsB = rawYears.get(idB)
    if (yrsA && yrsB) {
      const merged = new Set([...yrsA, ...yrsB])
      rawYears.set(idA, merged)
      rawYears.set(idB, merged)
    }
  }

  // 3. Compute bridged year totals
  const skillYearsMap = new Map<string, SkillWithYears>()
  for (const skill of skills) {
    skillYearsMap.set(skill.id, {
      skill,
      years: computeBridgedYears(rawYears.get(skill.id) ?? new Set()),
      activeYears: [...(rawYears.get(skill.id) ?? [])].sort((a, b) => a - b),
    })
  }

  // 4. Group skills into capability areas
  return areas
    .map((area) => {
      const categoryIds = new Set(
        (area.categories ?? []).map((c) => (typeof c === 'object' ? c.id : c)),
      )
      const areaSkills = skills
        .filter((s) => {
          const catId = typeof s.category === 'object' ? s.category.id : s.category
          return categoryIds.has(catId)
        })
        .map((s) => skillYearsMap.get(s.id)!)
        .filter(Boolean)

      return {
        label: area.label,
        description: area.description,
        skills: areaSkills.sort((a, b) => b.years - a.years).filter(
          (a) => a.years > 0
        ),
      }
    })
    .filter((a) => a.skills.length > 0)
})
