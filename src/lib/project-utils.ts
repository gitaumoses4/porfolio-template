import type { Company, Project, Role, Skill } from '@payload-types'

export function getCompanyName(project: Project): string | null {
  if (project.projectType === 'professional' && project.experienceRole) {
    const role = project.experienceRole as Role
    if (role.company && typeof role.company === 'object') {
      return (role.company as Company).name
    }
  }
  return null
}

export function getSkills(project: Project): Skill[] {
  if (!project.techStack) return []
  return project.techStack.filter(
    (s): s is Skill => typeof s === 'object',
  )
}

export function getDateRange(project: Project): string | null {
  if (!project.startDate) return null
  const start = new Date(project.startDate).getFullYear()
  const end = project.endDate
    ? new Date(project.endDate).getFullYear()
    : ''
  return (start === end || !end) ? String(start) : `${start}–${end}`
}
