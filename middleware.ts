import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
    const token = req.cookies.get('admin_token')
    if (!token || token.value !== 'authenticated') {
      // Strip any trailing slashes to form a clean URL
      const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
      const loginUrl = new URL(cleanPath + '/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/', '/(en|fa)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
