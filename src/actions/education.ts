import { cache } from 'react'
import type { Education } from '@payload-types'
import { payload } from '@/lib/payload'

export const getEducations = cache(async (): Promise<Education[]> => {
  const { docs } = await payload.find({
    collection: 'education',
    sort: 'order',
    limit: 0,
  })

  return docs
})
