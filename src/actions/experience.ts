import { cache } from 'react'
import type { Experience } from '@payload-types'
import { payload } from '@/lib/payload'

export const getExperiences = cache(async (): Promise<Experience[]> => {
  const { docs } = await payload.find({
    collection: 'experience',
    sort: '-startDate',
    depth: 2,
    limit: 0,
  })

  return docs
})
