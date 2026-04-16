'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useDisclosure } from '@heroui/react'

interface RecommendationModalContextValue {
  isOpen: boolean
  onOpen: () => void
  onOpenChange: (open: boolean) => void
}

const RecommendationModalContext = createContext<RecommendationModalContextValue | null>(null)

export function RecommendationModalProvider({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <RecommendationModalContext.Provider value={{ isOpen, onOpen, onOpenChange }}>
      {children}
    </RecommendationModalContext.Provider>
  )
}

export function useRecommendationModal() {
  const ctx = useContext(RecommendationModalContext)
  if (!ctx) throw new Error('useRecommendationModal must be used within RecommendationModalProvider')
  return ctx
}
