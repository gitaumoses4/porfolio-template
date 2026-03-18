'use client'

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { HeroProvider } from '@/contexts/HeroContext'
import { AboutProvider } from '@/contexts/AboutContext'
import { RecommendationModalProvider } from '@/contexts/RecommendationModalContext'
import { RecommendationModal } from '@/components/organisms/recommendation-modal'
import type { Hero, About } from '@payload-types'
import { ReactNode } from 'react'

export function Providers({ hero, about, children }: { hero: Hero; about: About; children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider>
        <HeroProvider hero={hero}>
          <AboutProvider about={about}>
            <RecommendationModalProvider>
              {children}
              <RecommendationModal />
            </RecommendationModalProvider>
          </AboutProvider>
        </HeroProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  )
}
