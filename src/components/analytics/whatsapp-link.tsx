'use client'

import { MessageCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

/**
 * WhatsApp affordance with click measurement (PRD §6).
 *
 * WhatsApp is a conversion channel, so clicks are counted. It is always styled
 * as a secondary affordance, never as a competing primary button
 * (Rules.md §5).
 */
export function WhatsAppLink({
  href,
  label = 'Chat on WhatsApp',
  context,
  variant = 'ghost',
  size = 'sm',
  className,
}: {
  href: string
  label?: string
  context?: string
  variant?: 'ghost' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { context })}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      {label}
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  )
}

/** Plain-text variant for the footer, where a button would be too loud. */
export function WhatsAppTextLink({
  href,
  label = 'Chat on WhatsApp',
  className,
}: {
  href: string
  label?: string
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { context: 'footer' })}
      className={className}
    >
      {label}
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </a>
  )
}
