/** Site-wide constants. Business facts belong in the database, not here. */

/**
 * Mandatory safety line for medicine-related content (PRD §16, Rules.md §2).
 */
export const MEDICINE_SAFETY_STATEMENT =
  'Consult your physician. Read the label carefully.'

/** Footer variant of the same statement (Design.md §19). */
export const FOOTER_SAFETY_STATEMENT =
  'Products to be used as directed. Read the label carefully. Consult your physician.'

/** Prefix used by every development-only placeholder so it is greppable. */
export const PLACEHOLDER_PREFIX = '[CLIENT TO PROVIDE'

/** Maximum upload size for public-facing file inputs (CVs, complaint files). */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export const ACCEPTED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const

/** Rate limit applied to every public form submission (Rules.md §15). */
export const FORM_RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 } as const
