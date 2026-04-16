'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Accordion, AccordionItem, Divider } from '@heroui/react'
import { motion } from 'framer-motion'
import type { Project } from '@payload-types'
import { SectionHeader } from '@/components/atoms/section-header'
import { ProjectAccordionTitle } from '@/components/atoms/project-accordion-title'
import { ProjectAccordionDetail } from '@/components/atoms/project-accordion-detail'

interface SelectedWorkSectionProps {
  projects: Project[]
  className?: string
}

export function SelectedWorkSection({
  projects,
  className,
}: SelectedWorkSectionProps) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set())

  if (!projects.length) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className={cn('relative pt-20', className)}
    >
      <Divider className="opacity-10 absolute top-0 left-1/2 -translate-x-1/2 w-screen" />

      <SectionHeader
        id="work"
        label="Selected work"
        heading="Projects worth talking about"
        linkHref="/projects"
        linkText="All projects →"
        className="mb-12"
      />

      <Accordion
        variant="bordered"
        selectionMode="single"
        selectedKeys={openKeys}
        showDivider={false}
        onSelectionChange={(keys) => setOpenKeys(keys as Set<string>)}
        className="rounded-xl border-divider/10 overflow-hidden gap-0 p-0"
        itemClasses={{
          base: cn('border-b border-divider/10 last:border-b-0 px-0 group relative',
            'data-[open=true]:bg-primary/5',
            ),
          trigger: cn(
            'grid grid-cols-[1fr_auto] md:grid-cols-[44px_1fr_auto] items-center gap-3 md:gap-6 cursor-pointer',
            'px-4 md:px-7 py-5 md:py-6 text-left',
          ),
          titleWrapper: 'flex-1',
          title: 'text-base',
          indicator: 'text-default-400 text-xl data-[open=true]:rotate-0 transition-transform duration-200',
          content: 'px-4 md:px-7 pb-8 pt-0',
          startContent: 'hidden md:block self-start',
        }}
      >
        {projects.map((project, index) =>{
          const formattedIndex = index < 9 ? `0${index + 1}` : `${index + 1}`
          return (
            <AccordionItem
              key={project.id}
              aria-label={project.title}
              startContent={
                <span className="font-mono text-[11px] text-default-400 tracking-wide">
                  {String(index + 1).padStart(2, '0')}
                </span>
              }
              indicator={({ isOpen }) => (
                <>
                  <div className={cn(
                    "absolute top-0 right-12 text-[60px] font-mono text-default-400 opacity-10 font-black z-20 transition-translate hidden md:block",
                    isOpen && 'top-1/2 -translate-y-1/2',
                  )}>
                    {formattedIndex}
                  </div>
                <span
                  className={cn(
                    'text-xl text-default-400 transition-transform duration-200 inline-block leading-none',
                    isOpen && 'rotate-45',
                  )}
                >
                  +
                </span>
                </>
              )}
              title={<ProjectAccordionTitle project={project}  />}
            >
              <ProjectAccordionDetail project={project} />
            </AccordionItem>
          )
        })}
      </Accordion>
    </motion.section>
  )
}
