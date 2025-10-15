import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil cookie auth_role dari header permintaan
  const role = request.cookies.get('auth_role')?.value || '';

  // Debugging: Tampilkan role di console server

  // Batasi akses: role inventory hanya boleh mengakses Inventaris (dan Home)
  // Middleware ini aktif pada halaman fitur lain, jadi jika role inventory mencoba akses,
  // arahkan kembali ke Home.
  if (role === 'inventory') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Jika user mengakses route admin dan bukan admin, arahkan ke Home
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Middleware aktif untuk halaman fitur selain Inventaris
  matcher: [
    '/admin/:path*',
    '/produksi/:path*',
    '/delivery/:path*',
    '/outlet/:path*',
    '/kasir/:path*',
    '/absensi/:path*'
  ]
};