import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getAboutWithFacts } from '@/actions/about'
import { getExperiences } from '@/actions/experience'
import { getCapabilities } from '@/actions/skills'
import { getEducations } from '@/actions/education'
import { payload } from '@/lib/payload'
import { ResumePage } from '@/components/resume/ResumePage'
import { PrintButton } from '@/components/resume/PrintButton'

export const metadata: Metadata = {
  title: 'Résumé',
  description: 'View and download my résumé — experience, skills, and education.',
}

export default async function ResumePreviewPage() {
  const [about, experiences, capabilities, educations] = await Promise.all([
    getAboutWithFacts(),
    getExperiences(),
    getCapabilities(),
    getEducations(),
  ])

  const { user } = await payload.auth({ headers: await headers() })

  return (
    <>
      <PrintButton />
      <ResumePage
        about={about}
        experiences={experiences}
        capabilities={capabilities}
        educations={educations}
        showEmail={Boolean(user)}
      />
    </>
  )
}
