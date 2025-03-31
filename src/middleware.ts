import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  // const token = request.cookies.get('__Secure-next-auth.session-token') || request.cookies.get('next-auth.session-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  if (!token && !isAuthPage) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isAuthPage) {
    // Redirect to dashboard if authenticated and trying to access auth page
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

// Apply middleware to specific routes
export const config = {
  // matcher: ["/dashboard/:path*", "/profile/:path*", "/auth/:path*"],
  matcher: [
    '/',
    '/(th|en)/:path*',
    '/((?!api|_next|_vercel|auth|oauth-callback|login|.*\\..*).*)', // Ensure `auth`, `oauth-callback`, and `login` are excluded
  ],
}
