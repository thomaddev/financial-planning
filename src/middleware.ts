import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const locales = ['en', 'th']
const publicPages = ['/login', '/auth', '/oauth-callback']

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'never'
})

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  // const token = request.cookies.get('__Secure-next-auth.session-token') || request.cookies.get('next-auth.session-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isPublicPage = publicPages.some(page => request.nextUrl.pathname.startsWith(page))

  // Handle authentication
  if (!token && !isPublicPage) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isAuthPage) {
    // Redirect to dashboard if authenticated and trying to access auth page
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Handle internationalization
  return intlMiddleware(request)
}

// Apply middleware to specific routes
export const config = {
  // matcher: ["/dashboard/:path*", "/profile/:path*", "/auth/:path*"],
  matcher: [
    // Match all pathnames except for
    // - api (API routes)
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - static files (e.g. favicon.ico, robots.txt)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
