import type { Metadata } from 'next'
import { SectionHeader } from '@/components/atoms/section-header'
import { RecommendationForm } from '@/components/sections/recommendation-form'

export const metadata: Metadata = {
  title: 'Leave a Recommendation',
  description: 'Leave a professional recommendation or testimonial.',
}

export default function RecommendPage() {
  return (
    <section className="py-20 w-full">
      <SectionHeader
        id="recommend"
        label="Recommend"
        heading="Leave a recommendation"
        className="mb-12"
      />
      <p className="font-sans text-base text-default-500 leading-relaxed mb-8 max-w-xl">
        Worked with me or know my work? I&apos;d love to hear from you. Your recommendation will appear on the site after a quick review.
      </p>
      <RecommendationForm />
    </section>
  )
}
