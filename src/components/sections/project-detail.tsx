'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Media, Project } from '@payload-types'
import { getCompanyName, getSkills, getDateRange } from '@/lib/project-utils'
import { mediaUrl } from '@/lib/utils'
import { RenderLexical } from '@/lib/render-lexical'
import { TechStackList } from '@/components/atoms/tech-stack-list'
import { Chip, Button, Card, CardBody, Divider, Modal, ModalContent, ModalBody } from '@heroui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

function isVideo(media: Media): boolean {
  return media.mimeType?.startsWith('video/') ?? false
}

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'default'> = {
  live: 'success',
  'in-progress': 'warning',
  archived: 'default',
}

const ROLE_LABELS: Record<string, string> = {
  'solo-developer': 'Solo Developer',
  'lead-engineer': 'Lead Engineer',
  'core-contributor': 'Core Contributor',
  contributor: 'Contributor',
  architect: 'Architect',
  'tech-lead': 'Tech Lead',
}

const TYPE_LABELS: Record<string, string> = {
  professional: 'Professional',
  startup: 'Startup',
  'open-source': 'Open Source',
  personal: 'Personal',
  experiment: 'Experiment',
}

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [lightboxMedia, setLightboxMedia] = useState<Media | null>(null)
  const company = getCompanyName(project)
  const skills = getSkills(project)
  const dateRange = getDateRange(project)

  // Cover media
  const cover = isMedia(project.coverImage) ? project.coverImage : null
  const firstMedia = project.media?.[0]
  const coverMedia = cover ?? (firstMedia && isMedia(firstMedia.asset) ? firstMedia.asset : null)

  // Remaining media (skip first if it was used as cover fallback)
  const galleryItems = project.media?.filter((item) => {
    if (!isMedia(item.asset)) return false
    if (!cover && item === firstMedia) return false
    return true
  }) ?? []

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-default-400 hover:text-foreground transition-colors mb-8"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
        Back to projects
      </Link>

      {/* Cover media */}
      {coverMedia?.url && (
        <div
          className="overflow-hidden rounded-xl border border-divider/10 mb-8 cursor-zoom-in"
          onClick={() => !isVideo(coverMedia) && setLightboxMedia(coverMedia)}
        >
          {isVideo(coverMedia) ? (
            <video
              src={mediaUrl(coverMedia.url)}
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-h-96 object-cover"
            />
          ) : (
            <Image
              src={mediaUrl(coverMedia.url)}
              alt={coverMedia.alt ?? project.title}
              width={coverMedia.width ?? 1200}
              height={coverMedia.height ?? 600}
              className="w-full max-h-96 object-cover"
              priority
            />
          )}
        </div>
      )}

      {/* Title and meta */}
      <header className="mb-10">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="font-serif text-3xl text-foreground">{project.title}</h1>
          {dateRange && (
            <span className="font-mono text-sm text-default-400 shrink-0 pt-2">
              {dateRange}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {company && (
            <span className="text-sm text-default-500">{company}</span>
          )}
          {company && project.projectType && (
            <span className="text-default-300">&middot;</span>
          )}
          {project.projectType && (
            <span className="text-sm text-default-500">
              {TYPE_LABELS[project.projectType] ?? project.projectType}
            </span>
          )}
          {project.status && (
            <>
              <span className="text-default-300">&middot;</span>
              <Chip size="sm" variant="flat" color={STATUS_COLOR[project.status] ?? 'default'}>
                {project.status === 'in-progress' ? 'In Progress' : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Chip>
            </>
          )}
          {project.role && (
            <>
              <span className="text-default-300">&middot;</span>
              <Chip size="sm" variant="flat" color="secondary">
                {ROLE_LABELS[project.role] ?? project.role}
              </Chip>
            </>
          )}
        </div>

        {project.shortDescription && (
          <p className="text-default-500 mt-4">{project.shortDescription}</p>
        )}
      </header>

      <Divider className="opacity-10 mb-10" />

      {/* Overview */}
      {project.overview && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Overview</h2>
          <RenderLexical
            data={project.overview as Parameters<typeof RenderLexical>[0]['data']}
            className="prose prose-sm text-default-600 max-w-none [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
          />
        </section>
      )}

      {/* Problem Statement */}
      {project.problemStatement && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Problem Statement</h2>
          <p className="text-default-600 leading-relaxed">{project.problemStatement}</p>
        </section>
      )}

      {/* Ownership Areas */}
      {project.ownershipAreas && project.ownershipAreas.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Ownership Areas</h2>
          <ul className="list-disc pl-5 space-y-1">
            {project.ownershipAreas.map((item) => (
              <li key={item.id} className="text-default-600">{item.area}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Architecture Summary */}
      {project.architectureSummary && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Architecture</h2>
          <RenderLexical
            data={project.architectureSummary as Parameters<typeof RenderLexical>[0]['data']}
            className="prose prose-sm text-default-600 max-w-none [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
          />
        </section>
      )}

      {/* Technical Decisions */}
      {project.technicalDecisions && project.technicalDecisions.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Technical Decisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.technicalDecisions.map((td) => (
              <Card key={td.id} className="border border-divider/10 bg-content1/50" shadow="none">
                <CardBody className="p-4 gap-2">
                  <h3 className="font-sans text-sm font-medium text-foreground">{td.decision}</h3>
                  {td.reasoning && (
                    <p className="text-xs text-default-500">{td.reasoning}</p>
                  )}
                  {td.tradeoffs && (
                    <p className="text-xs text-default-400 italic">Tradeoffs: {td.tradeoffs}</p>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Constraints */}
      {project.constraints && project.constraints.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Constraints</h2>
          <ul className="list-disc pl-5 space-y-1">
            {project.constraints.map((item) => (
              <li key={item.id} className="text-default-600">{item.constraint}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Impact Metrics */}
      {project.impactMetrics && project.impactMetrics.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.impactMetrics.map((metric) => (
              <Card key={metric.id} className="border border-divider/10 bg-content1/50" shadow="none">
                <CardBody className="p-4 text-center">
                  <span className="font-mono text-xl text-primary font-semibold">{metric.value}</span>
                  <span className="text-xs text-default-500 mt-1">{metric.label}</span>
                  {metric.description && (
                    <span className="text-[11px] text-default-400 mt-0.5">{metric.description}</span>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {skills.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Tech Stack</h2>
          <TechStackList skills={skills} />
        </section>
      )}

      {/* Links */}
      {(project.links?.github || project.links?.liveUrl || project.links?.caseStudy) && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Links</h2>
          <div className="flex flex-wrap gap-3">
            {project.links.liveUrl && (
              <Button
                as="a"
                href={project.links.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="bordered"
                size="sm"
                className="font-sans text-sm text-primary border-primary/20"
                endContent={<FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />}
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
                className="font-sans text-sm text-default-500 border-default/20"
                startContent={<FontAwesomeIcon icon={faGithub} className="w-3 h-3" />}
              >
                GitHub
              </Button>
            )}
            {project.links.caseStudy && (
              <Button
                as="a"
                href={project.links.caseStudy}
                target="_blank"
                rel="noopener noreferrer"
                variant="bordered"
                size="sm"
                className="font-sans text-sm text-default-500 border-default/20"
                endContent={<FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />}
              >
                Case Study
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Media Gallery */}
      {galleryItems.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-foreground mb-4">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleryItems.map((item) => {
              const asset = item.asset as Media
              if (!asset?.url) return null
              return (
                <figure
                  key={item.id}
                  className={`overflow-hidden rounded-lg border border-divider/10 ${!isVideo(asset) ? 'cursor-zoom-in' : ''}`}
                  onClick={() => !isVideo(asset) && setLightboxMedia(asset)}
                >
                  {isVideo(asset) ? (
                    <video
                      src={mediaUrl(asset.url)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto max-h-72 object-cover"
                    />
                  ) : (
                    <Image
                      src={mediaUrl(asset.url)}
                      alt={asset.alt ?? project.title}
                      width={asset.width ?? 800}
                      height={asset.height ?? 450}
                      className="w-full h-auto max-h-72 object-cover"
                    />
                  )}
                  {item.caption && (
                    <figcaption className="px-3 py-2 font-mono text-[11px] text-default-400">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        </section>
      )}
      {/* Lightbox modal */}
      <Modal
        isOpen={!!lightboxMedia}
        onOpenChange={(open) => !open && setLightboxMedia(null)}
        size="5xl"
        backdrop="blur"
        classNames={{
          base: 'bg-transparent shadow-none',
          body: 'p-0',
          closeButton: 'text-white bg-black/50 hover:bg-black/70 z-50',
        }}
      >
        <ModalContent>
          <ModalBody>
            {lightboxMedia?.url && (
              <Image
                src={mediaUrl(lightboxMedia.url)}
                alt={lightboxMedia.alt ?? project.title}
                width={lightboxMedia.width ?? 1920}
                height={lightboxMedia.height ?? 1080}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </article>
  )
}
