import type { Recommendation } from '@payload-types'

interface RecommendationCardProps {
  recommendation: Recommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <div className="border-l-2 border-primary/30 pl-5 py-1 flex flex-col gap-3">
      <p className="font-serif text-sm italic text-default-600 leading-relaxed">
        &ldquo;{recommendation.message}&rdquo;
      </p>

      <div className="flex flex-col gap-0.5">
        <span className="font-sans text-sm font-medium text-foreground">
          {recommendation.name}
        </span>
        <span className="font-mono text-[11px] text-default-400">
          {recommendation.title}
        </span>
        {recommendation.relationship && (
          <span className="font-mono text-[11px] text-default-400">
            {recommendation.relationship}
          </span>
        )}
      </div>
    </div>
  )
}
