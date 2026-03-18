# Portfolio Template

A developer portfolio built with **Next.js 16**, **Payload CMS 3**, **Tailwind CSS v4**, and **HeroUI**. All content is CMS-driven — fork it, replace the placeholder data with your own, and deploy.

## Features

- **CMS-driven content** — edit everything (hero, about, experience, projects, skills, education) from the Payload admin panel
- **Interactive desk scene** — SVG illustration with theme-aware palettes, animated typing, mouse-tracking eyes, and a clickable lamp
- **Dark/light mode** — powered by `next-themes` with system preference detection
- **Resume page** — auto-generated HTML resume from CMS data with browser print-to-PDF
- **Contact form** — submissions stored in Payload with optional email notifications via Resend
- **Spider charts** — per-capability skill visualizations with timeline toggle
- **SEO** — dynamic OpenGraph images, sitemap, and robots.txt
- **Recommendations** — public recommendation form for colleagues to submit testimonials

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone and install

```bash
git clone git@github.com:gitaumoses4/porfolio-template.git my-portfolio
cd my-portfolio
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_MONGODB_URI` | Yes | MongoDB connection string |
| `PAYLOAD_SECRET` | Yes | Random string (32+ chars) for Payload auth |
| `NEXT_PUBLIC_SERVER_URL` | Yes | Your site URL (`http://localhost:3000` for dev) |
| `BLOB_READ_WRITE_TOKEN` | No | Vercel Blob token for media storage (production) |
| `RESEND_API_KEY` | No | [Resend](https://resend.com) API key for contact form emails |
| `NOTIFICATION_EMAIL` | No | Email address to receive contact form notifications |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID |

### 3. Start the dev server

```bash
pnpm dev
```

- **Site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin (create your first user on first visit)

The seed script runs automatically on first boot, populating placeholder data for all sections.

## Personalizing Your Portfolio

### Via the Admin Panel (recommended)

Navigate to http://localhost:3000/admin and edit:

1. **About** (global) — your name, title, subtitle, bio, location, career start year, profile photo, overview, quote, contact email, and social links
2. **Hero** (global) — page title, status text, CTA buttons, stats, and resume upload
3. **Companies** — add your employers with logos
4. **Roles** — add your job titles, descriptions, skills, and impact metrics
5. **Experience** — link companies to roles
6. **Skills** and **Skill Categories** — your technical skills
7. **Education** — degrees and institutions
8. **Projects** — your work with descriptions, tech stacks, links, and media

### Via Seed Data

Edit `src/lib/seed.ts` to change the data that gets populated on first boot. This is useful if you want to start fresh — just drop the database and restart.

### Favicon

Edit `src/app/icon.tsx` to change the initials shown in the browser tab.

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm generate:types` | Regenerate Payload types after schema changes |

## Project Structure

```
src/
├── actions/          # Server actions (cached data fetching)
├── app/
│   ├── (site)/       # Public pages (home, projects, resume, etc.)
│   └── (payload)/    # Payload admin panel and API routes
├── collections/      # Payload CMS collection schemas
├── components/
│   ├── atoms/        # Small reusable components
│   ├── molecules/    # Mid-size composed components
│   ├── organisms/    # Large interactive components
│   ├── sections/     # Full page sections
│   ├── layout/       # Nav, Footer
│   └── resume/       # HTML resume components
├── contexts/         # React contexts (Hero, About)
├── globals/          # Payload CMS global schemas (Hero, About)
├── lib/              # Utilities, seed, email, rich text renderer
└── theme/            # Font configuration
```

## Deployment

### Vercel (recommended)

1. Push your repo to GitHub
2. Import it on [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. For media uploads, create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN`

### Other platforms

The app is a standard Next.js application — it runs anywhere Next.js does. You'll need:
- A MongoDB database
- An object storage solution for media (or swap the Vercel Blob adapter in `payload.config.ts`)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| CMS | Payload CMS 3 |
| Database | MongoDB |
| Styling | Tailwind CSS v4 |
| UI Components | HeroUI |
| Animations | Framer Motion |
| Icons | Font Awesome |
| Rich Text | Lexical (via Payload) |
| Email | Resend |
| Media Storage | Vercel Blob |

## License

MIT
