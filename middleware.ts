import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil cookie auth_role dari header permintaan
  const role = request.cookies.get('auth_role')?.value || '';

  // Debugging: Tampilkan role di console server

  // Jika user mengakses route admin dan bukan admin, arahkan ke /login
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Middleware aktif untuk /admin/*
};