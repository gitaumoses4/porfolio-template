import type { GlobalConfig } from 'payload'
import { revalidateAfterGlobalChange } from '@/lib/revalidate'

export const Hero: GlobalConfig = {
  slug: 'hero',
  label: 'Hero Section',
  hooks: {
    afterChange: [revalidateAfterGlobalChange],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Your Name - Software Engineer',
      admin: { description: 'Page title used for SEO and the browser tab' },
    },
    {
      name: 'statusText',
      type: 'text',
      required: true,
      defaultValue: 'Open to opportunities',
      admin: { description: 'Status line shown above the name' },
    },
    {
      name: 'primaryCta',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'View projects →',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/projects',
        },
      ],
    },
    {
      name: 'secondaryCta',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'Get in touch',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '#contact',
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "8 yrs", "400+", "4+"' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "engineering", "TS files migrated"' },
        },
        {
          name: 'useInIllustration',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show in illustration' },
        }
      ],
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Uploadable résumé (PDF)' },
    },
  ],
}
