'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Hero } from '@payload-types'

const HeroContext = createContext<Hero | null>(null)

export function HeroProvider({ hero, children }: { hero: Hero; children: ReactNode }) {
  return <HeroContext.Provider value={hero}>{children}</HeroContext.Provider>
}

export function useHero(): Hero {
  const ctx = useContext(HeroContext)
  if (!ctx) throw new Error('useHero must be used within a HeroProvider')
  return ctx
}
