'use client'

import { useEffect, useSyncExternalStore } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

import { GA4_MEASUREMENT_ID } from '@/lib/env'
import { CONSENT_CHANGE_EVENT, readConsent } from '@/components/layout/cookie-consent'
import { trackEvent, type ConversionEvent } from '@/lib/analytics'

/**
 * Google Analytics 4, loaded only after the visitor accepts analytics cookies
 * (PRD §16).
 *
 * Nothing is requested from Google before consent — the script tag itself is
 * not rendered — so declining leaves no analytics network activity at all.
 */

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

function getSnapshot(): boolean {
  return readConsent() === 'accepted'
}

function getServerSnapshot(): boolean {
  return false
}

export function Analytics() {
  const consented = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const pathname = usePathname()

  // Client-side navigations need an explicit page_view, since the GA snippet
  // only sends one for the initial load.
  useEffect(() => {
    if (!consented || !GA4_MEASUREMENT_ID) return
    window.gtag?.('config', GA4_MEASUREMENT_ID, { page_path: pathname })
  }, [consented, pathname])

  if (!GA4_MEASUREMENT_ID || !consented) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('config', '${GA4_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}

/**
 * Fires a single event when a server-rendered page is displayed — used for
 * page-level conversions such as a product search or a product detail view.
 */
export function TrackView({
  event,
  params,
}: {
  event: ConversionEvent
  params?: Record<string, string | number | undefined>
}) {
  // `params` is a new object on every render, so the effect keys off its
  // serialised form and fires once per page instead of on every render.
  const key = JSON.stringify(params ?? {})

  useEffect(() => {
    trackEvent(event, JSON.parse(key) as Record<string, string | number>)
  }, [event, key])

  return null
}
