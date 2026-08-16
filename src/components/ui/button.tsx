import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Shared button styling. `Button` renders a real <button>, `LinkButton` renders
 * a Next.js <Link>. There is deliberately one button component for the whole
 * site (Rules.md §11).
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-dark',
        accent: 'bg-accent text-accent-foreground hover:brightness-95',
        outline:
          'border border-border bg-surface text-foreground hover:border-primary hover:text-primary',
        subtle: 'bg-primary-soft text-primary hover:bg-primary-soft/70',
        ghost: 'text-primary hover:bg-primary-soft',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm',
        md: 'h-11 px-5 text-[0.9375rem]',
        lg: 'h-12 px-6 text-base',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  },
)

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps

export function Button({ className, variant, size, block, type, ...props }: ButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  )
}

export type LinkButtonProps = React.ComponentPropsWithoutRef<typeof Link> & ButtonVariantProps

export function LinkButton({ className, variant, size, block, ...props }: LinkButtonProps) {
  return <Link className={cn(buttonVariants({ variant, size, block }), className)} {...props} />
}

/** External link styled as a button (WhatsApp, document downloads). */
export type ExternalLinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonVariantProps

export function ExternalLinkButton({
  className,
  variant,
  size,
  block,
  rel,
  target,
  ...props
}: ExternalLinkButtonProps) {
  return (
    <a
      className={cn(buttonVariants({ variant, size, block }), className)}
      target={target ?? '_blank'}
      rel={rel ?? 'noopener noreferrer'}
      {...props}
    />
  )
}
