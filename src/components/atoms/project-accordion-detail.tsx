'use client'

import Image from 'next/image'
import { Button, Chip, Divider, Link } from '@heroui/react'
import type { Media, Project } from '@payload-types'
import { getSkills } from '@/lib/project-utils'
import { mediaUrl } from '@/lib/utils'
import { TechStackList } from '@/components/atoms/tech-stack-list'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

function isVideo(media: Media): boolean {
  return media.mimeType?.startsWith('video/') ?? false
}

interface ProjectAccordionDetailProps {
  project: Project
}

export function ProjectAccordionDetail({ project }: ProjectAccordionDetailProps) {
  const skills = getSkills(project)

  // Prefer coverImage, fall back to first media item
  const cover = isMedia(project.coverImage) ? project.coverImage : null
  const firstMedia = project.media?.[0]
  const mediaItem = cover ?? (firstMedia && isMedia(firstMedia.asset) ? firstMedia.asset : null)
  const caption = !cover && firstMedia ? firstMedia.caption : mediaItem?.alt

  return (
    <div className="grid grid-cols-1 md:grid-cols-[44px_1fr] gap-0 md:gap-6">
      <div className="hidden md:block" /> {/* spacer for index column */}
      <div>
        {/* Lede */}
        <p className="font-sans italic text-sm text-default-500 mb-6">
          {project.shortDescription}
        </p>

        {/* Cover media */}
        {mediaItem?.url && (
          <figure className="mb-6 overflow-hidden rounded-lg border border-divider/10">
            {isVideo(mediaItem) ? (
              <video
                src={mediaUrl(mediaItem.url)}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto max-h-72 object-cover"
              />
            ) : (
              <Image
                src={mediaUrl(mediaItem.url)}
                alt={mediaItem.alt ?? project.title}
                width={mediaItem.width ?? 800}
                height={mediaItem.height ?? 450}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto max-h-72 object-cover"
              />
            )}
            {caption && (
              <figcaption className="px-3 py-2 font-mono text-[11px] text-default-400">
                {caption}
              </figcaption>
            )}
          </figure>
        )}

        <Divider className="opacity-10 mb-6" />

        {/* Problem / tech / links grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {/* Problem */}
          {project.problemStatement && (
            <div>
              <Chip size="sm" variant="flat" color="warning" className="mb-2.5">
                Problem
              </Chip>
              <p className="font-sans text-[13.5px] text-default-500 leading-relaxed">
                {project.problemStatement}
              </p>
            </div>
          )}

          {/* Tech stack */}
          {skills.length > 0 && (
            <div>
              <Chip size="sm" variant="flat" color="primary" className="mb-2.5">
                Stack
              </Chip>
              <TechStackList skills={skills} />
            </div>
          )}

          {/* Links */}
          {(project.links?.liveUrl || project.links?.github) && (
            <div>
              <Chip size="sm" variant="flat" color="success" className="mb-2.5">
                Links
              </Chip>
              <div className="flex gap-2">
                {project.links.liveUrl && (
                  <Button
                    as="a"
                    href={project.links.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="bordered"
                    size="sm"
                    className="font-sans text-sm text-primary border-primary/20 w-fit"
                    endContent={<FontAwesomeIcon icon={faArrowRight} />}
                  >
                    Live Site
                  </Button>
                )}
                {project.links.github && (
                  <Button
                    as="a"
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="bordered"
                    size="sm"
                    className="font-sans text-sm text-default-500 border-default/20 w-fit"
                    startContent={<FontAwesomeIcon icon={faGithub} />}
                  >
                    GitHub
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* View project link */}
        <div className="mt-6">
          <Link
            href={`/projects/${project.slug}`}
            className="font-sans text-sm font-medium text-primary hover:underline"
          >
            View full project &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
