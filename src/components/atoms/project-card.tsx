'use client'

import Image from 'next/image'
import NextLink from 'next/link'
import { Card, CardBody } from '@heroui/react'
import type { Media, Project } from '@payload-types'
import { getCompanyName, getSkills, getDateRange } from '@/lib/project-utils'
import { cn, mediaUrl } from '@/lib/utils'

function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

function isVideo(media: Media): boolean {
  return media.mimeType?.startsWith('video/') ?? false
}

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const company = getCompanyName(project)
  const hasRole = project.experienceRole && typeof project.experienceRole === 'object'
  const dateRange = hasRole ? getDateRange(project) : null
  const techStack = getSkills(project)
  const visibleSkills = techStack.slice(0, 5)
  const overflow = techStack.length - 5

  // Prefer coverImage, fall back to first media item
  const cover = isMedia(project.coverImage) ? project.coverImage : null
  const firstMedia = project.media?.[0]
  const mediaItem = cover ?? (firstMedia && isMedia(firstMedia.asset) ? firstMedia.asset : null)

  return (
    <Card
      as={NextLink}
      href={`/projects/${project.slug}`}
      isPressable
      className={cn('border border-divider/10 bg-content1/50', className)}
      shadow="none"
    >
      {mediaItem?.url && (
        <div className="overflow-hidden">
          {isVideo(mediaItem) ? (
            <video
              src={mediaUrl(mediaItem.url)}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-40 object-cover"
            />
          ) : (
            <Image
              src={mediaUrl(mediaItem.url)}
              alt={mediaItem.alt ?? project.title}
              width={mediaItem.width ?? 800}
              height={mediaItem.height ?? 450}
              className="w-full h-40 object-cover"
            />
          )}
        </div>
      )}

      <CardBody className="p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-base text-foreground leading-snug">
            {project.title}
          </h3>
          {dateRange && (
            <span className="font-mono text-[11px] text-default-400 shrink-0">
              {dateRange}
            </span>
          )}
        </div>

        {company && (
          <span className="text-xs text-default-400">{company}</span>
        )}

        {project.shortDescription && (
          <p className="text-sm text-default-500 line-clamp-2">
            {project.shortDescription}
          </p>
        )}

        {visibleSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {visibleSkills.map((skill) => (
              <span
                key={skill.id}
                className="text-[10px] text-default-500 bg-default-50 rounded-md px-1.5 py-0.5"
              >
                {skill.name}
              </span>
            ))}
            {overflow > 0 && (
              <span className="text-[10px] text-default-300 px-1.5 py-0.5">
                +{overflow}
              </span>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  )
}
