import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Pending } from '@/components/ui/pending'

/**
 * Placeholder wordmark.
 *
 * The mark is a neutral geometric shape, not an invented brand identity. It is
 * replaced by the client's supplied logo (`site_settings.logo_url`) before
 * launch.
 */
export function Logo({
  name,
  tagline,
  className,
  tone = 'default',
}: {
  name: string | null
  tagline?: string | null
  className?: string
  tone?: 'default' | 'inverse'
}) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-3 rounded-sm', className)}
      aria-label={name ? `${name} — home` : 'Home'}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-sm',
          tone === 'inverse' ? 'bg-primary-foreground/10' : 'bg-primary',
        )}
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M12 3.5 5 7v6.2c0 4 3 6.5 7 7.3 4-.8 7-3.3 7-7.3V7l-7-3.5Z"
            stroke={tone === 'inverse' ? '#ffffff' : '#ffffff'}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 9.2v5.6M9.2 12h5.6"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        {name ? (
          <span
            className={cn(
              'truncate font-display text-base font-semibold',
              tone === 'inverse' ? 'text-primary-foreground' : 'text-foreground',
            )}
          >
            {name}
          </span>
        ) : (
          <Pending label="Company name" />
        )}
        {tagline ? (
          <span
            className={cn(
              'truncate text-xs',
              tone === 'inverse' ? 'text-primary-foreground/70' : 'text-muted-foreground',
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
