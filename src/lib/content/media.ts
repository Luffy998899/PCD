import { cache } from 'react'

import { getServerClient } from '@/lib/supabase/server'
import type {
  ArticleCategoryRow,
  ArticleRow,
  ArticleType,
  DownloadRow,
  EventRow,
  GalleryItemRow,
} from '@/types/database'

export type ArticleCategory = ArticleCategoryRow
export type GalleryItem = GalleryItemRow
export type Download = DownloadRow
export type CompanyEvent = EventRow

export type Article = ArticleRow & {
  category: { name: string; slug: string } | null
  authorName: string | null
}

/**
 * A published article is one that is marked published *and* whose publish date
 * has passed. Drafts and scheduled posts never reach a public page
 * (Rules.md §22).
 */
function publishedFilter(nowIso: string) {
  return (query: ReturnType<typeof buildBaseQuery>) =>
    query.eq('status', 'published').lte('published_at', nowIso)
}

type ArticleQuery = ReturnType<typeof buildBaseQuery>

function buildBaseQuery(db: NonNullable<Awaited<ReturnType<typeof getServerClient>>>) {
  return db.from('articles').select('*')
}

async function loadArticles(
  type: ArticleType | undefined,
  limit?: number,
): Promise<Article[]> {
  const db = await getServerClient()
  if (!db) return []

  const nowIso = new Date().toISOString()
  let query: ArticleQuery = publishedFilter(nowIso)(buildBaseQuery(db)).order('published_at', {
    ascending: false,
  })

  if (type) query = query.eq('article_type', type)
  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error || !data) return []

  const categories = await getArticleCategories()
  const categoryMap = new Map(categories.map((category) => [category.id, category]))

  return data.map((article) => {
    const category = article.category_id ? categoryMap.get(article.category_id) : undefined
    return {
      ...article,
      category: category ? { name: category.name, slug: category.slug } : null,
      authorName: article.author_name,
    }
  })
}

export const getArticleCategories = cache(async (): Promise<ArticleCategory[]> => {
  const db = await getServerClient()
  if (!db) return []
  const { data } = await db
    .from('article_categories')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  return data ?? []
})

export const getArticles = cache(
  async (type?: ArticleType, limit?: number): Promise<Article[]> => loadArticles(type, limit),
)

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const db = await getServerClient()
  if (!db) return null

  const { data, error } = await db
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle()

  if (error || !data) return null

  const categories = await getArticleCategories()
  const category = data.category_id
    ? categories.find((entry) => entry.id === data.category_id)
    : undefined

  return {
    ...data,
    category: category ? { name: category.name, slug: category.slug } : null,
    authorName: data.author_name,
  }
})

/** Slugs for static generation and the sitemap. */
export const getPublishedArticleRefs = cache(
  async (): Promise<{ slug: string; updated_at: string; article_type: ArticleType }[]> => {
    const articles = await loadArticles(undefined)
    return articles.map((article) => ({
      slug: article.slug,
      updated_at: article.updated_at,
      article_type: article.article_type,
    }))
  },
)

export const getGalleryItems = cache(async (): Promise<GalleryItem[]> => {
  const db = await getServerClient()
  if (!db) return []
  const { data } = await db
    .from('gallery_items')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  return data ?? []
})

export const getDownloads = cache(async (): Promise<Download[]> => {
  const db = await getServerClient()
  if (!db) return []
  const { data } = await db
    .from('downloads')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  return data ?? []
})

export const getEvents = cache(async (): Promise<CompanyEvent[]> => {
  const db = await getServerClient()
  if (!db) return []
  const { data } = await db
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('starts_on', { ascending: false })
  return data ?? []
})
