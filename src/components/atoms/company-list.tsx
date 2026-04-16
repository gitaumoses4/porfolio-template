'use client'

import Image from 'next/image'
import { cn, slugify, mediaUrl } from '@/lib/utils'
import type { Company, Media } from '@payload-types'
import { Divider } from '@heroui/react'
import { motion } from 'framer-motion'

interface CompanyListProps {
  companies: Company[]
  className?: string
}

export function CompanyList({ companies, className }: CompanyListProps) {
  if (!companies.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className={cn('flex flex-wrap items-center gap-x-6 gap-y-3 relative py-12', className)}
    >
      <Divider className="opacity-10 max-w-2xl absolute top-0" />
      <span className="font-mono text-xs text-default">WORKED WITH</span>
      {companies.map((company) => {
        const logo = typeof company.logo === 'object' ? (company.logo as Media) : null
        const content = logo?.url ? (
          <Image
            src={mediaUrl(logo.url)}
            alt={company.name}
            width={80}
            height={28}
            sizes="80px"
            className="h-7 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
        ) : (
          <span className="text-sm text-default-600 hover:text-foreground transition-colors">
            {company.name}
          </span>
        )

        return (
          <a
            key={company.id}
            href={`/#${slugify(company.name)}`}
          >
            {content}
          </a>
        )
      })}
    </motion.div>
  )
}
