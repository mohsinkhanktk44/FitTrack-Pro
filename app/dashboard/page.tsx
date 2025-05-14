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

export default function DashboardPage() {
  const { user } = useAuth()
  const [stravaConnected, setStravaConnected] = useState(true)
  const [notionConnected, setNotionConnected] = useState(false)
  const [lastSync, setLastSync] = useState<{
    timestamp: string
    success: boolean
    message?: string
  }>({
    timestamp: "2023-05-10T14:30:00Z",
    success: true,
  })

  const [subscription, setSubscription] = useState({
    plan: "Pro",
    validUntil: "2023-12-31",
  })

  const [isSyncing, setIsSyncing] = useState(false)
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  const handleSync = () => {
    // In a real app, this would call your backend to trigger a sync
    setIsSyncing(true)

    setTimeout(() => {
      setLastSync({
        timestamp: new Date().toISOString(),
        success: Math.random() > 0.3, // Randomly succeed or fail for demo
        message: Math.random() > 0.3 ? undefined : "Failed to sync with Notion",
      })
      setIsSyncing(false)
    }, 2000)
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div ref={headerRef} variants={fadeIn} className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {user?.role === "athlete" && (
          <motion.div variants={buttonHover} initial="rest" whileHover="hover" whileTap="tap">
            <Button onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Syncing...
                </>
              ) : (
                "Sync Now"
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Connection Status */}
        <motion.div variants={scaleIn}>
          <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Connections</CardTitle>
                <CardDescription>Your integration status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center justify-between"
                >
                  <span>Strava</span>
                  {stravaConnected ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <span>Notion</span>
                  {notionConnected ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  ) : (
                    <motion.div variants={buttonHover} initial="rest" whileHover="hover" whileTap="tap">
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Last Sync */}
        <motion.div variants={scaleIn} transition={{ delay: 0.1 }}>
          <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Last Sync</CardTitle>
                <CardDescription>{new Date(lastSync.timestamp).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {lastSync.success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center text-green-600"
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      <span>Sync completed successfully</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Sync Failed</AlertTitle>
                        <AlertDescription>{lastSync.message || "An error occurred during sync"}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Subscription */}
        <motion.div variants={scaleIn} transition={{ delay: 0.2 }}>
          <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Your current plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center justify-between"
                >
                  <span>Plan</span>
                  <Badge>{subscription.plan}</Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <span>Valid Until</span>
                  <span>{new Date(subscription.validUntil).toLocaleDateString()}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex gap-2"
                >
                  <motion.div variants={buttonHover} initial="rest" whileHover="hover" whileTap="tap">
                    <Button variant="outline" size="sm">
                      Extend
                    </Button>
                  </motion.div>
                  <motion.div variants={buttonHover} initial="rest" whileHover="hover" whileTap="tap">
                    <Button variant="outline" size="sm">
                      Change Plan
                    </Button>
                  </motion.div>
                  <motion.div variants={buttonHover} initial="rest" whileHover="hover" whileTap="tap">
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Role-specific content */}
      <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
        {user?.role === "athlete" && <AthleteView />}
        {user?.role === "coach" && <CoachView />}
        {user?.role === "admin" && (
          <Tabs defaultValue="metrics" className="mt-6">
            <TabsList>
              <TabsTrigger value="metrics">Metrics & Stats</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="logs">Sync Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="metrics">
              <AdminView activeTab="metrics" />
            </TabsContent>
            <TabsContent value="users">
              <AdminView activeTab="users" />
            </TabsContent>
            <TabsContent value="subscriptions">
              <AdminView activeTab="subscriptions" />
            </TabsContent>
            <TabsContent value="logs">
              <AdminView activeTab="logs" />
            </TabsContent>
          </Tabs>
        )}
      </motion.div>
    </motion.div>
  )
}
