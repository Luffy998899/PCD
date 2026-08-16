'use client'

import { GA4_MEASUREMENT_ID } from '@/lib/env'

/**
 * Conversion measurement (PRD §6).
 *
 * Analytics is internal measurement only — no number produced here is ever
 * shown on the public site. Nothing is sent unless the visitor accepted
 * analytics cookies, which is enforced by only loading GA after consent.
 */

type GtagArgs =
  | ['js', Date]
  | ['config', string, Record<string, unknown>?]
  | ['event', string, Record<string, unknown>?]
  | ['consent', 'default' | 'update', Record<string, string>]

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: GtagArgs) => void
  }
}

export type ConversionEvent =
  | 'enquiry_started'
  | 'enquiry_submitted'
  | 'whatsapp_click'
  | 'product_search'
  | 'product_detail_viewed'
  | 'product_enquiry_started'
  | 'product_enquiry_submitted'
  | 'partner_enquiry_submitted'
  | 'career_application_submitted'
  | 'contact_interaction'

export function trackEvent(
  event: ConversionEvent,
  params: Record<string, string | number | undefined> = {},
): void {
  if (typeof window === 'undefined' || !GA4_MEASUREMENT_ID) return
  if (typeof window.gtag !== 'function') return

  const cleaned: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') cleaned[key] = value
  }

  window.gtag('event', event, cleaned)
}
