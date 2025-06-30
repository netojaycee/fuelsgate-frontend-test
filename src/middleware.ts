import { NextRequest, NextResponse } from 'next/server'
import isAuthenticated from './lib/auth';
import isOnboarded from './lib/onboarding';

const authPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-otp',
  '/reset-password',
  '/role-select',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (!isAuthenticated(request) && (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  } else if (isAuthenticated(request) && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } else if (!isOnboarded(request) && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  } else {
    return NextResponse.rewrite(new URL(request.url));
  }
}

export const config = {
  matcher: ['/:path*'],
}