// frontend/middleware/trans.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['vi','en']

export function translationMiddleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  if (locales.some(loc => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`))) {
    return NextResponse.next()
  }

  const acceptLang = request.headers.get('accept-language') || ''
  const detected = acceptLang.toLowerCase().startsWith('vi') ? 'vi' : 'en'

  const url = request.nextUrl.clone()
  url.pathname = `/${detected}${pathname}`
  url.search = search
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next|static|.*\\..*).*)']
}
