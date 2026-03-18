import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Users } from '@/collections/Users'
import { Projects } from '@/collections/Projects'
import { Experience } from '@/collections/Experience'
import { Media } from '@/collections/Media'
import { SkillCategories } from '@/collections/SkillCategories'
import { Skills } from '@/collections/Skills'
import { Companies } from '@/collections/Companies'
import { Education } from '@/collections/Education'
import { Roles } from '@/collections/Roles'
import { CapabilityAreas } from '@/collections/CapabilityAreas'
import { Recommendations } from '@/collections/Recommendations'
import { ContactSubmissions } from '@/collections/ContactSubmissions'
import { Hero } from '@/globals/Hero'
import { About } from '@/globals/About'
import { seed } from '@/lib/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Projects,
    Companies,
    Experience,
    Roles,
    SkillCategories,
    Skills,
    CapabilityAreas,
    Education,
    Recommendations,
    ContactSubmissions,
    Media,
  ],
  globals: [Hero, About],
  onInit: async (payload) => {
    // Skip seeding during build — multiple workers cause MongoDB write conflicts
    if (process.env.NEXT_PHASE === 'phase-production-build') return
    await seed(payload)
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, './src/types/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_MONGODB_URI || '',
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  sharp,
})
