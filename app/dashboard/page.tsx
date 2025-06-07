"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import CoachDashboard from "@/components/coach-dashboard"
import { isAdminEmail } from "@/lib/admin"

// Mock authentication hook - in a real app, this would connect to your backend

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // If the user is not signed in and the clerk data is loaded, redirect to home
    if (isLoaded && !isSignedIn) {
      router.push('/')
      return
    }

    // Check if user is admin and redirect to admin page
    if (user) {
      const userEmail = user.emailAddresses[0]?.emailAddress
      if (userEmail && isAdminEmail(userEmail)) {
        router.push('/admin')
        return
      }

      const role = user.unsafeMetadata?.role as string | undefined
      setUserRole(role || null)
    }

    if (isSignedIn && user && !user.unsafeMetadata?.role) {
      console.log('im logged but no role');
      
      router.replace("/set-role");
    }
  }, [isLoaded, isSignedIn, user, router])

  // Render loading state while user data is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  // If user is not logged in, this will show briefly before redirect
  if (!isSignedIn) {
    return null
  }

  // Check if user is admin (will redirect in useEffect)
  const userEmail = user.emailAddresses[0]?.emailAddress
  if (userEmail && isAdminEmail(userEmail)) {
    return null // Will redirect to admin page
  }

  const role = user.unsafeMetadata?.role as string | undefined;

  if (!role) {
    // Still no role, don't render anything (because SelectRole component may be handling it)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div>Loading Role Selection...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Show content based on user role */}
      {userRole === 'coach' ? (
        <CoachDashboard />
      ) : userRole === 'athlete' ? (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Welcome, {user?.firstName || 'User'}!</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400"> </p>
            <CoachDashboard />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Welcome, {user?.firstName || 'User'}!</h2>
          <p className="text-yellow-600 mb-4">
            Your role is not set. Please contact support or sign out and sign in again with a specific role.
          </p>
        </div>
      )}
    </div>
  )
}
