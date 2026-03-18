import { getPayload } from 'payload'
import config from '@payload-config'
import { HeroSection } from '@/components/sections/hero-section'

import { CompanyList } from '@/components/atoms/company-list'
import { ImpactMetricsGrid } from '@/components/molecules/impact-metrics-grid'
import { SelectedWorkSection } from '@/components/sections/selected-work-section'
import { CareerSection } from '@/components/sections/career-section'
import { CapabilitiesSection } from '@/components/sections/capabilities-section'
import { getImpactMetrics } from '@/actions/impact'
import { getExperiences } from '@/actions/experience'
import { getFeaturedProjects, getProjectsByRole } from '@/actions/projects'
import { getCapabilities } from '@/actions/skills'
import { getEducations } from '@/actions/education'
import { getApprovedRecommendations } from '@/actions/recommendations'
import { getAboutWithFacts } from '@/actions/about'
import { AboutSection } from '@/components/sections/about-section'
import { RecommendationsSection } from '@/components/sections/recommendations-section'
import { ContactSection } from '@/components/sections/contact-section'

export default async function Page() {
  const payload = await getPayload({ config })
  const [{ docs: companies }, metrics, { docs: featuredProjects }, experiences, projectsByRole, capabilities, educations, recommendations, about] = await Promise.all([
    payload.find({ collection: 'companies' }),
    getImpactMetrics({ featuredOnly: true }),
    getFeaturedProjects(),
    getExperiences(),
    getProjectsByRole(),
    getCapabilities(),
    getEducations(),
    getApprovedRecommendations(),
    getAboutWithFacts(),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: about.name,
    jobTitle: about.subtitle,
    url: siteUrl,
    sameAs: about.contact?.socials?.map((s) => s.url).filter(Boolean) ?? [],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <CompanyList companies={companies} />
      <ImpactMetricsGrid metrics={metrics} />
      <SelectedWorkSection projects={featuredProjects} />
      <CareerSection experiences={experiences} projectsByRole={projectsByRole} />
      <CapabilitiesSection capabilities={capabilities} />
      <AboutSection educations={educations} />
      <RecommendationsSection recommendations={recommendations} />
      <ContactSection />
    </>
  )
}
