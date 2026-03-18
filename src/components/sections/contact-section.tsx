'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/atoms/section-header'
import { useAbout } from '@/contexts/AboutContext'
import { Divider, Link } from '@heroui/react'
import { ContactForm } from '@/components/sections/contact-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBluesky,
  faDribbble,
  faGithub,
  faLinkedin,
  faStackOverflow,
  faXTwitter,
  faYoutube
} from '@fortawesome/free-brands-svg-icons'
import { faArrowDown, faGlobe } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { BorderGrid } from '@/components/atoms/border-grid'

const platformIcons: Record<string, IconDefinition> = {
  github: faGithub,
  linkedin: faLinkedin,
  twitter: faXTwitter,
  bluesky: faBluesky,
  stackoverflow: faStackOverflow,
  youtube: faYoutube,
  dribbble: faDribbble,
  other: faGlobe,
}

export function ContactSection() {
  const about = useAbout()
  const contact = about.contact

  if (!contact) return null

  const socials = contact.socials ?? []

  return (
    <motion.section
      className="py-20 w-full relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <Divider className="opacity-10 absolute top-0 left-1/2 -translate-x-1/2 w-screen mb-12" />
      <SectionHeader
        id="contact"
        label="Contact"
        heading={contact.heading || "Let's work together"}
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        {/* Left — description + contact form */}
        <div className="flex flex-col">
          {contact.description && (
            <p className="font-sans text-base text-default-500 leading-relaxed mb-9">
              {contact.description}
            </p>
          )}
          <ContactForm />
        </div>

        {/* Right — social grid + résumé */}
        <div>
          {socials.length > 0 && (
            <BorderGrid columns={2} >
              {socials.map((social, i) => {
                return (
                  <Link
                    key={i}
                    href={social.url}
                    isExternal
                    className={`block px-5 py-5 bg-content1 hover:bg-primary/10 transition-colors h-full`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon
                        icon={platformIcons[social.platform] ?? faGlobe}
                        className="w-3.5 h-3.5 text-default-400"
                      />
                      <span className="font-sans text-sm font-semibold text-foreground">
                        {social.label || social.platform}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-default-400">
                      {social.url.replace(/^https?:\/\//, '')}
                    </span>
                  </Link>
                )
              })}
            </BorderGrid>
          )}

            <Link
              href={'/resume'}
              className="flex items-center justify-between mt-3 px-5 py-4 border border-primary/10 bg-content1 hover:bg-primary/5 hover:border-primary/20 transition-colors"
            >
              <div>
                <span className="font-sans text-sm font-semibold text-foreground block">
                  Download Résumé
                </span>
                <span className="font-mono text-[11px] text-default-400">
                  PDF
                </span>
              </div>
              <FontAwesomeIcon icon={faArrowDown} className="w-4 h-4 text-primary" />
            </Link>
        </div>
      </div>
    </motion.section>
  )
}
