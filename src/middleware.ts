import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /app/* routes
  if (pathname.startsWith('/app')) {
    // Check for token in cookies (set after login) or allow through
    // Since we use localStorage, we can't read it in middleware
    // Instead, client-side redirect is handled in AppLayout
    // Middleware protects against direct navigation if cookie is set
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      // Redirect to login, but don't block (client-side auth handles it too)
      // For SSR protection, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users away from /login
  if (pathname === '/login') {
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/app/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login'],
};
