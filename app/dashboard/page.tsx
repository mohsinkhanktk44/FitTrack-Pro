"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AthleteView } from "@/components/dashboard/athlete-view"
import { CoachView } from "@/components/dashboard/coach-view"
import { AdminView } from "@/components/dashboard/admin-view"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { fadeIn, staggerContainer, scaleIn, cardHover, buttonHover } from "@/lib/animations"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { UserButton } from "@clerk/nextjs"

// Mock authentication hook - in a real app, this would connect to your backend
const useAuth = () => {
  const [user, setUser] = useState<{
    name: string
    email: string
    role: "athlete" | "coach" | "admin"
  } | null>(null)

  useEffect(() => {
    // Simulate API call to get user data
    const getUser = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))

      // For demo purposes, we'll use URL parameters to switch roles
      const params = new URLSearchParams(window.location.search)
      const role = (params.get("role") as "athlete" | "coach" | "admin") || "athlete"

      setUser({
        name: "John Doe",
        email: "john@example.com",
        role,
      })
    }

    getUser()
  }, [])

  return { user }
}

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

    // Get user role from metadata
    if (user) {
      const role = user.unsafeMetadata?.role as string | undefined
      setUserRole(role || null)
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

  console.log("user ----->", userRole);
  

  return (
    <div className="min-h-screen">
      {/* Header with user button */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">NotionCoach Dashboard</h1>
            {/* <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {userRole ? `Logged in as ${userRole}` : 'User'}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div> */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Welcome, {user?.firstName || 'User'}!</h2>
          
          {/* Show content based on user role */}
          {userRole === 'coach' ? (
            <div>
              <p className="mb-4">You are logged in as a coach. Here you can manage your athletes and analyze their workouts.</p>
              {/* <Button onClick={() => router.push('/dashboard/coach')}>
                Go to Coach Dashboard
              </Button> */}
            </div>
          ) : userRole === 'athlete' ? (
            <div>
              <p className="mb-4">You are logged in as an athlete. Here you can view and sync your workouts.</p>
              {/* <Button onClick={() => router.push('/dashboard/athlete')}>
                Go to Athlete Dashboard
              </Button> */}
            </div>
          ) : (
            <div>
              <p className="text-yellow-600 mb-4">
                Your role is not set. Please contact support or sign out and sign in again with a specific role.
              </p>
              {/* <div className="flex space-x-4">
                <Button onClick={() => router.push('/')}>
                  Go Home
                </Button>
              </div> */}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
