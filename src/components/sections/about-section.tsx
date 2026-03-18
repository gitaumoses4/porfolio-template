'use client'

import type { Education, Media } from '@payload-types'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/atoms/section-header'
import { RenderLexical } from '@/lib/render-lexical'
import { formatDateRange, mediaUrl } from '@/lib/utils'
import { Divider } from '@heroui/react'
import { useAbout } from '@/contexts/AboutContext'

interface AboutSectionProps {
  educations: Education[]
}

export function AboutSection({ educations }: AboutSectionProps) {
  const about = useAbout()
  const photo = about.photo as Media | undefined

  return (
    <motion.section
      className="py-20 w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeader
        id="about"
        label="About"
        heading={about.heading}
        className="mb-12"
      />


      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left column — overview + education */}
        <div className="md:col-span-2 flex flex-col gap-10">
          <RenderLexical
            data={about.overview}
            className="prose prose-sm text-default-600 leading-relaxed [&>p]:mb-4 last:[&>p]:mb-0"
          />

          {educations.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-[11px] text-default-400 tracking-widest uppercase">
                Education
              </h3>
              {educations.map((edu) => (
                <div key={edu.id} className="flex flex-col gap-0.5">
                  <span className="font-sans text-sm font-medium text-foreground">
                    {edu.degree}
                    {edu.fieldOfStudy && ` — ${edu.fieldOfStudy}`}
                  </span>
                  <span className="font-sans text-sm text-default-500">
                    {edu.institution}
                  </span>
                  {edu.honours && (
                    <span className="font-mono text-[11px] text-primary">
                      {edu.honours}
                    </span>
                  )}
                  <span className="font-mono text-[11px] text-default-400">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column — facts + quote */}
        <div className="flex flex-col gap-8">
          {/* Profile photo + name + subtitle */}
          {(photo?.url || about.name) && (
            <div className="flex items-center justify-center gap-6 mb-12">
              {photo?.url && (
                <Image
                  src={mediaUrl(photo.url)}
                  alt={photo.alt ?? about.name}
                  width={192}
                  height={192}
                  sizes="96px"
                  className="rounded-full object-cover w-24 h-24"
                />
              )}
              <div className="flex flex-col gap-1 items-center">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  {about.name}
                </h2>
                <p className="font-sans text-base text-default-500">
                  {about.title}
                </p>
              </div>
            </div>
          )}
          {about.facts && about.facts.length > 0 && (
            <div className="flex flex-col">
              {about.facts.map((fact, i) => (
                <div key={i}>
                  {i > 0 && <Divider className="my-3 opacity-10" />}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[11px] text-default-400 tracking-wider uppercase">
                      {fact.label}
                    </span>
                    <span className="font-sans text-sm font-medium text-foreground">
                      {fact.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {about.quote?.text && (
            <blockquote className="border-l-2 border-primary pl-4">
              <p className="font-serif text-sm italic text-default-500 leading-relaxed">
                &ldquo;{about.quote.text}&rdquo;
              </p>
              {about.quote.attribution && (
                <cite className="font-mono text-[11px] text-default-400 mt-2 block not-italic">
                  — {about.quote.attribution}
                </cite>
              )}
            </blockquote>
          )}
        </div>
      </div>
    </motion.section>
  )
}
