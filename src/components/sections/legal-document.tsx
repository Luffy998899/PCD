import { Fragment } from 'react'

import type { LegalDocument } from '@/data/legal'
import { getSiteSettings } from '@/lib/content/site-settings'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { DevNote, Pending } from '@/components/ui/pending'

const TOKEN_PATTERN = /\{\{(\w+)\}\}/g

/** Human-readable label used by the `[CLIENT TO PROVIDE]` marker. */
const TOKEN_LABELS: Record<string, string> = {
  legal_name: 'Legal company name',
  primary_email: 'Official email address',
  grievance_officer_name: 'Grievance officer name',
  grievance_officer_email: 'Grievance officer email',
  registered_address: 'Registered office address',
  jurisdiction: 'Governing jurisdiction (city for court jurisdiction)',
  retention_careers: 'Job application retention period',
}

type TokenValues = Record<string, string | null>

function renderText(text: string, values: TokenValues) {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  TOKEN_PATTERN.lastIndex = 0
  while ((match = TOKEN_PATTERN.exec(text)) !== null) {
    const token = match[1]!
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))

    const value = values[token] ?? null
    parts.push(
      value ? (
        <Fragment key={`${token}-${match.index}`}>{value}</Fragment>
      ) : (
        <Pending key={`${token}-${match.index}`} label={TOKEN_LABELS[token] ?? token} />
      ),
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

/**
 * Renders a legal document, resolving company-specific tokens from
 * `site_settings`. Unresolved tokens become visible placeholders in
 * development and are omitted in production (Rules.md §1).
 */
export async function LegalDocumentPage({ document }: { document: LegalDocument }) {
  const settings = await getSiteSettings()

  const values: TokenValues = {
    legal_name: settings.legal_name,
    primary_email: settings.primary_email,
    grievance_officer_name: settings.grievance_officer_name,
    grievance_officer_email: settings.grievance_officer_email,
    registered_address: settings.registered_address,
    // Not part of site settings — these are legal facts the client must supply.
    jurisdiction: null,
    retention_careers: null,
  }

  return (
    <>
      <PageHero
        title={document.title}
        description={document.description}
        breadcrumbs={[{ label: document.title, href: `/${document.slug}` }]}
      />

      <Section>
        <Container size="narrow">
          {document.requiresLegalReview ? (
            <DevNote className="mb-8">
              This document describes how the website actually behaves. It must still be reviewed
              and approved by the client&rsquo;s legal adviser before launch.
            </DevNote>
          ) : null}

          <div className="prose-content">
            <p className="text-body-lg text-foreground">{renderText(document.intro, values)}</p>

            {document.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.blocks.map((block, index) =>
                  block.type === 'paragraph' ? (
                    <p key={index}>{renderText(block.text, values)}</p>
                  ) : (
                    <ul key={index}>
                      {block.items.map((item) => (
                        <li key={item}>{renderText(item, values)}</li>
                      ))}
                    </ul>
                  ),
                )}
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
