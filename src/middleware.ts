import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // For /admin routes, we let the client-side Admin Gate handle authentication,
  // or verify the session cookie.
  // Passing through allows direct access to the secure Owner Login Gate on /admin.
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
