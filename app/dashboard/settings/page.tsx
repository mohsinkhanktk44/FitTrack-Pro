"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("notifications")

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Triathlete and marathon runner",
  })

  const [notifications, setNotifications] = useState({
    syncComplete: true,
    syncFailed: true,
    weeklyReport: true,
    newFeatures: false,
  })

  const [connections, setConnections] = useState({
    strava: true,
    notion: false,
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    }, 1000)
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    })
  }

  const handleConnectionToggle = (service: keyof typeof connections) => {
    if (connections[service]) {
      // If already connected, disconnect
      setConnections({
        ...connections,
        [service]: false,
      })
    } else {
      // If not connected, simulate connection process
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setConnections({
          ...connections,
          [service]: true,
        })
      }, 1000)
    }
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {/* <TabsTrigger value="profile">Profile</TabsTrigger> */}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="profile" className="space-y-4">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>

                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>Profile updated successfully!</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md mt-6">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="transition-all duration-300 hover:scale-105 active:scale-95">Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sync-complete">Sync Complete</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when your Strava activities sync to Notion
                    </p>
                  </div>
                  <Switch
                    id="sync-complete"
                    checked={notifications.syncComplete}
                    onCheckedChange={() => handleNotificationChange("syncComplete")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sync-failed">Sync Failed</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when there's an issue with syncing
                    </p>
                  </div>
                  <Switch
                    id="sync-failed"
                    checked={notifications.syncFailed}
                    onCheckedChange={() => handleNotificationChange("syncFailed")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-report">Weekly Report</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of your training activities
                    </p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={notifications.weeklyReport}
                    onCheckedChange={() => handleNotificationChange("weeklyReport")}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-features">New Features</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and improvements</p>
                  </div>
                  <Switch
                    id="new-features"
                    checked={notifications.newFeatures}
                    onCheckedChange={() => handleNotificationChange("newFeatures")}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="transition-all duration-300 hover:scale-105 active:scale-95">
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>Manage your connections to Strava and Notion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Strava</h3>
                      <p className="text-sm text-muted-foreground">Connect to import your workout data</p>
                    </div>
                    <Button
                      variant={connections.strava ? "destructive" : "default"}
                      onClick={() => handleConnectionToggle("strava")}
                      disabled={loading}
                      className="transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : connections.strava ? (
                        "Disconnect"
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {connections.strava && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-md bg-muted p-4"
                      >
                        <div className="text-sm">
                          <div className="font-medium">Connected as John Doe</div>
                          <div className="text-muted-foreground">Last synced: Today at 10:30 AM</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notion</h3>
                      <p className="text-sm text-muted-foreground">Connect to export your workout data</p>
                    </div>
                    <Button
                      variant={connections.notion ? "destructive" : "default"}
                      onClick={() => handleConnectionToggle("notion")}
                      disabled={loading}
                      className="transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : connections.notion ? (
                        "Disconnect"
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {connections.notion && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-md bg-muted p-4"
                      >
                        <div className="text-sm">
                          <div className="font-medium">Connected to Workout Database</div>
                          <div className="text-muted-foreground">Last synced: Today at 10:30 AM</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
