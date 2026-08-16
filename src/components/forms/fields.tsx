'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Form field primitives. Every field renders a visible label, an explicit
 * required marker and an error that is programmatically associated with the
 * control (Design.md §16, Rules.md §20).
 */

type FieldShellProps = {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
  className?: string
}

function FieldShell({ id, label, required, hint, error, children, className }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="ml-1 text-error" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
        )}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}

const controlClasses =
  'w-full rounded-sm border bg-surface px-3 py-2.5 text-[0.9375rem] text-foreground transition-colors duration-150 placeholder:text-muted-foreground focus-visible:border-primary'

export type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, hint, error, className, id, required, ...props }, ref) {
    const fieldId = id ?? props.name ?? label
    return (
      <FieldShell
        id={fieldId}
        label={label}
        required={required}
        hint={hint}
        error={error}
        className={className}
      >
        <input
          {...props}
          id={fieldId}
          ref={ref}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, hint, error)}
          className={cn(controlClasses, error ? 'border-error' : 'border-border')}
        />
      </FieldShell>
    )
  },
)

export type TextAreaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  hint?: string
  error?: string
}

export const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ label, hint, error, className, id, required, rows, ...props }, ref) {
    const fieldId = id ?? props.name ?? label
    return (
      <FieldShell
        id={fieldId}
        label={label}
        required={required}
        hint={hint}
        error={error}
        className={className}
      >
        <textarea
          {...props}
          id={fieldId}
          ref={ref}
          rows={rows ?? 5}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, hint, error)}
          className={cn(controlClasses, 'resize-y', error ? 'border-error' : 'border-border')}
        />
      </FieldShell>
    )
  },
)

export type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  hint?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    { label, hint, error, className, id, required, options, placeholder, ...props },
    ref,
  ) {
    const fieldId = id ?? props.name ?? label
    return (
      <FieldShell
        id={fieldId}
        label={label}
        required={required}
        hint={hint}
        error={error}
        className={className}
      >
        <select
          {...props}
          id={fieldId}
          ref={ref}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, hint, error)}
          className={cn(controlClasses, error ? 'border-error' : 'border-border')}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldShell>
    )
  },
)

export type CheckboxFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: React.ReactNode
  error?: string
}

export const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField({ label, error, className, id, ...props }, ref) {
    const fieldId = id ?? props.name ?? 'consent'
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <div className="flex items-start gap-2.5">
          <input
            {...props}
            type="checkbox"
            id={fieldId}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className="mt-1 size-4 shrink-0 rounded-[3px] border-border accent-primary"
          />
          <label htmlFor={fieldId} className="text-sm text-muted-foreground">
            {label}
          </label>
        </div>
        {error ? (
          <p id={`${fieldId}-error`} className="text-sm text-error">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

/** Invisible honeypot. Kept out of the tab order and hidden from assistive tech. */
export const HoneypotField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function HoneypotField(props, ref) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="company-website">Do not fill this field</label>
      <input
        {...props}
        ref={ref}
        id="company-website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  )
})
