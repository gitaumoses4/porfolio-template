'use client'

import type { Recommendation } from '@payload-types'
import { motion } from 'framer-motion'
import { Button, Divider } from '@heroui/react'
import Marquee from 'react-fast-marquee'
import { SectionHeader } from '@/components/atoms/section-header'
import { RecommendationCard } from '@/components/atoms/recommendation-card'
import { useRecommendationModal } from '@/contexts/RecommendationModalContext'

interface RecommendationsSectionProps {
  recommendations: Recommendation[]
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  const { onOpen } = useRecommendationModal()

  const hasRecommendations = recommendations.length > 0

  return (
    <motion.section
      className="py-20 w-full relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <Divider className="opacity-10 absolute top-0 left-1/2 -translate-x-1/2 w-screen mb-12" />
      <div className="flex items-end justify-between mb-12">
        <SectionHeader
          id="recommendations"
          label="Recommendations"
          heading="What people say"
        />
        {hasRecommendations && (
          <Button
            variant="bordered"
            size="sm"
            className="flex-shrink-0 border-1"
            onPress={onOpen}
          >
            Leave a recommendation
          </Button>
        )}
      </div>

      {hasRecommendations ? (
        <Marquee
          speed={40}
          pauseOnHover
          gradient
          gradientColor="var(--background)"
          gradientWidth={60}
          autoFill
        >
          {recommendations.map((rec) => (
            <div key={rec.id} className="min-w-[320px] max-w-[400px] mx-4">
              <RecommendationCard recommendation={rec} />
            </div>
          ))}
        </Marquee>
      ) : (
        <div className="border border-dashed border-default-200 rounded-lg py-16 flex flex-col items-center gap-4">
          <p className="font-serif text-lg italic text-default-400">
            No recommendations yet
          </p>
          <p className="font-sans text-sm text-default-400">
            Worked with me? Be the first to leave one.
          </p>
          <Button
            variant="solid"
            color="primary"
            size="sm"
            onPress={onOpen}
          >
            Leave a recommendation
          </Button>
        </div>
      )}
    </motion.section>
  )
}
