import { z } from 'zod'

import { ACCEPTED_DOCUMENT_MIME_TYPES, MAX_UPLOAD_BYTES } from '@/lib/constants'

/**
 * Job application validation.
 *
 * The CV is validated on the server by MIME type, extension *and* size before
 * it is uploaded anywhere. A browser-supplied content type alone is not
 * trusted (Rules.md §17).
 */

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'] as const

export const applicationSchema = z.object({
  jobOpeningId: z.string().uuid().optional(),
  appliedFor: z.string().trim().min(2, 'Tell us which role you are applying for').max(160),
  name: z.string().trim().min(2, 'Enter your full name').max(120),
  email: z.string().trim().email('Enter a valid email address').max(180),
  phone: z
    .string()
    .trim()
    .max(20)
    .refine((value) => {
      const digits = value.replace(/\D/g, '')
      return digits.length >= 8 && digits.length <= 15
    }, 'Enter a valid phone number'),
  currentLocation: z.string().trim().max(120).optional(),
  experienceYears: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => {
      if (value === undefined || value === '') return undefined
      const parsed = typeof value === 'number' ? value : Number.parseFloat(value)
      return Number.isFinite(parsed) ? parsed : undefined
    })
    .refine(
      (value) => value === undefined || (value >= 0 && value <= 60),
      'Enter your experience in years',
    ),
  currentEmployer: z.string().trim().max(160).optional(),
  noticePeriod: z.string().trim().max(60).optional(),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please confirm consent before submitting' }),
  }),
  sourcePage: z.string().trim().max(500).optional(),
  companyWebsite: z.string().max(0, 'Submission rejected').optional(),
})

export type ApplicationSubmission = z.infer<typeof applicationSchema>

export type CvValidationResult =
  | { ok: true; extension: string }
  | { ok: false; error: string }

export function validateCv(file: File | null): CvValidationResult {
  if (!file || file.size === 0) {
    return { ok: false, error: 'Attach your CV as a PDF or Word document' }
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: 'Your CV must be 5 MB or smaller' }
  }

  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXTENSIONS.includes(extension as (typeof ALLOWED_EXTENSIONS)[number])) {
    return { ok: false, error: 'Your CV must be a PDF, DOC or DOCX file' }
  }

  if (!ACCEPTED_DOCUMENT_MIME_TYPES.includes(file.type as (typeof ACCEPTED_DOCUMENT_MIME_TYPES)[number])) {
    return { ok: false, error: 'Your CV must be a PDF, DOC or DOCX file' }
  }

  return { ok: true, extension }
}
