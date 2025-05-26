import { NextRequest, NextResponse } from 'next/server';
import { isTokenExpired } from './lib/auth-utils';

const protectedRoutes = ['/dashboard'];
const authPages = ['/signin', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage && accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (isProtected) {
    if (accessToken && !isTokenExpired(accessToken)) {
      return NextResponse.next();
    }

    if (refreshToken && !isTokenExpired(refreshToken)) {
      const refreshUrl = new URL('/api/auth/refresh', request.url);
      refreshUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(refreshUrl);
    }

    return redirectToSignin(request);
  }

  return NextResponse.next();
}

function redirectToSignin(request: NextRequest) {
  const signinUrl = new URL('/signin', request.url);
  signinUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(signinUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|public).*)'],
};
