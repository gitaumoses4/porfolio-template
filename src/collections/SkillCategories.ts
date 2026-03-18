import type { CollectionConfig } from 'payload'
import { revalidateAfterChange } from '@/lib/revalidate'

export const SkillCategories: CollectionConfig = {
  slug: 'skill-categories',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'value', 'order'],
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Display name (e.g. "Frontend Framework")' },
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Slug identifier (e.g. "frontend-framework")' },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: { description: 'Display order (lower = first)' },
    },
  ],
}
