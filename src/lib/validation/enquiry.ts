import { z } from 'zod'

import type { EnquiryType } from '@/types/database'

/**
 * Enquiry validation. The same schema runs on the client (React Hook Form) and
 * again on the server (Rules.md §15, Architecture.md §12) — client validation
 * is a convenience, the server copy is the one that counts.
 */

const name = z
  .string()
  .trim()
  .min(2, 'Enter your full name')
  .max(120, 'Name is too long')

const email = z
  .string()
  .trim()
  .min(1, 'Enter your email address')
  .max(180, 'Email address is too long')
  .email('Enter a valid email address')

const phone = z
  .string()
  .trim()
  .min(1, 'Enter your phone number')
  .max(20, 'Phone number is too long')
  .refine((value) => {
    const digits = value.replace(/\D/g, '')
    return digits.length >= 8 && digits.length <= 15
  }, 'Enter a valid phone number, including country code if outside India')

const message = z
  .string()
  .trim()
  .min(10, 'Please describe your requirement in at least 10 characters')
  .max(4000, 'Message is too long')

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined))

/** Attribution context captured with every submission (PRD §6). */
export const attributionSchema = z.object({
  sourcePage: optionalText(500),
  utm: z.record(z.string().max(200)).optional(),
})

/** Anti-spam fields. Both are invisible to a real visitor (Rules.md §15). */
export const antiSpamSchema = z.object({
  /** Honeypot — bots fill it, humans never see it. */
  companyWebsite: z.string().max(0, 'Submission rejected').optional(),
  /** Milliseconds between form render and submit. */
  elapsedMs: z.coerce.number().int().nonnegative().optional(),
})

export const baseEnquirySchema = z
  .object({
    name,
    email,
    phone,
    organisation: optionalText(160),
    city: optionalText(80),
    state: optionalText(80),
    country: optionalText(80),
    subject: optionalText(200),
    message,
    productReference: optionalText(200),
    therapyReference: optionalText(200),
    divisionReference: optionalText(200),
    consent: z.literal(true, {
      errorMap: () => ({ message: 'Please confirm consent before submitting' }),
    }),
  })
  .merge(attributionSchema)
  .merge(antiSpamSchema)

export const enquiryTypeSchema = z.enum([
  'general',
  'business',
  'product',
  'partner',
  'grievance',
  'pharmacovigilance',
]) satisfies z.ZodType<Exclude<EnquiryType, 'career'>>

/** Business and partner enquiries need an organisation and a location. */
export const businessEnquirySchema = baseEnquirySchema.extend({
  organisation: z.string().trim().min(2, 'Enter your firm or organisation name').max(160),
  city: z.string().trim().min(2, 'Enter your city').max(80),
  state: z.string().trim().min(2, 'Enter your state').max(80),
})

export const enquirySubmissionSchema = z.discriminatedUnion('enquiryType', [
  baseEnquirySchema.extend({ enquiryType: z.literal('general') }),
  businessEnquirySchema.extend({ enquiryType: z.literal('business') }),
  businessEnquirySchema.extend({ enquiryType: z.literal('partner') }),
  baseEnquirySchema.extend({ enquiryType: z.literal('product') }),
  baseEnquirySchema.extend({ enquiryType: z.literal('grievance') }),
  baseEnquirySchema.extend({ enquiryType: z.literal('pharmacovigilance') }),
])

export type EnquirySubmission = z.infer<typeof enquirySubmissionSchema>
export type PublicEnquiryType = z.infer<typeof enquiryTypeSchema>

/** Schema for a single form variant, used by the client resolver. */
export function schemaForEnquiryType(type: PublicEnquiryType) {
  switch (type) {
    case 'business':
    case 'partner':
      return businessEnquirySchema.extend({ enquiryType: z.literal(type) })
    default:
      return baseEnquirySchema.extend({ enquiryType: z.literal(type) })
  }
}
