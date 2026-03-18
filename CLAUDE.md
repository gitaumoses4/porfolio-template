# Portfolio — Project Context

## Overview
Personal portfolio site built with **Next.js 16**, **Payload CMS 3**, **Tailwind CSS v4**, and **HeroUI** (component library). Deployed with a MongoDB (Atlas) database and Vercel Blob media storage.

## Commands
- `pnpm dev` — start dev server
- `pnpm build` — production build (use to verify changes)
- `pnpm lint` — eslint
- `pnpm generate:types` — regenerate `src/types/payload-types.ts` after Payload schema changes

## Architecture

### Route Groups
- `src/app/(site)/` — public-facing pages (layout fetches Payload globals, wraps in Providers)
- `src/app/(payload)/` — Payload admin panel and API routes

### Data Flow
`(site)/layout.tsx` fetches `hero` via `getHero()` (from `@/actions/hero`) and `about` via `getAboutWithFacts()` (from `@/actions/about`), passes them to `<Providers hero={hero} about={about}>` which wraps `HeroProvider` → `AboutProvider` → `HeroUIProvider` → `NextThemesProvider`. Client components access hero data via `useHero()` from `@/contexts/HeroContext` and identity/about data via `useAbout()` from `@/contexts/AboutContext`. All server action functions are wrapped with `React.cache()` for request-level deduplication (layout's `generateMetadata` and render both call the same cached functions).
`(site)/page.tsx` is an async server component that fetches companies, impact metrics (via `getImpactMetrics()` from `@/actions/impact`), featured projects, experiences, capabilities, and educations in parallel, then renders `<HeroSection>` → `<CompanyList>` → `<ImpactMetricsGrid>` (top 4 metrics) → `<SelectedWorkSection>` (up to 3 featured projects as accordion) → `<CareerSection>` (vertical timeline of experience/roles) → `<CapabilitiesSection>` → `<AboutSection>` (profile photo + name + subtitle, two-column layout: overview + education left, facts sidebar + quote right) → `<ContactSection>` (heading, description, contact form via `<ContactForm />`, social icon links; reads `useAbout()` contact group).
`(site)/resume/preview/page.tsx` — server component that fetches CMS data (about, experiences, capabilities, educations) and renders a Tailwind-styled HTML résumé via `<ResumePage>` + `<PrintButton>`. PDF export uses browser `window.print()` with `@media print` styles in `globals.css`. Falls back as the download link in contact-section when no uploaded resume file exists.

### Component Structure
- `src/components/atoms/` — small reusable pieces (status-badge, stat-card, cta-button-group, theme-toggle, company-list, impact-metrics-grid, section-header, project-accordion-title, project-accordion-detail, tech-stack-list, timeline-item, role-card)
- `src/components/organisms/` — larger interactive components (interactive-desk-screen)
- `src/components/sections/` — page sections composed from atoms (hero-section, selected-work-section, career-section, capabilities-section, about-section, contact-section)
- `src/components/resume/` — Tailwind-styled HTML resume (ResumePage server component + PrintButton client component for `window.print()` PDF export)
- `src/components/layout/` — structural components (Nav)

### Payload CMS
- **Globals:**
  - `hero` (`src/globals/Hero.ts`) — hero section data (title for SEO, statusText, primaryCta, secondaryCta, stats, resume upload)
  - `about` (`src/globals/About.ts`) — identity & about section data (name, subtitle, bio as Lexical richText, location, startYear, photo upload, heading, overview as richText, facts array of optional extra label/value pairs, quote group with text/attribution, contact group with heading/description/email/socials array). The About global is the single source of truth for personal identity fields (name, subtitle, bio) used across hero-section, Nav, about-section, and contact-section via `useAbout()` context. Auto-facts (Location, Experience, Focus, Education) are computed by `getAboutWithFacts()` in `src/actions/about.ts` and prepended to any manual facts from the CMS.
- **Collections:**
  - `users` — Payload admin users
  - `companies` (`src/collections/Companies.ts`) — company name, location, website, logo (upload)
  - `roles` (`src/collections/Roles.ts`) — standalone role records: title, company (relationship → companies), employmentType, locationType, startDate, endDate, current, description (richText), skills (relationship → skills, hasMany), ownershipLevel, impactMetrics (array: label, value, description, featured, order)
  - `experience` (`src/collections/Experience.ts`) — references a company; has `roles` relationship (hasMany → roles); plus media array (asset upload + description)
  - `skill-categories` (`src/collections/SkillCategories.ts`) — label, value (unique slug like `language`, `frontend-framework`), order; single source of truth for skill category options
  - `skills` (`src/collections/Skills.ts`) — name, category (relationship → skill-categories), order
  - `education` (`src/collections/Education.ts`) — institution, website, degree, fieldOfStudy, honours, startDate, endDate, description (richText), location, order
  - `projects` (`src/collections/Projects.ts`) — title, slug, shortDescription, projectType, status, experienceRole (relationship → roles, shown for professional projects), role, overview, techStack, links, media, featured, order
  - `contact-submissions` (`src/collections/ContactSubmissions.ts`) — name, email, message (textarea, maxLength 1000), status (select: unread/read); public create, authenticated read/update/delete
  - `media` (`src/collections/Media.ts`) — file uploads (Vercel Blob-backed via `@payloadcms/storage-vercel-blob`); has `folder` select field (`general`, `companies`, `projects`, `about`, `experience`, `hero`) and a `beforeChange` hook (`organizeUpload`) that on create prefixes `data.filename` with `{folder}/{slugified-alt-or-name}-{uid}` to create folder structure automatically
- **Types:** auto-generated at `src/types/payload-types.ts` (aliased as `@payload-types`)
- **Seeding:** `src/lib/seed.ts` — idempotent seed for hero stats, about global, skill categories, skills, companies, roles, experience, education, and projects. Uses helper functions `richText()` (builds Lexical JSON from bullet strings), `findCompany()`, `findSkills()`, `findRole()`, `findCategory()`, and `findCategories()` for relationship lookups. Includes a migration block that converts old string category values to ObjectId references.
- **Helpers:**
  - `src/lib/impact.ts` — `getImpactMetrics(payload)` aggregates impact metrics from both projects and roles into a flat `NormalizedImpactMetric[]` with source attribution
  - `src/lib/project-utils.ts` — `getCompanyName()`, `getSkills()`, `getDateRange()` helpers for extracting populated relationship data from Project objects
  - `src/actions/hero.ts` — `getHero()` cached fetch of the Hero global
  - `src/actions/about.ts` — `getAboutWithFacts()` cached fetch of the About global, computes auto-facts (Location, Experience from startYear, Focus from subtitle), and appends any manual CMS facts
  - `src/actions/education.ts` — `getEducations()` cached fetch of Education[] sorted by order
  - `src/actions/contact.ts` — `submitContactForm()` server action: validates + creates contact-submission doc + fire-and-forget email notification via `sendContactNotification` in `src/lib/email.ts`
  - All action functions in `src/actions/` are wrapped with `React.cache()` for per-request deduplication

### Styling
- **Tailwind v4** — configured via CSS (`globals.css`) with `@plugin '../../hero.ts'` for HeroUI theme
- **HeroUI theme** (`hero.ts` at project root) — defines colors (dark/light), radius, fontSize tokens
- **No custom CSS tokens** — use standard Tailwind utilities, not custom `@theme` variables
- **Fonts:** DM Sans (sans), Lora (serif), DM Mono (mono) — loaded in `src/theme/fonts.ts`, mapped via `@theme inline` in globals.css
- **Class merging:** `cn()` from `@/lib/utils` (clsx + tailwind-merge)

### Key Libraries
- `@heroui/react` — UI components (Button, Link, Navbar, etc.)
- `framer-motion` — animations
- `@fortawesome/react-fontawesome` — icons
- `next-themes` — dark/light mode

### Rich Text
Lexical JSON from Payload is rendered via `RenderLexical` in `src/lib/render-lexical.tsx` (lightweight server component, handles paragraph/text/linebreak/list/listitem/bold/italic/underline). Works in both server and client contexts. The official `@payloadcms/richtext-lexical/react` RichText is server-only and can't be used inside `useHero()` client components.
`lexicalToPlainText()` in `src/lib/utils.ts` extracts plain text from Lexical JSON (used in resume summary).

### Interactive Desk Scene
`src/components/organisms/interactive-desk-screen.tsx` — SVG illustration with theme-aware palettes (dark/light), animated code typing, mouse-tracking eyes, clickable lamp with a full-page beam overlay (`LampBeamOverlay` component portaled to `document.body`, uses ref-based DOM updates to avoid React re-renders on scroll). Uses `useHero()` for stat annotations.

## Conventions
- Only mark components `'use client'` if they actually use hooks, context, or browser APIs — pure render components (stat-card, status-badge, timeline-item, recommendation-card, section-header, render-lexical) should remain server components
- Import UI components from `@heroui/react` (not individual packages)
- Use `cn()` for conditional class merging
- Prefer standard Tailwind utilities over custom CSS variables
- Components are typed with explicit interface props
- Button links use `as={Link}` or `as="a"` pattern from Nav
- After changing Payload collection/global schemas, always run `pnpm generate:types` then `pnpm build` to verify
- MongoDB uses native ObjectId strings for IDs — no custom `ID_FIELD` needed; no migrations required
- Relationship populated-checks use `typeof x === 'object'` (not `typeof x !== 'number'` as with PostgreSQL)
- Seed data uses `RequiredDataFromCollectionSlug<'slug'>` for type safety; relationship fields resolved via lookup helpers
- IDE type diagnostics for new Payload slugs will be stale until types are regenerated — the build is the source of truth
