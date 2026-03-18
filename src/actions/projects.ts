import { cache } from 'react'
import type { Project } from '@payload-types'
import { payload } from '@/lib/payload'
import { getCapabilities } from '@/actions/skills'
import { getSkills } from '@/lib/project-utils'

export const getLiveProjects = cache(async () => {
  const { docs } = await payload.find({
    collection: 'projects',
    where: {
      public: { equals: true },
      'links.liveUrl': { exists: true },
    },
    sort: 'order',
    depth: 2,
    limit: 0,
  })
  return docs
})

export async function getFeaturedProjects() {
  return payload.find({
    collection: 'projects',
    where: {
      featured: { equals: true },
      public: { equals: true },
    },
    sort: 'order',
    depth: 2,
    limit: 3,
  });
}

export async function getAllPublicProjects() {
  return payload.find({
    collection: 'projects',
    where: {
      public: { equals: true },
    },
    sort: 'order',
    depth: 2,
    limit: 0,
  })
}

// --- Projects page data ---

export interface FilterOption {
  key: string
  label: string
}

export interface ProjectGroup {
  type: string
  label: string
  projects: Project[]
}

export interface ProjectsPageData {
  groups: ProjectGroup[]
  areaOptions: FilterOption[]
  skillOptions: FilterOption[]
  activeArea: string | null
  activeSkill: string | null
  count: number;
}

const PROJECT_TYPE_ORDER: { value: string; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'startup', label: 'Startup' },
  { value: 'open-source', label: 'Open Source' },
  { value: 'personal', label: 'Personal' },
  { value: 'experiment', label: 'Experiment' },
]

function groupByType(projects: Project[]): ProjectGroup[] {
  const groups: ProjectGroup[] = []
  for (const { value, label } of PROJECT_TYPE_ORDER) {
    const matched = projects.filter((p) => p.projectType === value)
    if (matched.length > 0) {
      groups.push({ type: value, label, projects: matched })
    }
  }
  return groups
}

export async function getProjectsPageData(
  area: string | null,
  skill: string | null,
): Promise<ProjectsPageData> {
  const [{ docs: projects }, capabilities] = await Promise.all([
    getAllPublicProjects(),
    getCapabilities(),
  ])

  // Build area options
  const areaOptions: FilterOption[] = capabilities.map((a) => ({
    key: a.label,
    label: a.label,
  }))

  // Resolve area → skill names
  const activeCapability = area
    ? capabilities.find((a) => a.label === area)
    : null
  const areaSkillNames = activeCapability
    ? new Set(activeCapability.skills.map((s) => s.skill.name))
    : null

  // Build skill options (scoped to active area, only skills used by projects)
  let skillOptions: FilterOption[] = []
  if (areaSkillNames) {
    const usedSkillNames = new Set<string>()
    for (const project of projects) {
      for (const s of getSkills(project)) {
        if (areaSkillNames.has(s.name)) usedSkillNames.add(s.name)
      }
    }
    skillOptions = activeCapability!.skills
      .filter((s) => usedSkillNames.has(s.skill.name))
      .map((s) => ({ key: s.skill.name, label: s.skill.name }))
  }

  // Filter projects
  let filtered: Project[]
  if (skill) {
    filtered = projects.filter((p) =>
      getSkills(p).some((s) => s.name === skill),
    )
  } else if (areaSkillNames) {
    filtered = projects.filter((p) =>
      getSkills(p).some((s) => areaSkillNames.has(s.name)),
    )
  } else {
    filtered = projects
  }

  return {
    groups: groupByType(filtered),
    areaOptions,
    skillOptions,
    activeArea: area,
    activeSkill: skill,
    count: filtered.length,
  }
}

export async function getProjectBySlug(slug: string) {
  const { docs } = await payload.find({
    collection: 'projects',
    where: {
      slug: { equals: slug },
      public: { equals: true },
    },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getProjectsByRole(): Promise<Record<string, Project[]>> {
  const { docs } = await payload.find({
    collection: 'projects',
    where: {
      experienceRole: { exists: true },
      public: { equals: true },
    },
    sort: 'order',
    depth: 1,
    limit: 0,
  })

  const map: Record<string, Project[]> = {}
  for (const project of docs) {
    const roleId = typeof project.experienceRole === 'object'
      ? project.experienceRole?.id
      : project.experienceRole
    if (roleId) {
      ;(map[roleId] ??= []).push(project)
    }
  }
  return map
}
