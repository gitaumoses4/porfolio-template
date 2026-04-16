'use client'

import { useEffect, useState } from 'react'
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/atoms/theme-toggle'
import { useAbout } from '@/contexts/AboutContext'


const NAV_LINKS = [
  { label: 'Projects', href: '/projects' },
  { label: 'Career', href: '/#career' },
  { label: 'Capabilities', href: '/#capabilities' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Resume', href: '/resume'}
]

export function Nav() {
  const { name } = useAbout()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <Navbar
      isBlurred={false}
      isBordered={false}
      maxWidth="full"
      isMenuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
      classNames={{
        base: cn(
          'transition-all duration-300 z-50',
          scrolled
            ? 'bg-transparent backdrop-blur-xl'
            : 'bg-transparent'
        ),
        wrapper: '',
      }}
    >
      <NavbarBrand as={Link} href="/">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-7 h-7 rounded-small border border-divider/13',
            'flex items-center justify-center',
            'font-serif text-xs font-bold text-primary',
          )}>
            {name.split(' ').map(w => w[0]).join('')}
          </div>
          <span className="font-serif text-medium font-bold text-foreground tracking-medium">
            {name}
          </span>
        </div>
      </NavbarBrand>

      <NavbarContent justify="end" className="hidden sm:flex gap-1">
        {NAV_LINKS.map(link => (
          <NavbarItem key={link.label}>
            <Link
              href={link.href}
              className="font-sans text-sm text-default hover:text-foreground px-3 py-1 rounded-medium transition-colors duration-150"
            >
              {link.label}
            </Link>
          </NavbarItem>
        ))}

        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>

      </NavbarContent>

      <NavbarMenuToggle
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        className="sm:hidden text-default"
      />

      <NavbarMenu className="bg-background/95 backdrop-blur-xl pt-6 gap-1">
        {NAV_LINKS.map(link => (
          <NavbarMenuItem key={link.label}>
            <Link
              href={link.href}
              className="font-sans text-medium text-default hover:text-foreground w-full py-2"
              onPress={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          </NavbarMenuItem>
        ))}

        <NavbarMenuItem className="mt-2 flex items-center gap-3">
          <ThemeToggle />
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}
