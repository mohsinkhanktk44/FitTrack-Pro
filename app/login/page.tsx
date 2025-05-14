"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock authentication hook - in a real app, this would connect to your backend
const useAuth = () => {
  const router = useRouter()

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, any login works
    // In a real app, this would validate credentials with your backend
    router.push("/dashboard")
    return true
  }

  const signup = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, any signup works
    // In a real app, this would register the user with your backend
    router.push("/dashboard")
    return true
  }

  const loginWithGoogle = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, Google login always works
    // In a real app, this would redirect to Google OAuth
    router.push("/dashboard")
    return true
  }

  return { login, signup, loginWithGoogle }
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [showCaptcha, setShowCaptcha] = useState(true)

  const auth = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (activeTab === "login") {
        await auth.login(email, password)
      } else {
        await auth.signup(email, password)
      }
    } catch (err) {
      setFailedAttempts((prev) => prev + 1)

      if (failedAttempts >= 2) {
        setShowCaptcha(true)
      }

      setError("Authentication failed. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await auth.loginWithGoogle()
    } catch (err) {
      setError("Google authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4 md:px-6">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Welcome to NotionCoach</h1>
              <p className="text-gray-500 dark:text-gray-400">Connect your Strava workouts to Notion</p>
            </div>

            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="#" className="text-sm font-medium underline underline-offset-4">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {showCaptcha && (
                    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-sm font-medium">Please complete the CAPTCHA</div>
                        <div className="w-full h-[78px] bg-white dark:bg-gray-700 rounded flex items-center justify-center border">
                          <div className="flex items-center space-x-2 px-4">
                            <div className="w-6 h-6 border rounded bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                              <input type="checkbox" className="h-4 w-4" id="captcha-checkbox" />
                            </div>
                            <label htmlFor="captcha-checkbox" className="text-sm">
                              I'm not a robot
                            </label>
                            <div className="ml-4 flex flex-col items-center">
                              <div className="text-xs text-gray-500">reCAPTCHA</div>
                              <div className="text-[10px] text-gray-400">Privacy - Terms</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {showCaptcha && (
                    <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-sm font-medium">Please complete the CAPTCHA</div>
                        <div className="w-full h-[78px] bg-white dark:bg-gray-700 rounded flex items-center justify-center border">
                          <div className="flex items-center space-x-2 px-4">
                            <div className="w-6 h-6 border rounded bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                              <input type="checkbox" className="h-4 w-4" id="captcha-checkbox" />
                            </div>
                            <label htmlFor="captcha-checkbox" className="text-sm">
                              I'm not a robot
                            </label>
                            <div className="ml-4 flex flex-col items-center">
                              <div className="text-xs text-gray-500">reCAPTCHA</div>
                              <div className="text-[10px] text-gray-400">Privacy - Terms</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12 h8 M12 8 v8" />
                </svg>
              )}
              Google
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
