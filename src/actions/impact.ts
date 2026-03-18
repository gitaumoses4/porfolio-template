import { cache } from 'react'
import type { Company, Project, Role } from '@payload-types'
import { payload } from '@/lib/payload'
import { slugify } from '@/lib/utils'

export interface NormalizedImpactMetric {
  label: string
  value: string
  description?: string | null
  order?: number | null
  source: { type: 'project' | 'role'; name: string; id: string; href: string }
}

export const getImpactMetrics = cache(async (
  { featuredOnly = false }: { featuredOnly?: boolean } = {},
): Promise<NormalizedImpactMetric[]> => {
  const [projectsResult, rolesResult] = await Promise.all([
    payload.find({
      collection: 'projects',
      where: { 'impactMetrics.label': { exists: true } },
      limit: 0,
    }),
    payload.find({
      collection: 'roles',
      where: { 'impactMetrics.label': { exists: true } },
      depth: 1,
      limit: 0,
    }),
  ])

  const metrics: NormalizedImpactMetric[] = []

  for (const role of rolesResult.docs as Role[]) {
    if (!role.impactMetrics?.length) continue
    for (const m of role.impactMetrics) {
      if (featuredOnly && !m.featured) continue
      const companyName = typeof role.company === 'object' ? (role.company as Company).name : role.title
      metrics.push({
        label: m.label,
        value: m.value,
        description: m.description,
        order: m.order,
        source: {
          type: 'role',
          name: companyName,
          id: role.id,
          href: `/#${slugify(companyName)}`,
        },
      })
    }
  }

  for (const project of projectsResult.docs as Project[]) {
    if (!project.impactMetrics?.length) continue
    for (const m of project.impactMetrics) {
      if (featuredOnly && !m.featured) continue
      metrics.push({
        label: m.label,
        value: m.value,
        description: m.description,
        order: m.order,
        source: { type: 'project', name: project.title, id: project.id, href: `/projects/${project.slug}` },
      })
    }
  }

  metrics.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))

  return metrics.slice(0, 4);
})
