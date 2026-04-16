'use client'

import { useEffect, useState } from 'react'

/** Tailwind default breakpoints (min-width) */
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

type Breakpoint = keyof typeof BREAKPOINTS

/**
 * Returns `true` when the viewport is at or above the given Tailwind breakpoint.
 * Matches `min-width` semantics — identical to how `lg:` works in Tailwind.
 */
export function useBreakpoint(bp: Breakpoint) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS[bp]}px)`)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [bp])

  return matches
}
