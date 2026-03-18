import type { CollectionConfig } from 'payload'
import { revalidateAfterChange } from '@/lib/revalidate'

export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category'],
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  defaultSort: 'category',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'skill-categories',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      admin: { description: 'Display order (lower = first)' },
    },
  ],
}
