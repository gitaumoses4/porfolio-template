import type { GlobalConfig } from 'payload'
import { revalidateAfterGlobalChange } from '@/lib/revalidate'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Section',
  hooks: {
    afterChange: [revalidateAfterGlobalChange],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Your Name',
      admin: { description: 'Full name' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Software Engineer',
      admin: { description: 'Title shown above the name' },
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      defaultValue: 'Full-stack developer',
      admin: { description: 'Tagline / title shown below the name' },
    },
    {
      name: 'bio',
      type: 'richText',
      required: true,
      admin: { description: 'Short intro paragraph (used in hero section)' },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      defaultValue: 'Your City',
      admin: { description: 'Current location (shown in about facts sidebar)' },
    },
    {
      name: 'startYear',
      type: 'number',
      required: true,
      defaultValue: 2020,
      admin: { description: 'Year started engineering — used to compute years of experience' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Profile photo' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'How I actually work',
      admin: { description: 'Section heading' },
    },
    {
      name: 'overview',
      type: 'richText',
      required: true,
      admin: { description: '2–3 paragraphs about background & philosophy' },
    },
    {
      name: 'facts',
      type: 'array',
      maxRows: 10,
      admin: { description: 'Optional extra facts appended after auto-generated ones (Location, Experience, Focus, Education)' },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Location", "Experience", "Focus"' },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Nairobi, Kenya", "8+ years"' },
        },
      ],
    },
    {
      name: 'quote',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'textarea',
          admin: { description: 'An inspiring or personal quote' },
        },
        {
          name: 'attribution',
          type: 'text',
          admin: { description: 'Who said it' },
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: "Let's work together",
          admin: { description: 'Contact section heading' },
        },
        {
          name: 'description',
          type: 'text',
          admin: { description: 'Short CTA message below the heading' },
        },
        {
          name: 'email',
          type: 'text',
          required: true,
          admin: { description: 'Contact email address' },
        },
        {
          name: 'socials',
          type: 'array',
          maxRows: 6,
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'GitHub', value: 'github' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Twitter / X', value: 'twitter' },
                { label: 'Stack Overflow', value: 'stackoverflow' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Medium', value: 'medium'},
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { description: 'Full URL to social profile' },
            },
            {
              name: 'label',
              type: 'text',
              admin: { description: 'Optional display text (e.g. "GitHub")' },
            },
          ],
        },
      ],
    },
  ],
}
