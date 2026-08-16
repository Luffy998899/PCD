import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { PublishStatus } from '@/types/database'

/** Shared admin chrome, so every screen looks and behaves the same. */

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-h3 text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

export function AdminPanel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-md border border-border bg-surface', className)} {...props} />
  )
}

export function AdminTable({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[48rem] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  )
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="border-b border-border px-4 py-3 text-left font-semibold text-foreground"
    >
      {children}
    </th>
  )
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn('border-b border-border px-4 py-3 align-top text-muted-foreground', className)}>
      {children}
    </td>
  )
}

const STATUS_TONES: Record<string, 'neutral' | 'accent' | 'warning' | 'primary'> = {
  new: 'warning',
  in_progress: 'primary',
  closed: 'neutral',
  spam: 'neutral',
  draft: 'warning',
  published: 'accent',
  archived: 'neutral',
  shortlisted: 'primary',
  rejected: 'neutral',
  hired: 'accent',
}

/** Status is always shown as a word, never as colour alone (Rules.md §20). */
export function StatusBadge({ status }: { status: PublishStatus | string }) {
  return (
    <Badge tone={STATUS_TONES[status] ?? 'neutral'}>{status.replace(/_/g, ' ')}</Badge>
  )
}

export function AdminEmpty({ message }: { message: string }) {
  return <p className="px-4 py-10 text-center text-sm text-muted-foreground">{message}</p>
}

export function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-primary underline-offset-4 hover:underline">
      {children}
    </Link>
  )
}
