import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/admin/installers', request.url));
  }

  if (token && request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/installers', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
