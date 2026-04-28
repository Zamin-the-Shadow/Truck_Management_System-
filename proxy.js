import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Only protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const tokenCookie = request.cookies.get('token');
    
    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const payload = await verifyToken(tokenCookie.value);
    
    if (!payload) {
      // Invalid token
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Role-based protection check
    const role = payload.role;
    
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (pathname.startsWith('/dashboard/driver') && role !== 'driver') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (pathname.startsWith('/dashboard/company') && role !== 'company') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // If at /dashboard, redirect to specific role dashboard
  if (pathname === '/dashboard') {
    const tokenCookie = request.cookies.get('token');
    if (tokenCookie && tokenCookie.value) {
      const payload = await verifyToken(tokenCookie.value);
      if (payload) {
        return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, request.url));
      }
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If at login or register but already authenticated
  if (pathname === '/login' || pathname === '/register') {
    const tokenCookie = request.cookies.get('token');
    if (tokenCookie && tokenCookie.value) {
      const payload = await verifyToken(tokenCookie.value);
      if (payload) {
        return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard', '/login', '/register'],
};
