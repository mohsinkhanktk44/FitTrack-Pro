import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = [
  { path: '/dashboard', roles: ['coach', 'athlete'] },
  { path: '/dashboard/coach', roles: ['coach'] },
  { path: '/dashboard/athlete', roles: ['athlete'] },
  // Add more protected routes as needed
];

// Create route matchers for different route types
const isDashboardRoute = createRouteMatcher(['/dashboard', '/dashboard/(.*)']);
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/sso-callback(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // If this is an SSO callback, let Clerk handle it
  if (req.nextUrl.pathname.includes('/sign-in/sso-callback')) {
    return NextResponse.next();
  }
  
  // If the user is signed in and trying to access a protected route
  const { userId } = await auth();
  const { pathname } = req.nextUrl;
  
  // Find if this is a protected route that requires a specific role
  const matchedRoute = protectedRoutes.find(route => 
    pathname === route.path || pathname.startsWith(`${route.path}/`)
  );
  
  // If user isn't signed in and the route is protected
  if (!userId && isDashboardRoute(req)) {
    // Redirect to home page
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // If user is signed in, check if they have the required role for the route
  if (userId && matchedRoute) {
    // Get user role from metadata - need to await auth() again to get session data
    const authData = await auth();
    // Type assertion for metadata
    const metadata = authData.sessionClaims?.metadata as { role?: string } | undefined;
    const userRole = metadata?.role;
    
    // If the route requires a specific role and the user doesn't have it
    if (userRole && !matchedRoute.roles.includes(userRole)) {
      // Redirect to the main dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  // Allow the request to proceed if no redirects are needed
  return NextResponse.next();
});

// Export a config object with the paths we want to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/webhook/clerk (webhook)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/webhook/clerk).*)',
  ],
};