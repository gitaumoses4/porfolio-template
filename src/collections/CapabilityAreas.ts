import type { CollectionConfig } from 'payload'
import { revalidateAfterChange } from '@/lib/revalidate'

export const CapabilityAreas: CollectionConfig = {
  slug: 'capability-areas',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'order', 'updatedAt'],
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Display name (e.g. "Frontend & Mobile")' },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: { description: 'Short description of this capability area' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'skill-categories',
      hasMany: true,
      required: true,
      admin: { description: 'Skill categories included in this area' },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: { description: 'Display order (lower = first)' },
    },
  ],
}
