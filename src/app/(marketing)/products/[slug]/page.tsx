import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Download, FileText } from 'lucide-react'

import { buildCanonicalUrl, buildMetadata } from '@/lib/seo/metadata'
import { getProductBySlug, getPublishedProductRefs } from '@/lib/content/products'
import { getSiteSettings, displayName } from '@/lib/content/site-settings'
import { withoutPlaceholder } from '@/lib/content/placeholder'
import { MEDICINE_SAFETY_STATEMENT } from '@/lib/constants'
import { whatsappLink } from '@/lib/env'
import { compact, truncate } from '@/lib/utils'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { Card, CardBody, CardTitle, DataList, DataRow } from '@/components/ui/card'
import { LinkButton } from '@/components/ui/button'
import { WhatsAppLink } from '@/components/analytics/whatsapp-link'
import { TrackView } from '@/components/analytics/ga4'
import { ProductGallery } from '@/components/products/product-gallery'
import { EnquiryForm } from '@/components/forms/enquiry-form'
import { JsonLd } from '@/components/seo/json-ld'

type Params = Promise<{ slug: string }>

/** Pre-render published products; new ones are rendered on demand. */
export async function generateStaticParams() {
  const refs = await getPublishedProductRefs()
  return refs.map((ref) => ({ slug: ref.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Product not found', robots: { index: false, follow: false } }
  }

  const description =
    product.seo_description ??
    product.summary ??
    truncate(`${product.brand_name} — ${product.generic_composition}.`, 155)

  return buildMetadata({
    title: product.seo_title ?? `${product.brand_name} — ${product.generic_composition}`,
    description,
    path: `/products/${product.slug}`,
    image: product.images[0]?.image_url ?? null,
  })
}

/** Prescribing sections are rendered only where approved content exists. */
const PRESCRIBING_SECTIONS = [
  { key: 'indications', heading: 'Indications' },
  { key: 'directions', heading: 'Directions for use' },
  { key: 'contraindications', heading: 'Contraindications' },
  { key: 'warnings', heading: 'Warnings and precautions' },
  { key: 'side_effects', heading: 'Side effects' },
  { key: 'storage', heading: 'Storage' },
] as const

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const settings = await getSiteSettings()
  const companyName = withoutPlaceholder(displayName(settings))

  const sections = PRESCRIBING_SECTIONS.filter(({ key }) => Boolean(product[key]))

  const whatsapp = whatsappLink(
    `Hello, I would like information about ${product.brand_name} (${product.generic_composition}).`,
  )

  // Product schema is emitted only when the record is genuinely a product with
  // real identifying data. No offer, price or availability is published — this
  // site is not a storefront (Rules.md §4, §19).
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.brand_name,
    description: product.summary ?? product.generic_composition,
    url: buildCanonicalUrl(`/products/${product.slug}`),
    category: product.therapy?.name,
    ...(product.images.length > 0
      ? { image: product.images.map((image) => image.image_url) }
      : {}),
    ...(companyName ? { brand: { '@type': 'Brand', name: companyName } } : {}),
    ...(product.manufactured_by
      ? { manufacturer: { '@type': 'Organization', name: product.manufactured_by } }
      : {}),
    additionalProperty: compact([
      { '@type': 'PropertyValue', name: 'Composition', value: product.generic_composition },
      product.strength
        ? { '@type': 'PropertyValue', name: 'Strength', value: product.strength }
        : null,
      product.pack_size
        ? { '@type': 'PropertyValue', name: 'Pack size', value: product.pack_size }
        : null,
      product.dosageForm
        ? { '@type': 'PropertyValue', name: 'Dosage form', value: product.dosageForm.name }
        : null,
    ]),
  }

  return (
    <>
      <JsonLd data={productSchema} />
      <TrackView
        event="product_detail_viewed"
        params={{ product: product.brand_name, therapy: product.therapy?.name }}
      />

      <div className="border-b border-border bg-surface">
        <Container className="pt-6 pb-10">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: product.brand_name, href: `/products/${product.slug}` },
            ]}
            className="mb-8"
          />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
            <ProductGallery images={product.images} productName={product.brand_name} />

            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {product.therapy ? (
                  <Link href={`/products/therapy/${product.therapy.slug}`}>
                    <Badge tone="primary">{product.therapy.name}</Badge>
                  </Link>
                ) : null}
                {product.division ? (
                  <Link href={`/products/division/${product.division.slug}`}>
                    <Badge tone="outline">{product.division.name}</Badge>
                  </Link>
                ) : null}
                {product.is_prescription_only ? (
                  <Badge tone="warning">Prescription only</Badge>
                ) : null}
              </div>

              <div>
                <h1 className="text-[2rem] leading-tight sm:text-h1">{product.brand_name}</h1>
                <p className="mt-2 text-body-lg text-muted-foreground">
                  {product.generic_composition}
                </p>
              </div>

              {product.summary ? (
                <p className="text-muted-foreground">{product.summary}</p>
              ) : null}

              <DataList className="border-t border-border">
                {product.strength ? <DataRow label="Strength" value={product.strength} /> : null}
                {product.pack_size ? <DataRow label="Pack size" value={product.pack_size} /> : null}
                {product.dosageForm ? (
                  <DataRow label="Dosage form" value={product.dosageForm.name} />
                ) : null}
                {product.therapy ? (
                  <DataRow label="Therapeutic category" value={product.therapy.name} />
                ) : null}
              </DataList>

              <div className="flex flex-wrap items-center gap-3">
                <LinkButton href="#product-enquiry" size="lg">
                  Enquire about this product
                </LinkButton>
                {whatsapp ? (
                  <WhatsAppLink
                    href={whatsapp}
                    context={product.brand_name}
                    size="md"
                  />
                ) : null}
              </div>

              {product.prescribing_information_url ? (
                <a
                  href={product.prescribing_information_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start text-sm text-primary underline-offset-4 hover:underline"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download prescribing information
                  <span className="sr-only">for {product.brand_name} (opens in a new tab)</span>
                </a>
              ) : null}
            </div>
          </div>
        </Container>
      </div>

      {sections.length > 0 ? (
        <Section>
          <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="flex flex-col gap-8">
              {sections.map(({ key, heading }) => (
                <section key={key} id={key} className="flex flex-col gap-2">
                  <h2 className="text-[1.5rem] leading-snug text-foreground">{heading}</h2>
                  <div className="prose-content">
                    {String(product[key])
                      .split(/\n{2,}/)
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </section>
              ))}

              <p className="rounded-md border border-border bg-surface-subtle px-4 py-3 text-sm text-foreground">
                Keep out of reach of children. {MEDICINE_SAFETY_STATEMENT}
              </p>
            </div>

            <aside className="flex flex-col gap-4">
              <Card>
                <CardBody className="flex flex-col gap-3">
                  <CardTitle as="h2" className="text-base">
                    Manufacturing information
                  </CardTitle>
                  <dl className="flex flex-col gap-2 text-sm">
                    {product.manufactured_by ? (
                      <div className="flex flex-col">
                        <dt className="text-muted-foreground">Manufactured by</dt>
                        <dd className="text-foreground">{product.manufactured_by}</dd>
                      </div>
                    ) : null}
                    {product.marketed_by ? (
                      <div className="flex flex-col">
                        <dt className="text-muted-foreground">Marketed by</dt>
                        <dd className="text-foreground">{product.marketed_by}</dd>
                      </div>
                    ) : null}
                    {product.licence_number ? (
                      <div className="flex flex-col">
                        <dt className="text-muted-foreground">Licence number</dt>
                        <dd className="font-mono text-foreground">{product.licence_number}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {!product.manufactured_by &&
                  !product.marketed_by &&
                  !product.licence_number ? (
                    <p className="text-sm text-muted-foreground">
                      Manufacturing details for this product are published once confirmed.
                    </p>
                  ) : null}
                </CardBody>
              </Card>

              {product.documents.length > 0 ? (
                <Card>
                  <CardBody className="flex flex-col gap-3">
                    <CardTitle as="h2" className="text-base">
                      Documents
                    </CardTitle>
                    <ul className="flex flex-col gap-2">
                      {product.documents.map((document) => (
                        <li key={document.id}>
                          <a
                            href={document.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
                          >
                            <FileText className="size-4" aria-hidden="true" />
                            {document.title}
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              ) : null}
            </aside>
          </Container>
        </Section>
      ) : null}

      <Section tone="subtle" id="product-enquiry">
        <Container size="narrow" className="flex flex-col gap-6">
          <SectionHeader
            title={`Enquire about ${product.brand_name}`}
            description="Tell us what you need — availability, pack options, prescribing information or distribution."
          />
          <EnquiryForm
            enquiryType="product"
            fields={['organisation', 'city']}
            context={{
              productReference: `${product.brand_name} (${product.generic_composition})`,
              therapyReference: product.therapy?.name,
              divisionReference: product.division?.name,
              subject: `Product enquiry: ${product.brand_name}`,
            }}
            messageLabel="Your enquiry"
            submitLabel="Send enquiry"
          />
        </Container>
      </Section>
    </>
  )
}
