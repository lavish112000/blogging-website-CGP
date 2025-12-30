import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    // Exclude Next internals and common static files
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|rss.xml|ads.txt).*)',
  ],
}
