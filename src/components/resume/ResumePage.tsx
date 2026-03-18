import Image from 'next/image'
import type { About, Company, Education, Experience, Media, Role, Skill } from '@payload-types'
import type { CapabilityArea } from '@/actions/skills'
import { computeDuration, formatDateRange, lexicalToPlainText, mediaUrl } from '@/lib/utils'
import { RenderLexical } from '@/lib/render-lexical'

interface ResumePageProps {
  about: About
  experiences: Experience[]
  capabilities: CapabilityArea[]
  educations: Education[]
  showEmail?: boolean
}

function getCompanyName(exp: Experience): string {
  return typeof exp.company === 'object' ? (exp.company as Company).name : ''
}

function getRoles(exp: Experience): Role[] {
  return (exp.roles ?? [])
    .filter((r): r is Role => typeof r === 'object')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
}

function getSkillNames(role: Role): string[] {
  return (role.skills ?? [])
    .filter((s): s is Skill => typeof s === 'object')
    .map((s) => s.name)
}

function getCompanyLocation(exp: Experience): string | null {
  if (typeof exp.company === 'object') return (exp.company as Company).location ?? null
  return null
}


function getImpactMetrics(role: Role): { label: string; value: string }[] {
  return (role.impactMetrics ?? []).map((m) => ({ label: m.label, value: m.value }))
}

export function ResumePage({ about, experiences, capabilities, educations, showEmail }: ResumePageProps) {
  const summary = lexicalToPlainText(about.bio)

  return (
    <div className="light max-w-[800px] mx-auto bg-white text-gray-700 px-12 py-10 print:px-0 print:py-0 print:max-w-none font-sans text-[13px] leading-relaxed">
      {/* Header */}
      <header className="flex items-center gap-5 mb-6">
        {typeof about.photo === 'object' && about.photo?.url && (
          <Image
            src={mediaUrl((about.photo as Media).url!)}
            alt={about.name}
            width={160}
            height={160}
            sizes="80px"
            className="w-20 h-20 rounded-full object-cover shrink-0"
          />
        )}
        <div>
          <h1 className="text-[32px] font-bold uppercase tracking-[0.15em] text-primary leading-tight">
            {about.name}
          </h1>
          <p className="text-sm text-gray-600 font-medium">{about.subtitle}</p>
          <p className="text-sm text-gray-500 mt-1">
            {about.location}
            {showEmail && about.contact?.email && <> &bull; {about.contact.email}</>}
          </p>
          {process.env.NEXT_PUBLIC_SERVER_URL && (
            <a href={process.env.NEXT_PUBLIC_SERVER_URL} className="text-primary hover:underline">
              {process.env.NEXT_PUBLIC_SERVER_URL}
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">
            Summary
          </h2>
          <p className="text-gray-700">{summary}</p>
        </section>
      )}

      {/* Technical Skills */}
      {capabilities.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">
            Technical Skills
          </h2>
          <ul className="list-disc pl-5 space-y-0.5">
            {capabilities.map((area) => (
              <li key={area.label}>
                <span className="font-bold">{area.label}</span>
                {' – '}
                {area.skills.map((s) => s.skill.name).join(', ')}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Work Experience */}
      {experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">
            Work Experience
          </h2>
          <div className="space-y-5">
            {experiences.map((exp) => {
              const companyName = getCompanyName(exp)
              const companyLocation = getCompanyLocation(exp)
              const roles = getRoles(exp)
              const expDuration = exp.startDate
                ? computeDuration(exp.startDate, exp.endDate)
                : ''

              const [firstRole, ...restRoles] = roles

              const renderRole = (role: Role) => {
                const skills = getSkillNames(role)
                const roleDuration = computeDuration(role.startDate, role.endDate)
                const metrics = getImpactMetrics(role)

                return (
                  <div
                    key={role.id}
                    className="relative pl-4 ml-1 print-role"
                  >
                    <div className="absolute -left-4 h-full top-2 w-px bg-primary opacity-50">
                      <span className="size-2 bg-primary absolute top-0 rounded-full -translate-x-1/2" />
                    </div>
                    <div className="flex flex-col items-baseline justify-between">
                      <h4 className="text-[14px] font-bold text-gray-800">
                        {role.title}
                      </h4>
                      <span className="text-xs text-gray-500 shrink-0">
                        {formatDateRange(role.startDate, role.endDate)}
                        {roleDuration && ` (${roleDuration})`}
                      </span>
                    </div>
                    {skills.length > 0 && (
                      <p className="text-xs text-primary mt-0.5">
                        {skills.join(' · ')}
                      </p>
                    )}
                    <div className="mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-0.5 [&_p]:mb-1 [&_li]:text-gray-700">
                      <RenderLexical data={role.description} />
                    </div>
                    {metrics.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                        {metrics.map((m) => (
                          <span key={m.label} className="text-xs">
                            <span className="font-bold text-primary">{m.value}</span>
                            {' '}
                            <span className="text-gray-500">{m.label}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <div key={exp.id}>
                  {/* Company header + first role: kept together on print */}
                  <div className="print-role">
                    <div className="flex flex-col items-baseline justify-between mb-1">
                      <h3 className="text-[18px] font-bold text-gray-900">
                        {companyName}
                        {companyLocation && (
                          <span className="text-xs font-normal text-gray-500 ml-2">
                            {companyLocation}
                          </span>
                        )}
                      </h3>
                      {exp.startDate && (
                        <span className="text-xs text-gray-500 shrink-0">
                          {formatDateRange(exp.startDate, exp.endDate)}
                          {expDuration && ` (${expDuration})`}
                        </span>
                      )}
                    </div>
                    {firstRole && (
                      <div className="space-y-3 ml-4">
                        {renderRole(firstRole)}
                      </div>
                    )}
                  </div>

                  {/* Remaining roles: each breaks independently */}
                  {restRoles.length > 0 && (
                    <div className="space-y-3 ml-4 mt-3">
                      {restRoles.map(renderRole)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">
            Education
          </h2>
          <div className="space-y-4">
            {educations.map((edu) => {
              const duration = computeDuration(edu.startDate, edu.endDate)
              return (
                <div key={edu.id}>
                  <div className="flex flex-col items-baseline justify-between">
                    <h3 className="text-[16px] font-bold text-gray-900">
                      {edu.institution}
                    </h3>
                    <span className="text-xs text-gray-500 shrink-0">
                      {formatDateRange(edu.startDate, edu.endDate)}
                      {duration && ` (${duration})`}
                    </span>
                  </div>
                  <p className="font-bold text-gray-800">
                    {edu.degree}
                    {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                    {edu.honours && ` — ${edu.honours}`}
                  </p>
                  {edu.description && (
                    <div className="mt-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-0.5 [&_p]:mb-1 [&_li]:text-gray-700 ml-8">
                      <RenderLexical data={edu.description} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Bottom rule */}
      <hr className="border-t-px border-primary mt-6" />
    </div>
  )
}
