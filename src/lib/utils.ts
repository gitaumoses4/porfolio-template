import {type ClassValue, clsx} from 'clsx'
import {extendTailwindMerge} from 'tailwind-merge'

const twMerge = extendTailwindMerge({
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/**
 * Strip the server URL prefix from Payload media URLs so Next.js Image
 * treats them as local paths (avoiding the private-IP block in dev).
 */
export function mediaUrl(url: string): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
  if (serverUrl && url.startsWith(serverUrl)) {
    return url.slice(serverUrl.length)
  }
  return url
}

export function formatDateRange(startDate: string, endDate?: string | null): string {
  const fmt = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  const start = fmt(startDate)
  if (!endDate) return `${start} — Present`
  return `${start} — ${fmt(endDate)}`
}

/**
 * Compute a human-friendly duration string from two dates.
 * e.g. "1 yr 6 mos", "3 mos", "2 yrs"
 */
export function computeDuration(startDate: string, endDate?: string | null): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  if (months < 1) months = 1

  const years = Math.floor(months / 12)
  const remaining = months % 12

  if (years === 0) return `${remaining} mos`
  if (remaining === 0) return `${years} yr${years > 1 ? 's' : ''}`
  return `${years} yr${years > 1 ? 's' : ''} ${remaining} mos`
}

interface LexicalNode {
  type: string
  version: number
  [k: string]: unknown
}

interface TextNode extends LexicalNode {
  type: 'text'
  text: string
  format: number
}

interface ParentNode extends LexicalNode {
  children: LexicalNode[]
}

interface LexicalRoot {
  type: string
  children: LexicalNode[]
  direction: ('ltr' | 'rtl') | null
  format: string
  indent: number
  version: number
}

export interface LexicalData {
  root: LexicalRoot
  [k: string]: unknown
}

/**
 * Extract plain text from Lexical JSON.
 */
export function lexicalToPlainText(data: LexicalData | null | undefined): string {
  if (!data?.root?.children) return ''

  function extractText(node: LexicalNode): string {
    if (node.type === 'text') return (node as TextNode).text
    if (node.type === 'linebreak') return '\n'
    const parent = node as ParentNode
    if (!parent.children) return ''
    const inner = parent.children.map(extractText).join('')
    if (node.type === 'paragraph') return inner + '\n'
    if (node.type === 'listitem') return '• ' + inner + '\n'
    return inner
  }

  return data.root.children.map(extractText).join('').trim()
}

