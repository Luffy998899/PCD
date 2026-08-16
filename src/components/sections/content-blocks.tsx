import type { ContentBlock } from '@/lib/content/blocks'
import { EmptyState } from '@/components/ui/empty-state'

/**
 * Renders editable narrative sections for a page.
 *
 * Body text is stored as plain text with blank-line paragraph breaks. It is
 * rendered as text nodes, never as raw HTML, so admin-entered content cannot
 * inject markup (Architecture.md §17).
 */
export function ContentBlocks({
  blocks,
  emptyTitle,
  emptyDescription,
  headingLevel = 'h2',
}: {
  blocks: ContentBlock[]
  emptyTitle: string
  emptyDescription?: string
  headingLevel?: 'h2' | 'h3'
}) {
  if (blocks.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  const Heading = headingLevel

  return (
    <div className="flex flex-col gap-10">
      {blocks.map((block) => (
        <section key={block.id} className="flex flex-col gap-3">
          {block.heading ? (
            <Heading className="text-[1.5rem] leading-snug text-foreground">
              {block.heading}
            </Heading>
          ) : null}
          {block.body
            ? block.body
                .split(/\n{2,}/)
                .map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground">
                    {paragraph}
                  </p>
                ))
            : null}
          {block.source_reference ? (
            <p className="text-xs text-muted-foreground">Source: {block.source_reference}</p>
          ) : null}
        </section>
      ))}
    </div>
  )
}
