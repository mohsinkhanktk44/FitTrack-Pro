"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("personal")

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Triathlete and marathon runner based in San Francisco. Training for my first Ironman.",
    location: "San Francisco, CA",
    website: "johndoe.com",
    gender: "male",
    birthdate: "1990-05-15",
    weight: "75",
    height: "180",
    profileVisibility: "public",
    activityVisibility: "friends",
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

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card className="transition-all duration-300 hover:shadow-md h-fit">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="@user" />
              <AvatarFallback className="text-4xl">JD</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Picture
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="athletic">Athletic Info</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="personal" className="space-y-4">
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileSubmit}>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          rows={4}
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          className="resize-none"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profile.website}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          />
                        </div>
                      </div>

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
              </TabsContent>

              <TabsContent value="athletic" className="space-y-4">
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Athletic Information</CardTitle>
                    <CardDescription>Update your athletic details</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileSubmit}>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={profile.gender}
                            onValueChange={(value) => setProfile({ ...profile, gender: value })}
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthdate">Birth Date</Label>
                          <Input
                            id="birthdate"
                            type="date"
                            value={profile.birthdate}
                            onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={profile.weight}
                            onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={profile.height}
                            onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Primary Sports</Label>
                        <div className="grid gap-2 md:grid-cols-3">
                          <div className="flex items-center space-x-2">
                            <Switch id="running" defaultChecked />
                            <Label htmlFor="running">Running</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="cycling" defaultChecked />
                            <Label htmlFor="cycling">Cycling</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="swimming" defaultChecked />
                            <Label htmlFor="swimming">Swimming</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="triathlon" />
                            <Label htmlFor="triathlon">Triathlon</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="hiking" />
                            <Label htmlFor="hiking">Hiking</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="strength" />
                            <Label htmlFor="strength">Strength</Label>
                          </div>
                        </div>
                      </div>

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
              </TabsContent>

              <TabsContent value="privacy" className="space-y-4">
                <Card className="transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control who can see your profile and activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="profile-visibility">Profile Visibility</Label>
                        <Select
                          value={profile.profileVisibility}
                          onValueChange={(value) => setProfile({ ...profile, profileVisibility: value })}
                        >
                          <SelectTrigger id="profile-visibility">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public - Anyone can view</SelectItem>
                            <SelectItem value="friends">Friends Only - Only connections can view</SelectItem>
                            <SelectItem value="private">Private - Only you can view</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="activity-visibility">Activity Visibility</Label>
                        <Select
                          value={profile.activityVisibility}
                          onValueChange={(value) => setProfile({ ...profile, activityVisibility: value })}
                        >
                          <SelectTrigger id="activity-visibility">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public - Anyone can view</SelectItem>
                            <SelectItem value="friends">Friends Only - Only connections can view</SelectItem>
                            <SelectItem value="private">Private - Only you can view</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Data Sharing</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="share-with-coach" className="text-base">
                              Share with Coach
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Allow your coach to view all your activities
                            </p>
                          </div>
                          <Switch id="share-with-coach" defaultChecked />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="share-location" className="text-base">
                              Share Location Data
                            </Label>
                            <p className="text-sm text-muted-foreground">Include location data in your activities</p>
                          </div>
                          <Switch id="share-location" defaultChecked />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="share-heart-rate" className="text-base">
                              Share Heart Rate Data
                            </Label>
                            <p className="text-sm text-muted-foreground">Include heart rate data in your activities</p>
                          </div>
                          <Switch id="share-heart-rate" defaultChecked />
                        </div>
                      </div>
                    </div>

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>Privacy settings updated successfully!</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleProfileSubmit}
                      disabled={loading}
                      className="transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Privacy Settings"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
