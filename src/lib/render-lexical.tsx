import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

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

interface ParagraphNode extends LexicalNode {
  type: 'paragraph'
  children: LexicalNode[]
}

interface LinebreakNode extends LexicalNode {
  type: 'linebreak'
}

interface RootNode {
  type: string
  children: LexicalNode[]
  direction: ('ltr' | 'rtl') | null
  format: string
  indent: number
  version: number
}

// Lexical format bitmask flags
const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_UNDERLINE = 1 << 3

function renderText(node: TextNode, key: number): ReactNode {
  let content: ReactNode = node.text
  const fmt = node.format ?? 0

  if (fmt & IS_BOLD) content = <strong key={`b-${key}`}>{content}</strong>
  if (fmt & IS_ITALIC) content = <em key={`i-${key}`}>{content}</em>
  if (fmt & IS_UNDERLINE) content = <u key={`u-${key}`}>{content}</u>

  return <span key={key}>{content}</span>
}

function renderNode(node: LexicalNode, key: number): ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node as TextNode, key)
    case 'linebreak':
      return <br key={key} />
    case 'paragraph': {
      const para = node as ParagraphNode
      return (
        <p key={key}>
          {para.children?.map((child, i) => renderNode(child, i))}
        </p>
      )
    }
    case 'list': {
      const list = node as ParagraphNode // same shape: children[]
      const tag = (node as LexicalNode & { listType?: string }).listType === 'number' ? 'ol' : 'ul'
      const Tag = tag
      return (
        <Tag key={key}>
          {list.children?.map((child, i) => renderNode(child, i))}
        </Tag>
      )
    }
    case 'listitem': {
      const li = node as ParagraphNode
      return (
        <li key={key}>
          {li.children?.map((child, i) => renderNode(child, i))}
        </li>
      )
    }
    default:
      return null
  }
}

interface RenderLexicalProps {
  data: { root: RootNode; [k: string]: unknown } | null | undefined
  className?: string
}

export function RenderLexical({ data, className }: RenderLexicalProps) {
  if (!data?.root?.children) return null

  return (
    <div className={cn(className)}>
      {data.root.children.map((node, i) => renderNode(node, i))}
    </div>
  )
}
