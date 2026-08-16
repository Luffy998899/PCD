import { cache } from 'react'

import { getServerClient } from '@/lib/supabase/server'
import type { ContentBlockRow } from '@/types/database'

export type ContentBlock = ContentBlockRow

/**
 * Published narrative blocks for a page, in display order.
 *
 * Pages render whatever exists and show an honest empty state when nothing
 * does. They never substitute sample copy.
 */
export const getContentBlocks = cache(async (pageKey: string): Promise<ContentBlock[]> => {
  const db = await getServerClient()
  if (!db) return []

  const { data, error } = await db
    .from('content_blocks')
    .select('*')
    .eq('page_key', pageKey)
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (error || !data) return []
  return data
})

/** Single block lookup, for pages built around one piece of copy. */
export async function getContentBlock(
  pageKey: string,
  blockKey: string,
): Promise<ContentBlock | null> {
  const blocks = await getContentBlocks(pageKey)
  return blocks.find((block) => block.block_key === blockKey) ?? null
}
