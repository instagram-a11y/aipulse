import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createIntlMiddleware(routing)

export const config = {
  matcher: ['/', '/(en|fa)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
}
