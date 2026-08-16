import { cache } from 'react'

import { getServerClient } from '@/lib/supabase/server'
import type {
  DivisionRow,
  DosageFormRow,
  ProductDocumentRow,
  ProductImageRow,
  ProductRow,
  TherapyRow,
} from '@/types/database'

export type Division = DivisionRow
export type Therapy = TherapyRow
export type DosageForm = DosageFormRow
export type ProductImage = ProductImageRow
export type ProductDocument = ProductDocumentRow

export type TaxonomyRef = { name: string; slug: string } | null

/** A product joined to the names of its taxonomies, ready to render. */
export type Product = ProductRow & {
  therapy: TaxonomyRef
  division: TaxonomyRef
  dosageForm: TaxonomyRef
}

export type ProductDetail = Product & {
  images: ProductImage[]
  documents: ProductDocument[]
}

export const PRODUCTS_PER_PAGE = 24

export const getDivisions = cache(async (): Promise<Division[]> => {
  const db = await getServerClient()
  if (!db) return []
  const { data } = await db
    .from('divisions')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  return data ?? []
})

export const getTherapies = cache(async (): Promise<Therapy[]> => {
  const db = await getServerClient()
  if (!db) return []
  const { data } = await db
    .from('therapies')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  return data ?? []
})

export const getDosageForms = cache(async (): Promise<DosageForm[]> => {
  const db = await getServerClient()
  if (!db) return []
  const { data } = await db
    .from('dosage_forms')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  return data ?? []
})

export const getDivisionBySlug = cache(async (slug: string): Promise<Division | null> => {
  const divisions = await getDivisions()
  return divisions.find((division) => division.slug === slug) ?? null
})

export const getTherapyBySlug = cache(async (slug: string): Promise<Therapy | null> => {
  const therapies = await getTherapies()
  return therapies.find((therapy) => therapy.slug === slug) ?? null
})

export const getDosageFormBySlug = cache(async (slug: string): Promise<DosageForm | null> => {
  const forms = await getDosageForms()
  return forms.find((form) => form.slug === slug) ?? null
})

/**
 * Taxonomies are small, stable lists, so they are fetched once per request and
 * joined in application code. This keeps the product query simple and avoids
 * depending on generated relationship types.
 */
async function taxonomyIndex() {
  const [divisions, therapies, dosageForms] = await Promise.all([
    getDivisions(),
    getTherapies(),
    getDosageForms(),
  ])
  return {
    divisions: new Map(divisions.map((item) => [item.id, item])),
    therapies: new Map(therapies.map((item) => [item.id, item])),
    dosageForms: new Map(dosageForms.map((item) => [item.id, item])),
  }
}

function toRef(entry: { name: string; slug: string } | undefined): TaxonomyRef {
  return entry ? { name: entry.name, slug: entry.slug } : null
}

export type ProductFilters = {
  therapy?: string
  division?: string
  dosageForm?: string
  query?: string
  page?: number
}

export type ProductListResult = {
  products: Product[]
  total: number
  page: number
  pageCount: number
}

/**
 * Filtered, paginated product listing.
 *
 * Filtering and search run in the database and the page is server-rendered, so
 * results are crawlable and every filter combination has a shareable URL.
 */
export async function listProducts(filters: ProductFilters = {}): Promise<ProductListResult> {
  const page = Math.max(1, filters.page ?? 1)
  const db = await getServerClient()
  if (!db) return { products: [], total: 0, page, pageCount: 0 }

  const index = await taxonomyIndex()

  const therapyId = filters.therapy
    ? [...index.therapies.values()].find((item) => item.slug === filters.therapy)?.id
    : undefined
  const divisionId = filters.division
    ? [...index.divisions.values()].find((item) => item.slug === filters.division)?.id
    : undefined
  const dosageFormId = filters.dosageForm
    ? [...index.dosageForms.values()].find((item) => item.slug === filters.dosageForm)?.id
    : undefined

  // A filter that names an unknown slug must return nothing, not everything.
  if (
    (filters.therapy && !therapyId) ||
    (filters.division && !divisionId) ||
    (filters.dosageForm && !dosageFormId)
  ) {
    return { products: [], total: 0, page, pageCount: 0 }
  }

  let query = db
    .from('products')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('brand_name', { ascending: true })

  if (therapyId) query = query.eq('therapy_id', therapyId)
  if (divisionId) query = query.eq('division_id', divisionId)
  if (dosageFormId) query = query.eq('dosage_form_id', dosageFormId)

  const search = filters.query?.trim()
  if (search) {
    // Escape PostgREST's `or` delimiters so a search term cannot alter the
    // filter expression.
    const safe = search.replace(/[,()\\]/g, ' ').slice(0, 80)
    query = query.or(`brand_name.ilike.%${safe}%,generic_composition.ilike.%${safe}%`)
  }

  const from = (page - 1) * PRODUCTS_PER_PAGE
  const { data, count, error } = await query.range(from, from + PRODUCTS_PER_PAGE - 1)

  if (error || !data) return { products: [], total: 0, page, pageCount: 0 }

  const products: Product[] = data.map((row) => ({
    ...row,
    therapy: toRef(row.therapy_id ? index.therapies.get(row.therapy_id) : undefined),
    division: toRef(row.division_id ? index.divisions.get(row.division_id) : undefined),
    dosageForm: toRef(row.dosage_form_id ? index.dosageForms.get(row.dosage_form_id) : undefined),
  }))

  const total = count ?? products.length
  return {
    products,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)),
  }
}

export const getProductBySlug = cache(async (slug: string): Promise<ProductDetail | null> => {
  const db = await getServerClient()
  if (!db) return null

  const { data: product, error } = await db
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !product) return null

  const [{ data: images }, { data: documents }, index] = await Promise.all([
    db
      .from('product_images')
      .select('*')
      .eq('product_id', product.id)
      .order('display_order', { ascending: true }),
    db
      .from('product_documents')
      .select('*')
      .eq('product_id', product.id)
      .eq('status', 'published')
      .order('display_order', { ascending: true }),
    taxonomyIndex(),
  ])

  return {
    ...product,
    therapy: toRef(product.therapy_id ? index.therapies.get(product.therapy_id) : undefined),
    division: toRef(product.division_id ? index.divisions.get(product.division_id) : undefined),
    dosageForm: toRef(
      product.dosage_form_id ? index.dosageForms.get(product.dosage_form_id) : undefined,
    ),
    images: images ?? [],
    documents: documents ?? [],
  }
})

/** Slugs and update times for the XML sitemap. */
export const getPublishedProductRefs = cache(
  async (): Promise<{ slug: string; updated_at: string }[]> => {
    const db = await getServerClient()
    if (!db) return []
    const { data } = await db
      .from('products')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('brand_name', { ascending: true })
    return data ?? []
  },
)

/** Products carrying a published prescribing information document. */
export const getProductsWithPrescribingInformation = cache(async (): Promise<Product[]> => {
  const { products } = await listProducts()
  return products.filter((product) => product.prescribing_information_url)
})
