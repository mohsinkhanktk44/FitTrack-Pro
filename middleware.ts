import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/lib/admin';
import { clerkClient } from '@clerk/nextjs/server';

// Define protected routes and their required roles
const protectedRoutes = [
  { path: '/dashboard', roles: ['coach', 'athlete', 'admin'] },
  { path: '/dashboard/coach', roles: ['coach'] },
  { path: '/dashboard/athlete', roles: ['athlete'] },
  { path: '/admin', roles: ['admin'] },
  // Add more protected routes as needed
];

// Create route matchers for different route types
const isDashboardRoute = createRouteMatcher(['/dashboard', '/dashboard/(.*)']);
const isAdminRoute = createRouteMatcher(['/admin', '/admin/(.*)']);
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
  if (!userId && (isDashboardRoute(req) || isAdminRoute(req))) {
    // Redirect to home page
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // If user is signed in, check roles and admin access
  if (userId && matchedRoute) {
    try {
      // Get user data to check if they're an admin
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const userEmail = user.emailAddresses[0]?.emailAddress;
      
      // Check if user is admin based on email
      const userIsAdmin = userEmail ? isAdminEmail(userEmail) : false;
      
      // Get user role from metadata
      const authData = await auth();
      const metadata = authData.sessionClaims?.metadata as { role?: string } | undefined;
      const userRole = metadata?.role;
      
      // Handle admin routes
      if (isAdminRoute(req)) {
        if (!userIsAdmin) {
          // Non-admin trying to access admin routes
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        return NextResponse.next();
      }
      
      // Handle regular dashboard routes
      if (isDashboardRoute(req)) {
        // If user is admin, only allow access to main dashboard, not coach/athlete specific routes
        if (userIsAdmin) {
          if (pathname.includes('/coach') || pathname.includes('/athlete')) {
            return NextResponse.redirect(new URL('/admin', req.url));
          }
          // Allow access to main dashboard for admins
          if (pathname === '/dashboard') {
            return NextResponse.redirect(new URL('/admin', req.url));
          }
        }
        
        // For non-admin users, check role-based access
        if (userRole && !matchedRoute.roles.includes(userRole)) {
          // If they don't have the required role, redirect to appropriate page
          if (userRole === 'coach') {
            return NextResponse.redirect(new URL('/dashboard/coach', req.url));
          } else if (userRole === 'athlete') {
            return NextResponse.redirect(new URL('/dashboard/athlete', req.url));
          } else {
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }
      }
    } catch (error) {
      console.error('Error in middleware:', error);
      // If there's an error getting user data, redirect to home
      return NextResponse.redirect(new URL('/', req.url));
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