import type { CollectionConfig } from 'payload'
import { revalidateAfterChange } from '@/lib/revalidate'

export const Education: CollectionConfig = {
  slug: 'education',
  admin: {
    useAsTitle: 'institution',
    defaultColumns: ['institution', 'degree', 'updatedAt'],
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  fields: [
    {
      name: 'institution',
      type: 'text',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
      admin: { description: 'Institution website URL' },
    },
    {
      name: 'degree',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Bachelor of Science' },
    },
    {
      name: 'fieldOfStudy',
      type: 'text',
      admin: { description: 'e.g. Mathematics and Computer Science' },
    },
    {
      name: 'honours',
      type: 'text',
      admin: { description: 'e.g. Second Class Upper Division' },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
        description: 'Leave empty if currently enrolled',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'order',
      type: 'number',
      admin: { description: 'Display order (lower = first)' },
    },
  ],
}
