'use client'

import { useCallback, useSyncExternalStore } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/layout'

/**
 * Cookie consent (PRD §16).
 *
 * Essential cookies are always active. Analytics is opt-in: nothing is loaded
 * until the visitor accepts. The choice is stored locally and can be changed
 * from the footer at any time.
 *
 * The banner reads its state through `useSyncExternalStore` so the stored
 * choice is never rendered on the server — a returning visitor does not see the
 * banner flash before it is dismissed.
 */

export const CONSENT_STORAGE_KEY = 'cookie-consent'
export const CONSENT_CHANGE_EVENT = 'cookie-consent-change'
export const CONSENT_OPEN_EVENT = 'cookie-consent-open'

export type ConsentValue = 'accepted' | 'declined'

type ConsentSnapshot = ConsentValue | 'unset' | 'reopened' | 'hidden'

/** Set when the visitor reopens the banner from the footer. */
let reopened = false

export function readConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  return value === 'accepted' || value === 'declined' ? value : null
}

function subscribe(onChange: () => void): () => void {
  const handleOpen = () => {
    reopened = true
    onChange()
  }
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
  window.addEventListener(CONSENT_OPEN_EVENT, handleOpen)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
    window.removeEventListener(CONSENT_OPEN_EVENT, handleOpen)
    window.removeEventListener('storage', onChange)
  }
}

function getSnapshot(): ConsentSnapshot {
  if (reopened) return 'reopened'
  return readConsent() ?? 'unset'
}

/** Nothing is rendered during SSR: the stored choice is only known client-side. */
function getServerSnapshot(): ConsentSnapshot {
  return 'hidden'
}

export function CookieConsent() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const choose = useCallback((value: ConsentValue) => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
    reopened = false
    window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_CHANGE_EVENT, { detail: value }))
  }, [])

  if (snapshot !== 'unset' && snapshot !== 'reopened') return null

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface shadow-[0_-1px_12px_rgba(15,23,42,0.06)]"
    >
      <Container className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          We use essential cookies to run this website. With your permission we also use analytics
          cookies to understand which pages are useful. Read our{' '}
          <Link href="/privacy-policy" className="text-primary underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="outline" size="sm" onClick={() => choose('declined')}>
            Essential only
          </Button>
          <Button size="sm" onClick={() => choose('accepted')}>
            Accept analytics
          </Button>
        </div>
      </Container>
    </div>
  )
}

/** Footer control that reopens the banner so a choice can be changed. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      Cookie settings
    </button>
  )
}
