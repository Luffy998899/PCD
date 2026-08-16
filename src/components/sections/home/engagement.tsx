import Link from 'next/link'

import { getDivisions, getTherapies } from '@/lib/content/products'
import { getArticles } from '@/lib/content/media'
import { getOpenJobOpenings } from '@/lib/content/careers'
import { Container, Section, SectionHeader } from '@/components/ui/layout'
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/card'
import { LinkButton } from '@/components/ui/button'
import { ArticleCard } from '@/components/ui/article-card'

const ARTICLE_BASE_PATHS = {
  blog: '/media/blogs',
  news: '/media/news',
  press_release: '/media/press-releases',
} as const

export async function HomeDivisions() {
  const divisions = await getDivisions()
  if (divisions.length === 0) return null

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <SectionHeader
          eyebrow="Divisions"
          title="How we supply"
          description="Each division serves a different route to market."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {divisions.slice(0, 6).map((division) => (
            <Card key={division.id} interactive className="relative">
              <CardBody className="flex flex-col gap-2">
                <CardTitle as="h3" className="text-base">
                  <Link
                    href={`/divisions/${division.slug}`}
                    className="text-foreground hover:text-primary"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    {division.name}
                  </Link>
                </CardTitle>
                {division.summary ? <CardDescription>{division.summary}</CardDescription> : null}
              </CardBody>
            </Card>
          ))}
        </div>
        <LinkButton href="/divisions" className="self-start">
          View all divisions
        </LinkButton>
      </Container>
    </Section>
  )
}

export async function HomeTherapies() {
  const therapies = await getTherapies()
  if (therapies.length === 0) return null

  return (
    <Section tone="subtle">
      <Container className="flex flex-col gap-8">
        <SectionHeader
          eyebrow="Product range"
          title="Therapeutic areas"
          description="Browse the portfolio by the therapy area you are looking for."
        />
        <ul className="flex flex-wrap gap-2">
          {therapies.map((therapy) => (
            <li key={therapy.id}>
              <Link
                href={`/products/therapy/${therapy.slug}`}
                className="inline-flex rounded-sm border border-border bg-surface px-3.5 py-2 text-sm text-foreground transition-colors duration-200 hover:border-primary hover:text-primary"
              >
                {therapy.name}
              </Link>
            </li>
          ))}
        </ul>
        <LinkButton href="/products" className="self-start">
          Search all products
        </LinkButton>
      </Container>
    </Section>
  )
}

export async function HomeNews() {
  const articles = await getArticles(undefined, 3)
  if (articles.length === 0) return null

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <SectionHeader eyebrow="Media & insights" title="Latest news and articles" />
        <ul className="grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <li key={article.id} className="flex">
              <ArticleCard
                article={article}
                href={`${ARTICLE_BASE_PATHS[article.article_type]}/${article.slug}`}
              />
            </li>
          ))}
        </ul>
        <LinkButton href="/media" className="self-start">
          Read more
        </LinkButton>
      </Container>
    </Section>
  )
}

export async function HomeCareers() {
  const openings = await getOpenJobOpenings()
  if (openings.length === 0) return null

  return (
    <Section tone="subtle">
      <Container className="flex flex-col gap-6">
        <SectionHeader
          eyebrow="Careers"
          title={`${openings.length} open role${openings.length === 1 ? '' : 's'}`}
          description="We hire across manufacturing, quality, supply chain and commercial functions."
        />
        <ul className="flex flex-col gap-2">
          {openings.slice(0, 4).map((opening) => (
            <li key={opening.id}>
              <Link
                href={`/careers/openings/${opening.slug}`}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-sm border border-border bg-surface px-4 py-3 text-sm transition-colors duration-200 hover:border-primary"
              >
                <span className="font-medium text-foreground">{opening.title}</span>
                <span className="text-muted-foreground">
                  {opening.department} · {opening.location}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <LinkButton href="/careers/openings" className="self-start">
          View all openings
        </LinkButton>
      </Container>
    </Section>
  )
}

/**
 * Enquiry strip (Design.md §17).
 *
 * Two equal columns. Business and product/medical enquiries carry the same
 * visual weight — a distributor enquiry is not presented as more important than
 * a patient or prescriber question.
 */
export function HomeEnquiryStrip() {
  return (
    <Section>
      <Container className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardBody className="flex flex-1 flex-col gap-3">
            <CardTitle as="h2">Business and distribution</CardTitle>
            <CardDescription className="flex-1">
              For distribution, PCD franchise, institutional supply and export enquiries from
              firms and organisations.
            </CardDescription>
            <LinkButton href="/contact/business-enquiry" className="self-start">
              Send a business enquiry
            </LinkButton>
          </CardBody>
        </Card>

        <Card className="flex flex-col">
          <CardBody className="flex flex-1 flex-col gap-3">
            <CardTitle as="h2">Product and medical</CardTitle>
            <CardDescription className="flex-1">
              For questions about a product, its composition or its prescribing information, from
              healthcare professionals and the public.
            </CardDescription>
            <LinkButton href="/contact/product-enquiry" className="self-start">
              Send a product enquiry
            </LinkButton>
          </CardBody>
        </Card>
      </Container>
    </Section>
  )
}
