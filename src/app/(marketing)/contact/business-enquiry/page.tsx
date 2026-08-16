import type { Metadata } from 'next'

import { buildMetadata } from '@/lib/seo/metadata'
import { Container, Section } from '@/components/ui/layout'
import { PageHero } from '@/components/ui/page-hero'
import { EnquiryForm } from '@/components/forms/enquiry-form'
import { Card, CardBody, CardTitle } from '@/components/ui/card'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Business and distribution enquiry',
    description:
      'Enquiry route for distribution, PCD franchise, institutional supply and export partnerships.',
    path: '/contact/business-enquiry',
  })
}

export default function BusinessEnquiryPage() {
  return (
    <>
      <PageHero
        eyebrow="Business enquiry"
        title="Business and distribution enquiry"
        description="For firms and organisations interested in distribution, PCD franchise, institutional supply or export."
        breadcrumbs={[
          { label: 'Contact Us', href: '/contact' },
          { label: 'Business Enquiry', href: '/contact/business-enquiry' },
        ]}
      />

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex flex-col gap-6">
            <EnquiryForm
              enquiryType="business"
              fields={['organisation', 'city', 'state', 'country', 'subject']}
              messageLabel="Tell us about your requirement"
              messageHint="Include the territory you operate in, the product range you are interested in, and your current line of business."
              submitLabel="Send enquiry"
              successMessage="Thank you. Our business team will review your enquiry and get in touch using the contact details you provided."
            />
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardBody className="flex flex-col gap-3">
                <CardTitle as="h2" className="text-base">
                  What happens next
                </CardTitle>
                <ol className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <li>1. We review your enquiry and the territory you have named.</li>
                  <li>2. Our team contacts you to understand your requirement.</li>
                  <li>3. We share the product range and terms relevant to you.</li>
                  <li>4. Documentation and onboarding follow if there is a fit.</li>
                </ol>
                <p className="text-xs text-muted-foreground">
                  Submitting this form does not create a distribution or franchise agreement. Any
                  appointment is made through a separate signed agreement.
                </p>
              </CardBody>
            </Card>
          </aside>
        </Container>
      </Section>
    </>
  )
}
