import { cache } from 'react'
import type { About } from '@payload-types'
import { payload } from '@/lib/payload'

export const getAboutWithFacts = cache(async (): Promise<About> => {
  const about = await payload.findGlobal({ slug: 'about' })


  const autoFacts: NonNullable<About['facts']> = [
    { label: 'Location', value: about.location },
    { label: 'Experience', value: `${new Date().getFullYear() - about.startYear}+ years` },
    { label: 'Focus', value: about.subtitle },
  ]


  return {
    ...about,
    facts: [...autoFacts, ...(about.facts ?? [])],
  }
})
