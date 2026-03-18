'use client'

import { useMemo, useState } from 'react'
import NextLink from 'next/link'
import { motion } from 'framer-motion'
import { Tabs, Tab } from '@heroui/react'
import type { CapabilityArea } from '@/actions/skills'
import { SectionHeader } from '@/components/atoms/section-header'
import { CapabilitySpiderChart } from '@/components/atoms/capability-spider-chart'
import { SkillTimeline } from '@/components/atoms/skill-timeline'
import { DividerGrid } from '@/components/atoms/divider-grid'

interface CapabilitiesSectionProps {
  capabilities: CapabilityArea[]
}

export function CapabilitiesSection({ capabilities }: CapabilitiesSectionProps) {
  const [view, setView] = useState<'chart' | 'timeline'>('chart')

  const { minYear, maxYear } = useMemo(() => {
    const allYears = capabilities.flatMap((a) =>
      a.skills.flatMap((s) => s.activeYears),
    )
    if (allYears.length === 0) return { minYear: 2018, maxYear: 2026 }
    return {
      minYear: Math.min(...allYears),
      maxYear: Math.max(...allYears),
    }
  }, [capabilities])

  if (capabilities.length === 0) return null

  return (
    <section id="capabilities" className="py-10 scroll-mt-20">
      <SectionHeader
        id="capabilities"
        label="Capabilities"
        heading="What I know, and how I've used it"
        className="mb-12"
      />

      <div className="flex justify-end mb-6">
        <Tabs
          size="sm"
          selectedKey={view}
          onSelectionChange={(key) => setView(key as 'chart' | 'timeline')}
        >
          <Tab key="chart" title="Chart" />
          <Tab key="timeline" title="Timeline" />
        </Tabs>
      </div>

      <DividerGrid columns={3}>
        {capabilities.map((area, areaIdx) => (
          <motion.div
            key={area.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: areaIdx * 0.1 }}
            className="flex flex-col gap-3 p-8"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <div className="group flex items-center gap-2">
                  <h3 className="font-serif text-lg text-foreground">{area.label}</h3>
                  <NextLink
                    href={`/projects?area=${encodeURIComponent(area.label)}`}
                    className="text-xs text-primary hover:underline shrink-0 group-hover:inline hidden"
                  >
                    View projects →
                  </NextLink>
                </div>
                <p className="text-sm text-default-400 mt-0.5">{area.description}</p>
              </div>
            </div>

            {view === 'chart' ? (
              <CapabilitySpiderChart skills={area.skills} />
            ) : (
              <SkillTimeline
                skills={area.skills}
                minYear={minYear}
                maxYear={maxYear}
                aggregateLabel={area.label}
              />
            )}
          </motion.div>
        ))}
      </DividerGrid>
    </section>
  )
}
