import { cache } from 'react'
import type { Hero } from '@payload-types'
import { payload } from '@/lib/payload'

export const getHero = cache(async (): Promise<Hero> => {
  return payload.findGlobal({ slug: 'hero' })
})
