import type { CollectionConfig } from 'payload'
import { revalidateAfterChange } from '@/lib/revalidate'

export const Experience: CollectionConfig = {
  slug: 'experience',
  admin: {
    defaultColumns: ['company', 'startDate', 'endDate', 'updatedAt'],
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    beforeChange: [
      async ({ data, req }) => {
        // Compute startDate / endDate from the earliest and latest role dates
        const roleIds = data?.roles
        if (!roleIds?.length) return data

        const ids = roleIds.map((r: unknown) =>
          typeof r === 'object' && r !== null ? (r as { id: string }).id : r,
        )

        const { docs: roles } = await req.payload.find({
          collection: 'roles',
          where: { id: { in: ids } },
          limit: 0,
        })

        if (!roles.length) return data

        let earliest: string | undefined
        let latest: string | undefined
        let hasCurrent = false

        for (const role of roles) {
          if (!earliest || role.startDate < earliest) earliest = role.startDate
          if (role.current) {
            hasCurrent = true
          } else if (role.endDate) {
            if (!latest || role.endDate > latest) latest = role.endDate
          }
        }

        return {
          ...data,
          startDate: earliest ?? null,
          endDate: hasCurrent ? null : (latest ?? null),
        }
      },
    ],
  },
  fields: [
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    {
      name: 'employmentType',
      type: 'select',
      required: true,
      defaultValue: 'full-time',
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Freelance', value: 'freelance' },
        { label: 'Internship', value: 'internship' },
      ],
    },
    {
      name: 'locationType',
      type: 'select',
      required: true,
      defaultValue: 'on-site',
      options: [
        { label: 'On-site', value: 'on-site' },
        { label: 'Remote', value: 'remote' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
      required: true,
      admin: { description: 'Roles held at this company' },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Auto-computed from earliest role start date',
        date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Auto-computed from latest role end date (empty if any role is current)',
        date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
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
          name: 'description',
          type: 'text',
        },
      ],
    }
  ],

}
