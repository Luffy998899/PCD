import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/env'

/**
 * Request proxy (formerly the `middleware` convention, renamed in Next.js 16).
 *
 * Keeps the Supabase auth session fresh and blocks unauthenticated access to
 * the admin area before a page even renders.
 *
 * This is a first gate, not the authorization boundary: every admin page also
 * calls `requireAdmin()`, and the database policies check the caller's role
 * independently (Rules.md §16).
 */
export default async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })

  if (!isSupabaseConfigured()) {
    // Without Supabase there is no way to authenticate, so the admin area is
    // closed rather than open.
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('unavailable', '1')
      return request.nextUrl.pathname === '/admin/login'
        ? response
        : NextResponse.redirect(url)
    }
    return response
  }

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
