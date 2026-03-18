import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProjectBySlug } from '@/actions/projects'
import { ProjectDetail } from '@/components/sections/project-detail'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      type: 'article',
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  return <ProjectDetail project={project} />
}
