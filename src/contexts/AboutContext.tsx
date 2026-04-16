'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { About } from '@payload-types'

const AboutContext = createContext<About | null>(null)

export function AboutProvider({ about, children }: { about: About; children: ReactNode }) {
  return <AboutContext.Provider value={about}>{children}</AboutContext.Provider>
}

export function useAbout(): About {
  const ctx = useContext(AboutContext)
  if (!ctx) throw new Error('useAbout must be used within an AboutProvider')
  return ctx
}
