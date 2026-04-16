import type { CollectionConfig } from 'payload'
import { revalidateAfterChange } from '@/lib/revalidate'

export const Recommendations: CollectionConfig = {
  slug: 'recommendations',
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'status', 'createdAt'],
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: () => false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Their job title, e.g. "Senior Engineer at Microsoft"' },
    },
    {
      name: 'relationship',
      type: 'text',
      admin: { description: 'How they know you, e.g. "Worked together on MSAL Android"' },
    },
    {
      name: 'email',
      type: 'email',
      admin: { description: 'Contact email (not displayed publicly)' },
    },
    {
      name: 'phone',
      type: 'text',
      admin: { description: 'Contact phone (not displayed publicly)' },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 1000,
    },
{
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      access: {
        create: () => false,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: () => false,
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
