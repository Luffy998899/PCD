'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { getBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/forms/fields'

/**
 * Admin sign-in.
 *
 * Authentication happens against Supabase Auth; authorization is decided on the
 * server afterwards. A successful sign-in here grants nothing on its own — the
 * user still needs an active `admin_users` row (Rules.md §16).
 */
export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    setStatus('submitting')
    setError(null)

    const supabase = getBrowserClient()
    if (!supabase) {
      setError('Sign-in is not available on this deployment.')
      setStatus('idle')
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      // Deliberately generic: the message must not reveal whether the email
      // exists (Rules.md §18).
      setError('Those sign-in details were not recognised.')
      setStatus('idle')
      return
    }

    const next = searchParams.get('next')
    router.replace(next && next.startsWith('/admin') ? next : '/admin')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <TextField label="Email address" name="email" type="email" required autoComplete="email" />
      <TextField
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />
      {error ? (
        <p
          role="alert"
          className="rounded-sm border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={status === 'submitting'} block>
        {status === 'submitting' ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}
