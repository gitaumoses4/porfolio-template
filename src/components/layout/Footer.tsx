'use client'

import { Divider, Link } from '@heroui/react'
import { useAbout } from '@/contexts/AboutContext'

export function Footer() {
  const about = useAbout()
  const socials = about.contact?.socials ?? []

  return (
    <footer className="container mx-auto px-8">
      <Divider className="opacity-10" />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6">
        <span className="font-mono text-[11px] text-default-400">
          &copy; {new Date().getFullYear()} {about.name} &mdash; designed &amp; built by me
          <span className="text-default-300 mx-1">&middot;</span>
        </span>
        <Link href="/privacy" className="text-default-400 hover:text-foreground transition-colors text-xs">
          Privacy
        </Link>
        {socials.length > 0 && (
          <div className="flex gap-5">
            {socials.map((social, i) => (
              <Link
                key={i}
                href={social.url}
                isExternal
                className="font-sans text-xs text-default-400 hover:text-foreground transition-colors"
              >
                {social.label || social.platform}
              </Link>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}
