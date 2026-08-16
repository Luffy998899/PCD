import 'server-only'

/**
 * Minimal transactional mail service.
 *
 * Provider-specific logic is confined to `sendViaResend` (Architecture.md §2).
 * The provider is called over its HTTP API rather than through an SDK so the
 * project does not carry a dependency for one request (Rules.md §10).
 *
 * When no provider is configured, delivery is skipped and the submission is
 * still persisted — enquiries are never silently discarded (Rules.md §15).
 */

export type MailMessage = {
  to: string[]
  subject: string
  text: string
  replyTo?: string
}

export type MailResult = { delivered: boolean; reason?: string }

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

function recipients(): string[] {
  return (process.env.MAIL_ENQUIRY_RECIPIENTS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.MAIL_FROM?.trim())
}

async function sendViaResend(message: MailMessage): Promise<MailResult> {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM!.trim(),
      to: message.to,
      subject: message.subject,
      text: message.text,
      reply_to: message.replyTo,
    }),
  })

  if (!response.ok) {
    // The provider response can contain account details, so it is summarised
    // rather than logged verbatim.
    return { delivered: false, reason: `provider responded ${response.status}` }
  }

  return { delivered: true }
}

export async function sendMail(message: Omit<MailMessage, 'to'>): Promise<MailResult> {
  const to = recipients()
  if (to.length === 0) return { delivered: false, reason: 'no recipients configured' }
  if (!isMailConfigured()) return { delivered: false, reason: 'mail provider not configured' }

  try {
    return await sendViaResend({ ...message, to })
  } catch {
    return { delivered: false, reason: 'provider request failed' }
  }
}
