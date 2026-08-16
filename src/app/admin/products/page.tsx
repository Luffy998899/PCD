import type { Metadata } from 'next'

import { requireAdmin } from '@/lib/auth'
import { getServerClient } from '@/lib/supabase/server'
import {
  AdminEmpty,
  AdminHeader,
  AdminPanel,
  AdminTable,
  StatusBadge,
  Td,
  Th,
} from '@/components/admin/ui'
import { PublishToggle } from '@/components/admin/publish-toggle'

export const metadata: Metadata = { title: 'Products' }

/**
 * Product publication control.
 *
 * Draft products are invisible to the public (enforced by RLS), so this screen
 * is the gate between an entered product and a live one. Publishing is audited.
 */
export default async function AdminProductsPage() {
  await requireAdmin(['content_admin'])

  const db = await getServerClient()
  const { data: products } = db
    ? await db
        .from('products')
        .select('id, brand_name, slug, generic_composition, pack_size, status, updated_at')
        .order('brand_name', { ascending: true })
        .limit(200)
    : { data: null }

  const drafts = products?.filter((product) => product.status !== 'published').length ?? 0

  return (
    <>
      <AdminHeader
        title="Products"
        description={
          products
            ? `${products.length} product${products.length === 1 ? '' : 's'}, ${drafts} not published.`
            : undefined
        }
      />

      <AdminPanel>
        {products && products.length > 0 ? (
          <AdminTable caption="Products and their publication status">
            <thead>
              <tr>
                <Th>Brand</Th>
                <Th>Composition</Th>
                <Th>Pack</Th>
                <Th>Status</Th>
                <Th>Public page</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <Td className="text-foreground">{product.brand_name}</Td>
                  <Td>{product.generic_composition}</Td>
                  <Td>{product.pack_size ?? '—'}</Td>
                  <Td>
                    <StatusBadge status={product.status} />
                  </Td>
                  <Td>
                    {product.status === 'published' ? (
                      <a
                        href={`/products/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        View
                        <span className="sr-only"> {product.brand_name} (opens in a new tab)</span>
                      </a>
                    ) : (
                      '—'
                    )}
                  </Td>
                  <Td>
                    <PublishToggle productId={product.id} status={product.status} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        ) : (
          <AdminEmpty
            message={
              db
                ? 'No products have been entered yet.'
                : 'The database is not configured, so products cannot be listed.'
            }
          />
        )}
      </AdminPanel>
    </>
  )
}
