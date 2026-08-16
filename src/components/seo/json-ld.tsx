/**
 * Structured data emitter.
 *
 * Schema is only rendered when the underlying content is real (Rules.md §19),
 * so callers pass `null` rather than a partially-filled object.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for `<` so it cannot break out of the
      // script element.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
