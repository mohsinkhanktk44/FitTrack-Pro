"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, Check, Copy, ExternalLink, RefreshCw, Shield, Trash2, UserPlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for athletes
const athletes = [
  {
    id: 1,
    name: "John Doe",
    lastSync: "2023-05-15T14:30:00",
    stravaConnected: true,
    notionConnected: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    lastSync: "2023-05-14T09:15:00",
    stravaConnected: true,
    notionConnected: false,
  },
  {
    id: 3,
    name: "Mike Johnson",
    lastSync: "2023-05-13T16:45:00",
    stravaConnected: false,
    notionConnected: true,
  },
  {
    id: 4,
    name: "Sarah Williams",
    lastSync: "2023-05-12T11:20:00",
    stravaConnected: true,
    notionConnected: true,
  },
  {
    id: 5,
    name: "Alex Brown",
    lastSync: "2023-05-11T13:10:00",
    stravaConnected: false,
    notionConnected: false,
  },
]

export default function CoachDashboard() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteLink, setInviteLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const generateInviteLink = () => {
    // In a real app, this would call an API to generate a unique link
    const uniqueCode = Math.random().toString(36).substring(2, 10)
    setInviteLink(`https://yourapp.com/invite/${uniqueCode}`)
    setInviteDialogOpen(true)
    setLinkCopied(false)
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setLinkCopied(true)
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this link with your athlete.",
    })
  }

  const syncAthlete = (athleteId: number) => {
    // In a real app, this would trigger a sync for the specific athlete
    toast({
      title: "Sync initiated",
      description: `Syncing data for athlete #${athleteId}...`,
    })
  }

  const removeAthlete = (athleteId: number) => {
    // In a real app, this would remove the athlete after confirmation
    toast({
      title: "Athlete removed",
      description: `Athlete #${athleteId} has been removed from your list.`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Coach Dashboard</h1>
          <Button onClick={generateInviteLink}>
            <UserPlus className="mr-2 h-4 w-4" />
            Generate Invite Link
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Connection Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Connection Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path
                      d="M12 6.5C12 6.5 14.5 9.5 14.5 12C14.5 14.5 12 17.5 12 17.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8.5 4C8.5 4 4 9 4 12C4 15 8.5 20 8.5 20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Strava
                </span>
                <Badge variant={true ? "default" : "destructive"} className="px-2 py-1">
                  {true ? (
                    <span className="flex items-center">
                      <Check className="mr-1 h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <X className="mr-1 h-3 w-3" /> Not Connected
                    </span>
                  )}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Notion
                </span>
                <Badge variant={false ? "default" : "destructive"} className="px-2 py-1">
                  {false ? (
                    <span className="flex items-center">
                      <Check className="mr-1 h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <X className="mr-1 h-3 w-3" /> Not Connected
                    </span>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Last Sync Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Last Sync</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Time:</span>
                <span className="font-medium">May 15, 2023 2:30 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <Badge variant="default" className="px-2 py-1">
                  <Check className="mr-1 h-3 w-3" /> Success
                </Badge>
              </div>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Plan:</span>
                <Badge className="px-2 py-1 bg-primary">Pro</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Expires:</span>
                <span className="font-medium">Dec 31, 2023</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Extend
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Change Plan
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert - Only show if there's an error */}
        <Alert variant="destructive">
          <AlertTitle>Sync Failed</AlertTitle>
          <AlertDescription>There was an error syncing with Strava. Please reconnect your account.</AlertDescription>
        </Alert>

        {/* Athletes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Athletes</CardTitle>
            <CardDescription>Manage your athletes and their connections.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                      <span>Athlete Name</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                      <span>Last Sync</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Strava</TableHead>
                  <TableHead>Notion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {athletes.map((athlete) => (
                  <TableRow key={athlete.id}>
                    <TableCell className="font-medium">{athlete.name}</TableCell>
                    <TableCell>{formatDate(athlete.lastSync)}</TableCell>
                    <TableCell>
                      {athlete.stravaConnected ? (
                        <Badge  className="px-2 py-1">
                          <Check className="mr-1 h-3 w-3" /> Connected
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="px-2 py-1">
                          <X className="mr-1 h-3 w-3" /> Not Connected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {athlete.notionConnected ? (
                        <Badge  className="px-2 py-1">
                          <Check className="mr-1 h-3 w-3" /> Connected
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="px-2 py-1">
                          <X className="mr-1 h-3 w-3" /> Not Connected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => syncAthlete(athlete.id)}>
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">Sync</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => removeAthlete(athlete.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">Remove</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <Shield className="mr-1 h-4 w-4" />
              Privacy & Terms
            </Link>
            <Link
              href="/how-it-works"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="mr-1 h-4 w-4" />
              How It Works
            </Link>
          </div>
        </div>
      </main>

      {/* Invite Link Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Athlete</DialogTitle>
            <DialogDescription>
              Share this unique link with your athlete to connect them to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <div className="flex items-center border rounded-md p-2">
                <span className="text-sm truncate flex-1">{inviteLink}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copyInviteLink}
              className={linkCopied ? "text-green-500" : ""}
            >
              {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setInviteDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
