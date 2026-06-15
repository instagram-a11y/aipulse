import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  // Always default to English; don't auto-switch based on the visitor's
  // browser/phone language. Visitors choose Farsi via the language toggle.
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
