import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { revalidateAfterChange } from '@/lib/revalidate'
import { slugify } from '@/lib/utils'

const FOLDER_OPTIONS = [
  { label: 'General', value: 'general' },
  { label: 'Companies', value: 'companies' },
  { label: 'Projects', value: 'projects' },
  { label: 'About', value: 'about' },
  { label: 'Experience', value: 'experience' },
  { label: 'Hero', value: 'hero' },
] as const

const organizeUpload: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation !== 'create' || !data?.filename) return data

  const folder = (data.folder as string) || 'general'
  const originalFilename = data.filename as string
  const dotIndex = originalFilename.lastIndexOf('.')
  const ext = dotIndex !== -1 ? originalFilename.slice(dotIndex + 1) : ''
  const originalBase = dotIndex !== -1 ? originalFilename.slice(0, dotIndex) : originalFilename

  const cleanName = slugify((data.alt as string) || originalBase)
  const uid = Date.now().toString(36)
  const newBase = `${folder}-${cleanName}-${uid}`

  data.filename = ext ? `${newBase}.${ext}` : newBase

  if (data.sizes && typeof data.sizes === 'object') {
    for (const [, sizeData] of Object.entries(data.sizes)) {
      const size = sizeData as Record<string, unknown>
      if (size?.filename && typeof size.filename === 'string') {
        size.filename = size.filename.replace(originalBase, newBase)
      }
    }
  }

  return data
}

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'application/pdf',
    ],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
    resizeOptions: {
      width: 1920,
      withoutEnlargement: true,
    },
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    beforeChange: [organizeUpload],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Describe the image for screen readers and SEO',
      },
    },
    {
      name: 'folder',
      type: 'select',
      defaultValue: 'general',
      options: [...FOLDER_OPTIONS],
      admin: {
        description: 'Category prefix for this upload',
        position: 'sidebar',
      },
    },
  ],
}
