import type { CollectionConfig } from 'payload'
import { revalidateAfterChange } from '@/lib/revalidate'

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'current', 'startDate', 'updatedAt'],
  },
  hooks: {
    afterChange: [
      revalidateAfterChange,
      async ({ doc, req }) => {
        // Re-save any Experience that references this role so its computed dates update
        const { docs: experiences } = await req.payload.find({
          collection: 'experience',
          where: { roles: { contains: doc.id } },
          limit: 0,
          depth: 0,
        })

        for (const exp of experiences) {
          await req.payload.update({
            collection: 'experience',
            id: exp.id,
            data: { roles: exp.roles },
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
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
        description: 'Leave empty for current role',
        condition: (_, siblingData) => !siblingData?.current,
      },
    },
    {
      name: 'current',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Currently in this role' },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'skills',
      type: 'relationship',
      relationTo: 'skills',
      hasMany: true,
      admin: { description: 'Skills used in this role' },
    },
    {
      name: 'ownershipLevel',
      type: 'select',
      options: [
        { label: 'Contributor', value: 'contributor' },
        { label: 'Lead', value: 'lead' },
        { label: 'Architect', value: 'architect' },
        { label: 'Manager', value: 'manager' },
      ],
    },
    {
      name: 'impactMetrics',
      type: 'array',
      admin: {
        description: 'Quantifiable impact metrics',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'Metric name (e.g. "Page Load Time")' },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'Metric value (e.g. "↓ 40%")' },
        },
        {
          name: 'description',
          type: 'text',
          admin: { description: 'Additional context for the metric' },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show on the home page impact grid' },
        },
        {
          name: 'order',
          type: 'number',
          admin: { description: 'Display order (lower = first)' },
        },
      ],
    },
  ],
}
