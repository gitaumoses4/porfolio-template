import type { Payload, RequiredDataFromCollectionSlug } from 'payload'

/** Build a Lexical richText value from an array of plain-text bullet strings. */
function richText(bullets: string[]) {
  return {
    root: {
      type: 'root',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: bullets.map((text) => ({
        type: 'listitem' as const,
        version: 1,
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        children: [{ type: 'text' as const, version: 1, text, format: 0, detail: 0, mode: 'normal' as const, style: '' }],
      })),
    },
  }
}

/** Look up a company ID by name, returns the numeric ID or undefined. */
async function findCompany(payload: Payload, name: string) {
  const { docs } = await payload.find({ collection: 'companies', where: { name: { equals: name } }, limit: 1 })
  return docs[0]?.id
}

/** Look up skill IDs by name. */
async function findSkills(payload: Payload, names: string[]) {
  const { docs } = await payload.find({ collection: 'skills', where: { name: { in: names } }, limit: 100 })
  return docs.map((d) => d.id)
}

/** Look up a role ID by title. */
async function findRole(payload: Payload, title: string) {
  const { docs } = await payload.find({ collection: 'roles', where: { title: { equals: title } }, limit: 1 })
  return docs[0]?.id
}

/** Look up a skill category ID by value slug. */
async function findCategory(payload: Payload, value: string) {
  const { docs } = await payload.find({ collection: 'skill-categories', where: { value: { equals: value } }, limit: 1 })
  return docs[0]?.id
}

/** Look up multiple skill category IDs by value slugs. */
async function findCategories(payload: Payload, values: string[]) {
  const ids = await Promise.all(values.map((v) => findCategory(payload, v)))
  return ids.filter(Boolean) as string[]
}

