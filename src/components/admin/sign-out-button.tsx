'use client'

import { useRouter } from 'next/navigation'

import { getBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function SignOutButton() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await getBrowserClient()?.auth.signOut()
        router.replace('/admin/login')
        router.refresh()
      }}
    >
      Sign out
    </Button>
  )
}
