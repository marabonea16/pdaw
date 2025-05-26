// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('MIDDLEWARE RUNNING:', request.nextUrl.pathname)
  
  // Block dashboard completely for testing
  if (request.nextUrl.pathname === '/dashboard') {
    console.log('REDIRECTING FROM DASHBOARD')
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}

// Try the simplest possible matcher
export const config = {
  matcher: '/dashboard'
}