'use client'

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { headerAction, type NavGroup } from '@/data/navigation'
import { buttonVariants } from '@/components/ui/button'

export function MobileNav({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const pathname = usePathname()
  const panelId = useId()

  // Close the menu on navigation, adjusting state during render rather than in
  // an effect so no extra frame shows the stale open panel.
  const [renderedPath, setRenderedPath] = useState(pathname)
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setOpen(false)
  }

  // Prevent background scrolling while the panel is open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex size-10 items-center justify-center rounded-sm border border-border text-foreground"
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-border bg-surface px-5 pt-4 pb-10"
      >
        <nav aria-label="Main">
          <ul className="flex flex-col">
            {groups.map((group) => {
              const isOpen = expanded === group.label
              return (
                <li key={group.label} className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <Link
                      href={group.href}
                      className="flex-1 py-3.5 font-medium text-foreground"
                    >
                      {group.label}
                    </Link>
                    {group.links.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : group.label)}
                        aria-expanded={isOpen}
                        className="inline-flex size-10 items-center justify-center rounded-sm text-muted-foreground"
                      >
                        <ChevronDown
                          className={cn('size-4 transition-transform duration-200', isOpen && 'rotate-180')}
                          aria-hidden="true"
                        />
                        <span className="sr-only">
                          {isOpen ? `Hide ${group.label} links` : `Show ${group.label} links`}
                        </span>
                      </button>
                    ) : null}
                  </div>
                  {isOpen ? (
                    <ul className="flex flex-col gap-1 pb-3 pl-3">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block py-2 text-sm text-muted-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>

        <Link
          href={headerAction.href}
          className={cn(buttonVariants({ variant: 'primary', size: 'md', block: true }), 'mt-6')}
        >
          {headerAction.label}
        </Link>
      </div>
    </div>
  )
}
