import type { CollectionConfig } from 'payload'
import { revalidateAfterChange } from '@/lib/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'projectType', 'status', 'featured', 'updatedAt'],
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    beforeValidate: [
      ({ data }) => {
        if (data && data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'Auto-generated from title if left empty',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              maxLength: 200,
              admin: {
                description: 'Plain text for cards, meta tags, and OG images (max 200 chars)',
              },
            },
            {
              name: 'projectType',
              type: 'select',
              required: true,
              options: [
                { label: 'Professional', value: 'professional' },
                { label: 'Startup', value: 'startup' },
                { label: 'Open Source', value: 'open-source' },
                { label: 'Personal', value: 'personal' },
                { label: 'Experiment', value: 'experiment' },
              ],
            },
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'live',
              options: [
                { label: 'Live', value: 'live' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'Archived', value: 'archived' },
              ],
            },
            {
              name: 'experienceRole',
              type: 'relationship',
              relationTo: 'roles',
              admin: {
                condition: (_, siblingData) => siblingData?.projectType === 'professional',
                description: 'Role this project was built under',
              },
            },
            {
              name: 'role',
              type: 'select',
              options: [
                { label: 'Solo Developer', value: 'solo-developer' },
                { label: 'Lead Engineer', value: 'lead-engineer' },
                { label: 'Core Contributor', value: 'core-contributor' },
                { label: 'Contributor', value: 'contributor' },
                { label: 'Architect', value: 'architect' },
                { label: 'Tech Lead', value: 'tech-lead' },
              ],
            },
          ],
        },
        {
          label: 'Case Study',
          fields: [
            {
              name: 'overview',
              type: 'richText',
            },
            {
              name: 'problemStatement',
              type: 'textarea',
              admin: {
                description: 'What problem does this project solve?',
              },
            },
            {
              name: 'ownershipAreas',
              type: 'array',
              admin: {
                description: 'Areas of the project you owned or led',
              },
              fields: [
                {
                  name: 'area',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'architectureSummary',
              type: 'richText',
              admin: {
                description: 'High-level architecture overview',
              },
            },
            {
              name: 'technicalDecisions',
              type: 'array',
              admin: {
                description: 'Key technical decisions and their reasoning',
              },
              fields: [
                {
                  name: 'decision',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'reasoning',
                  type: 'textarea',
                },
                {
                  name: 'tradeoffs',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'constraints',
              type: 'array',
              admin: {
                description: 'Notable constraints or challenges',
              },
              fields: [
                {
                  name: 'constraint',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Impact',
          fields: [
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
                  admin: { description: 'Additional context for this metric' },
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
        },
        {
          label: 'Stack & Links',
          fields: [
            {
              name: 'techStack',
              type: 'relationship',
              relationTo: 'skills',
              hasMany: true,
              admin: {
                description: 'Technologies used in this project',
              },
            },
            {
              name: 'links',
              type: 'group',
              fields: [
                {
                  name: 'github',
                  type: 'text',
                  admin: { description: 'GitHub repository URL' },
                },
                {
                  name: 'liveUrl',
                  type: 'text',
                  admin: { description: 'Live/production URL' },
                },
                {
                  name: 'caseStudy',
                  type: 'text',
                  admin: { description: 'External case study URL' },
                },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Primary image for cards and hero sections',
              },
            },
            {
              name: 'media',
              type: 'array',
              fields: [
                {
                  name: 'asset',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'startDate',
              type: 'date',
              admin: {
                date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
              },
            },
            {
              name: 'endDate',
              type: 'date',
              admin: {
                date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Show on the home page' },
            },
            {
              name: 'public',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Visible on the public site' },
            },
            {
              name: 'order',
              type: 'number',
              admin: { description: 'Display order (lower = first)' },
            },
          ],
        },
      ],
    },
  ],
}
