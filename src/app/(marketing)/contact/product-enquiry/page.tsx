import type { Metadata } from 'next'
import Link from 'next/link'

import { buildMetadata } from '@/lib/seo/metadata'
import { MEDICINE_SAFETY_STATEMENT } from '@/lib/constants'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { EnquiryForm } from '@/components/forms/enquiry-form'
import { Card, CardBody, CardTitle } from '@/components/ui/card'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Product and medical enquiry',
    description:
      'Enquiry route for questions about a product, its composition or its prescribing information.',
    path: '/contact/product-enquiry',
  })
}

export default function ProductEnquiryPage() {
  return (
    <>
      <PageHero
        eyebrow="Product enquiry"
        title="Product and medical enquiry"
        description="For healthcare professionals and members of the public with a question about one of our products."
        breadcrumbs={[
          { label: 'Contact Us', href: '/contact' },
          { label: 'Product Enquiry', href: '/contact/product-enquiry' },
        ]}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col gap-6">
            <EnquiryForm
              enquiryType="product"
              fields={['organisation', 'city', 'subject']}
              messageLabel="Your question"
              messageHint="Name the product and pack if you can. Do not include personal medical details in this form."
              submitLabel="Send enquiry"
              successMessage="Thank you. Our product information team will respond to the contact details you provided."
            />
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardBody className="flex flex-col gap-3">
                <CardTitle as="h2" className="text-base">
                  Before you write
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  This route answers questions about our products. It is not a medical advice
                  service and we cannot recommend a treatment for you.
                </p>
                <p className="text-sm font-medium text-foreground">{MEDICINE_SAFETY_STATEMENT}</p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex flex-col gap-3">
                <CardTitle as="h2" className="text-base">
                  Experienced a side effect?
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Side effects and suspected quality defects go to the pharmacovigilance team, not
                  to this form.
                </p>
                <Link
                  href="/science-quality/pharmacovigilance"
                  className="text-sm text-primary underline underline-offset-4"
                >
                  Report a side effect
                </Link>
              </CardBody>
            </Card>
          </aside>
        </Container>
      </Section>
    </>
  )
}
