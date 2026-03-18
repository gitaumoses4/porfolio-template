import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getProjectsPageData } from '@/actions/projects'
import { ProjectsListing } from '@/components/sections/projects-listing'
import { SectionHeader } from '@/components/atoms/section-header'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'All projects — professional, open source, and personal.',
}

interface ProjectsPageProps {
  searchParams: Promise<{ area?: string; skill?: string }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { area, skill } = await searchParams
  const data = await getProjectsPageData(area ?? null, skill ?? null)


  return (
    <section className="py-20">
      <SectionHeader
        id="projects"
        label={`Projects - (${data.count})`}
        heading="Projects & Products"
        className="mb-12"
      />

      <Suspense>
        <ProjectsListing
          groups={data.groups}
          areaOptions={data.areaOptions}
          skillOptions={data.skillOptions}
          activeArea={data.activeArea}
          activeSkill={data.activeSkill}
        />
      </Suspense>
    </section>
  )
}