export async function seed(payload: Payload) {
  // Seed hero stats
  const hero = await payload.findGlobal({ slug: 'hero' })
  if (!hero.stats || hero.stats.length === 0) {
    await payload.updateGlobal({
      slug: 'hero',
      data: {
        stats: [
          { value: '5+', label: 'years of engineering experience' },
          { value: '10+', label: 'projects shipped' },
          { value: '3+', label: 'open source projects' },
        ],
      },
    })
    payload.logger.info('Seeded hero stats')
  }

  // Seed about
  const about = await payload.findGlobal({ slug: 'about' })
  if (!about.heading || about.heading === 'How I actually work') {
    const existingFacts = about.facts ?? []
    if (existingFacts.length === 0) {
      await payload.updateGlobal({
        slug: 'about',
        data: {
          name: 'Your Name',
          title: 'Software Engineer',
          subtitle: 'Building great software.',
          location: 'Your City',
          startYear: 2020,
          bio: {
            root: {
              type: 'root',
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  version: 1,
                  direction: 'ltr' as const,
                  format: '' as const,
                  indent: 0,
                  children: [
                    {
                      type: 'text', version: 1, format: 0, detail: 0, mode: 'normal' as const, style: '',
                      text: 'A passionate software engineer with experience building production systems. Replace this with your own bio.',
                    },
                  ],
                },
              ],
            },
          },
          heading: 'How I actually work',
          overview: {
            root: {
              type: 'root',
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  version: 1,
                  direction: 'ltr' as const,
                  format: '' as const,
                  indent: 0,
                  children: [
                    {
                      type: 'text', version: 1, format: 0, detail: 0, mode: 'normal' as const, style: '',
                      text: 'Replace this with a few paragraphs about your background, philosophy, and how you approach software engineering.',
                    },
                  ],
                },
              ],
            },
          },
          quote: {
            text: 'Simplicity is the ultimate sophistication.',
            attribution: 'Leonardo da Vinci',
          },
          contact: {
            heading: "Let's work together.",
            description: 'Have a project in mind or just want to connect? Get in touch.',
            email: 'you@example.com',
            socials: [
              { platform: 'github', url: 'https://github.com/your-username', label: 'GitHub' },
              { platform: 'linkedin', url: 'https://linkedin.com/in/your-profile', label: 'LinkedIn' },
              { platform: 'twitter', url: 'https://x.com/your-handle', label: 'X' },
            ],
          },
        },
      })
      payload.logger.info('Seeded about')
    }
  }

  // Seed skill categories
  const { totalDocs: categoryCount } = await payload.count({ collection: 'skill-categories' })
  if (categoryCount === 0) {
    const categories: RequiredDataFromCollectionSlug<'skill-categories'>[] = [
      { label: 'Language', value: 'language', order: 1 },
      { label: 'Frontend Framework', value: 'frontend-framework', order: 2 },
      { label: 'Backend Framework', value: 'backend-framework', order: 3 },
      { label: 'UI Library', value: 'ui-library', order: 4 },
      { label: 'State & Data', value: 'state-data', order: 5 },
      { label: 'API & Query Layer', value: 'api', order: 6 },
      { label: 'Cloud Platform', value: 'cloud', order: 7 },
      { label: 'Data & Processing', value: 'data', order: 8 },
      { label: 'DevOps & Infrastructure', value: 'devops', order: 9 },
      { label: 'Testing & Tooling', value: 'testing', order: 10 },
      { label: 'Identity & Security', value: 'identity', order: 11 },
      { label: 'Architecture & Design', value: 'architecture', order: 12 },
      { label: 'Leadership', value: 'leadership', order: 13 },
    ]

    for (const category of categories) {
      await payload.create({ collection: 'skill-categories', data: category })
    }

    payload.logger.info('Seeded skill categories')
  }

  // Migrate existing skills and capability areas from old string category values to ObjectId references.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = payload.db as any
  const skillsModel = db.collections?.['skills']
  const areasModel = db.collections?.['capability-areas']

  if (skillsModel) {
    const rawSkills = await skillsModel.find({ category: { $type: 'string' } }).lean()
    if (rawSkills.length > 0) {
      const { docs: allCats } = await payload.find({ collection: 'skill-categories', limit: 0 })
      const catMap = new Map<string, string>()
      for (const c of allCats) catMap.set(c.value, c.id)

      for (const skill of rawSkills) {
        const catId = catMap.get(skill.category)
        if (catId) {
          await skillsModel.updateOne({ _id: skill._id }, { $set: { category: catId } })
        }
      }
      payload.logger.info(`Migrated ${rawSkills.length} skills to use skill category references`)
    }
  }

  if (areasModel) {
    const rawAreas = await areasModel.find({}).lean()
    const areasToMigrate = rawAreas.filter(
      (area: { categories?: unknown[] }) =>
        Array.isArray(area.categories) && area.categories.length > 0 && typeof area.categories[0] === 'string',
    )
    if (areasToMigrate.length > 0) {
      const { docs: allCats } = await payload.find({ collection: 'skill-categories', limit: 0 })
      const catMap = new Map<string, string>()
      for (const c of allCats) catMap.set(c.value, c.id)

      for (const area of areasToMigrate) {
        const catIds = (area.categories as string[]).map((v: string) => catMap.get(v)).filter(Boolean)
        await areasModel.updateOne({ _id: area._id }, { $set: { categories: catIds } })
      }
      payload.logger.info(`Migrated ${areasToMigrate.length} capability areas to use skill category references`)
    }
  }

  // Seed skills
  const { totalDocs: skillCount } = await payload.count({ collection: 'skills' })
  if (skillCount === 0) {
    const cat = async (value: string) => {
      const id = await findCategory(payload, value)
      if (!id) throw new Error(`Skill category "${value}" not found`)
      return id
    }

    const skills: RequiredDataFromCollectionSlug<'skills'>[] = [
      { name: 'TypeScript', category: await cat('language'), order: 1 },
      { name: 'React', category: await cat('frontend-framework'), order: 2 },
      { name: 'Python', category: await cat('language'), order: 3 },
      { name: 'Java', category: await cat('language'), order: 4 },

      { name: 'Next.js', category: await cat('frontend-framework'), order: 5 },
      { name: 'Node.js', category: await cat('backend-framework'), order: 6 },
      { name: 'Express', category: await cat('backend-framework'), order: 7 },

      { name: 'PostgreSQL', category: await cat('data'), order: 8 },
      { name: 'MongoDB', category: await cat('data'), order: 9 },

      { name: 'Docker', category: await cat('devops'), order: 10 },
      { name: 'CI/CD', category: await cat('devops'), order: 11 },

      { name: 'GraphQL', category: await cat('api'), order: 12 },
      { name: 'REST APIs', category: await cat('api'), order: 13 },

      { name: 'Tailwind CSS', category: await cat('ui-library'), order: 14 },

      { name: 'System Design', category: await cat('architecture'), order: 15 },
      { name: 'Code Review', category: await cat('leadership'), order: 16 },
    ]

    for (const skill of skills) {
      await payload.create({ collection: 'skills', data: skill })
    }

    payload.logger.info('Seeded skills')
  }

  // Seed capability areas
  const { totalDocs: areaCount } = await payload.count({ collection: 'capability-areas' })
  if (areaCount === 0) {
    const areas: RequiredDataFromCollectionSlug<'capability-areas'>[] = [
      {
        label: 'Frontend & Mobile',
        description: 'Building performant, accessible interfaces across web and mobile',
        categories: await findCategories(payload, ['frontend-framework', 'ui-library']),
        order: 1,
      },
      {
        label: 'Backend & APIs',
        description: 'Designing scalable services, APIs, and data pipelines',
        categories: await findCategories(payload, ['backend-framework', 'api', 'data']),
        order: 2,
      },
      {
        label: 'Languages',
        description: 'Fluency across typed and dynamic languages',
        categories: await findCategories(payload, ['language']),
        order: 3,
      },
      {
        label: 'Cloud & DevOps',
        description: 'Infrastructure, CI/CD, and production reliability',
        categories: await findCategories(payload, ['cloud', 'devops', 'testing', 'identity']),
        order: 4,
      },
      {
        label: 'Architecture & Leadership',
        description: 'System design, team leadership, and technical strategy',
        categories: await findCategories(payload, ['architecture', 'state-data', 'leadership']),
        order: 5,
      },
    ]

    for (const area of areas) {
      await payload.create({ collection: 'capability-areas', data: area })
    }

    payload.logger.info('Seeded capability areas')
  }

  // Seed companies
  const { totalDocs: companyCount } = await payload.count({ collection: 'companies' })
  if (companyCount === 0) {
    const companies: RequiredDataFromCollectionSlug<'companies'>[] = [
      { name: 'Acme Corp', location: 'San Francisco, CA', website: 'https://example.com' },
      { name: 'Globex Inc', location: 'New York, NY', website: 'https://example.com' },
    ]

    for (const company of companies) {
      await payload.create({ collection: 'companies', data: company })
    }

    payload.logger.info('Seeded companies')
  }

  // Seed roles
  const { totalDocs: roleCount } = await payload.count({ collection: 'roles' })
  if (roleCount === 0) {
    const acmeId = await findCompany(payload, 'Acme Corp')
    const globexId = await findCompany(payload, 'Globex Inc')

    const skillIds = async (...names: string[]) => findSkills(payload, names)

    if (acmeId) {
      await payload.create({
        collection: 'roles',
        data: {
          title: 'Senior Software Engineer',
          company: acmeId,
          startDate: '2022-01-01',
          current: true,
          description: richText([
            'Led frontend architecture migration to TypeScript across the main product.',
            'Built and maintained internal developer tooling and CI/CD pipelines.',
            'Mentored junior engineers and conducted code reviews.',
          ]),
          skills: await skillIds('TypeScript', 'React', 'Next.js', 'GraphQL', 'Docker', 'CI/CD', 'System Design', 'Code Review'),
          ownershipLevel: 'contributor',
        } as RequiredDataFromCollectionSlug<'roles'>,
      })
    }

    if (globexId) {
      await payload.create({
        collection: 'roles',
        data: {
          title: 'Software Engineer',
          company: globexId,
          startDate: '2020-06-01',
          endDate: '2021-12-31',
          current: false,
          description: richText([
            'Built RESTful APIs powering the core product using Node.js and Express.',
            'Implemented database migrations and optimized query performance.',
            'Contributed to frontend features using React and Redux.',
          ]),
          skills: await skillIds('TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs'),
          ownershipLevel: 'contributor',
        } as RequiredDataFromCollectionSlug<'roles'>,
      })
    }

    payload.logger.info('Seeded roles')
  }

  // Seed experience
  const { totalDocs: expCount } = await payload.count({ collection: 'experience' })
  if (expCount === 0) {
    const acmeId = await findCompany(payload, 'Acme Corp')
    const globexId = await findCompany(payload, 'Globex Inc')

    const findRolesForCompany = async (companyId: number | string) => {
      const { docs } = await payload.find({ collection: 'roles', where: { company: { equals: companyId } }, limit: 100 })
      return docs.map((d) => d.id)
    }

    if (acmeId) {
      const roleIds = await findRolesForCompany(acmeId)
      await payload.create({
        collection: 'experience',
        data: {
          company: acmeId,
          employmentType: 'full-time',
          locationType: 'remote',
          roles: roleIds,
        } as RequiredDataFromCollectionSlug<'experience'>,
      })
    }

    if (globexId) {
      const roleIds = await findRolesForCompany(globexId)
      await payload.create({
        collection: 'experience',
        data: {
          company: globexId,
          employmentType: 'full-time',
          locationType: 'on-site',
          roles: roleIds,
        } as RequiredDataFromCollectionSlug<'experience'>,
      })
    }

    payload.logger.info('Seeded experience')
  }

  // Seed education
  const { totalDocs: eduCount } = await payload.count({ collection: 'education' })
  if (eduCount === 0) {
    await payload.create({
      collection: 'education',
      data: {
        institution: 'Example University',
        website: 'https://example.edu',
        degree: 'Bachelor of Science (BSc)',
        fieldOfStudy: 'Computer Science',
        honours: 'First Class Honours',
        startDate: '2016-09-01',
        endDate: '2020-06-01',
        location: 'Your City',
        description: richText([
          'Studied algorithms, data structures, and software engineering fundamentals.',
          'Completed coursework in distributed systems, databases, and machine learning.',
        ]),
        order: 1,
      },
    })

    payload.logger.info('Seeded education')
  }

  // Seed projects
  const { totalDocs: projectCount } = await payload.count({ collection: 'projects' })
  if (projectCount === 0) {
    await payload.create({
      collection: 'projects',
      data: {
        title: 'Portfolio',
        slug: 'portfolio',
        shortDescription: 'Personal portfolio site built with Next.js, Payload CMS, and HeroUI. Features an interactive desk scene and CMS-driven content.',
        projectType: 'personal',
        status: 'live',
        role: 'solo-developer',
        overview: richText([
          'Built a portfolio site from scratch to showcase professional experience, projects, and technical skills.',
          'Integrated Payload CMS for content management with MongoDB and media storage.',
          'Designed an interactive SVG desk scene with theme-aware palettes and animations.',
        ]),
        problemStatement: 'Needed a portfolio that goes beyond a static resume — one that demonstrates engineering depth through case studies and interactive elements.',
        techStack: await findSkills(payload, ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'MongoDB']),
        startDate: '2025-01-01',
        featured: true,
        public: true,
        order: 1,
      } as RequiredDataFromCollectionSlug<'projects'>,
    })

    const seniorRoleId = await findRole(payload, 'Senior Software Engineer')

    await payload.create({
      collection: 'projects',
      data: {
        title: 'Example SaaS Platform',
        slug: 'example-saas',
        shortDescription: 'A SaaS platform for managing workflows and automations, built with React and Node.js.',
        projectType: 'professional',
        experienceRole: seniorRoleId,
        status: 'live',
        role: 'core-contributor',
        overview: richText([
          'Contributed to the frontend architecture of a workflow automation platform.',
          'Built reusable component library and design system tokens.',
          'Implemented real-time collaboration features using WebSockets.',
        ]),
        problemStatement: 'Teams needed a centralized platform to automate repetitive workflows and improve cross-team visibility.',
        techStack: await findSkills(payload, ['TypeScript', 'React', 'Next.js', 'GraphQL', 'Docker', 'CI/CD']),
        startDate: '2022-03-01',
        featured: true,
        public: true,
        order: 2,
      } as RequiredDataFromCollectionSlug<'projects'>,
    })

    await payload.create({
      collection: 'projects',
      data: {
        title: 'Open Source CLI Tool',
        slug: 'oss-cli-tool',
        shortDescription: 'A developer CLI tool for scaffolding and managing project configurations, published on npm.',
        projectType: 'open-source',
        status: 'live',
        role: 'solo-developer',
        overview: richText([
          'Built a CLI tool that simplifies project setup and configuration management.',
          'Supports multiple project templates and plugin-based extensibility.',
          'Published on npm with TypeScript-first API design.',
        ]),
        problemStatement: 'Repetitive project scaffolding wastes time — this CLI automates common setup patterns.',
        techStack: await findSkills(payload, ['TypeScript', 'Node.js']),
        links: {
          github: 'https://github.com/your-username/example-cli',
        },
        startDate: '2023-01-01',
        featured: true,
        public: true,
        order: 3,
      } as RequiredDataFromCollectionSlug<'projects'>,
    })

    payload.logger.info('Seeded projects')
  }

  // Seed recommendations
  const { totalDocs: recCount } = await payload.count({ collection: 'recommendations' })
  if (recCount === 0) {
    const recommendations: RequiredDataFromCollectionSlug<'recommendations'>[] = [
    ]

    for (const rec of recommendations) {
      await payload.create({ collection: 'recommendations', data: rec })
    }

    payload.logger.info('Seeded recommendations')
  }
}
