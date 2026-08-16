import { z } from 'zod'

import { antiSpamSchema, attributionSchema } from '@/lib/validation/enquiry'

/**
 * Adverse event and product complaint reporting.
 *
 * Only the fields needed to record and follow up a report are collected. No
 * identifying patient detail is requested beyond an age group and sex, which
 * are the minimum required for a usable safety report (Rules.md §18).
 */
export const pharmacovigilanceSchema = z
  .object({
    reportType: z.enum(['adverse_event', 'product_complaint']),
    reporterName: z.string().trim().min(2, 'Enter your name').max(120),
    reporterEmail: z.string().trim().email('Enter a valid email address').max(180),
    reporterPhone: z
      .string()
      .trim()
      .max(20)
      .refine((value) => {
        const digits = value.replace(/\D/g, '')
        return digits.length >= 8 && digits.length <= 15
      }, 'Enter a valid phone number'),
    reporterCategory: z.enum(['patient', 'physician', 'pharmacist', 'other_hcp', 'other']),
    productName: z.string().trim().max(200).optional(),
    batchNumber: z.string().trim().max(60).optional(),
    expiryDate: z.string().trim().max(20).optional(),
    eventDescription: z
      .string()
      .trim()
      .min(20, 'Please describe what happened in at least 20 characters')
      .max(4000),
    eventStartedOn: z.string().trim().max(40).optional(),
    patientAgeGroup: z.string().trim().max(40).optional(),
    patientSex: z.string().trim().max(20).optional(),
    consent: z.literal(true, {
      errorMap: () => ({ message: 'Please confirm consent before submitting' }),
    }),
  })
  .merge(attributionSchema)
  .merge(antiSpamSchema)

export type PharmacovigilanceSubmission = z.infer<typeof pharmacovigilanceSchema>
