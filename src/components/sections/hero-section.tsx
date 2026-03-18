'use client'

import { cn } from '@/lib/utils'
import { useHero } from '@/contexts/HeroContext'
import { useAbout } from '@/contexts/AboutContext'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { StatusBadge } from '@/components/atoms/status-badge'
import { StatCard } from '@/components/atoms/stat-card'
import { CtaButtonGroup } from '@/components/atoms/cta-button-group'
import { RenderLexical } from '@/lib/render-lexical'
import { InteractiveDeskScene } from '@/components/organisms/interactive-desk-screen'
import { motion, useScroll, useTransform } from 'framer-motion'

interface HeroSectionProps {
  className?: string
}

export function HeroSection({ className }: HeroSectionProps) {
  const { statusText, primaryCta, secondaryCta, stats } = useHero()
  const { name, subtitle, bio } = useAbout()
  const isDesktop = useBreakpoint('lg')
  const { scrollY } = useScroll()
  const deskOpacity = useTransform(scrollY, [0, 400], [1, 0.2])
  const beamAngle = useTransform(scrollY, [0, 5000], isDesktop ? [180, 0] : [120, 60])

  return (
    <section
      className={cn(
        'relative lg:grid lg:grid-cols-2 min-h-[70dvh]',
        className,
      )}
    >

      {/* Hero content — on top of the background scene on mobile */}
      <div className="relative z-10 flex flex-col gap-6 py-22 max-w-5xl">

        <StatusBadge text={statusText} />

        <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] text-foreground font-bold">
          {name}
        </h1>

        <p className="font-serif text-lg md:text-2xl italic text-default">
          {subtitle}
        </p>

        <RenderLexical
          data={bio}
          className="max-w-xl font-sans text-base leading-relaxed text-default"
        />

        <CtaButtonGroup primary={primaryCta} secondary={secondaryCta} />


        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 flex-wrap gap-4 lg:gap-8 pt-4">
            {stats.map((stat) => (
              <StatCard key={stat.id ?? stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        )}
      </div>

      {/* Placeholder to preserve grid column on desktop */}
      <div className="hidden lg:block" aria-hidden />

      {/* Desk scene — fixed on screen, positioned in the right half on desktop */}
      <motion.div
        className={cn(
          'fixed flex items-end justify-center pointer-events-none',
          'lg:fixed lg:top-0 lg:right-0  lg:w-1/2 h-screen lg:items-center lg:justify-start lg:pointer-events-auto',
        )}
        style={{ opacity: isDesktop ? deskOpacity : 0.2 }}
      >
        <InteractiveDeskScene
          className="w-full max-w-xs lg:max-w-xl"
          angle={beamAngle}
          opacity={deskOpacity}
        />
      </motion.div>
    </section>
  )
}
