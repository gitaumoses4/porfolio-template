'use client'

import { Button } from '@heroui/react'
import { useTheme } from 'next-themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  // resolvedTheme is undefined until client hydration — use as SSR guard
  if (!resolvedTheme) return <div className="w-8 h-8" />

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      aria-label="Toggle theme"
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
      className="text-default hover:text-foreground"
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="w-4 h-4" />
    </Button>
  )
}
