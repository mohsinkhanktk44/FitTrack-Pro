"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Copy, RefreshCw, X } from "lucide-react"
import { fadeIn, staggerContainer, buttonHover, cardHover } from "@/lib/animations"

// Mock data for athletes
const athletes = [
  {
    id: "1",
    name: "Jane Smith",
    lastSync: "2023-05-09T14:30:00Z",
    stravaConnected: true,
    notionConnected: true,
  },
  {
    id: "2",
    name: "Mike Johnson",
    lastSync: "2023-05-08T10:15:00Z",
    stravaConnected: true,
    notionConnected: false,
  },
  {
    id: "3",
    name: "Sarah Williams",
    lastSync: "2023-05-07T16:45:00Z",
    stravaConnected: true,
    notionConnected: true,
  },
  {
    id: "4",
    name: "David Brown",
    lastSync: null,
    stravaConnected: false,
    notionConnected: false,
  },
]

export function CoachView() {
  const [inviteLink, setInviteLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [syncingAthleteId, setSyncingAthleteId] = useState<string | null>(null)
  const [removingAthleteId, setRemovingAthleteId] = useState<string | null>(null)

  const athletesRef = useRef(null)
  const isAthletesInView = useInView(athletesRef, { once: true, margin: "-100px" })

  const generateInviteLink = () => {
    // In a real app, this would call your backend to generate a unique invite link
    const link = `https://notioncoach.app/invite/${Math.random().toString(36).substring(2, 15)}`
    setInviteLink(link)
    setLinkCopied(false)
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleSync = (athleteId: string) => {
    // In a real app, this would call your backend to trigger a sync for this athlete
    setSyncingAthleteId(athleteId)
    setTimeout(() => {
      setSyncingAthleteId(null)
    }, 2000)
  }

  const handleRemove = (athleteId: string) => {
    // In a real app, this would call your backend to remove this athlete
    setRemovingAthleteId(athleteId)
    setTimeout(() => {
      setRemovingAthleteId(null)
    }, 2000)
  }

  return (
    <div className="space-y-6 mt-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="flex items-center justify-between"
      >
        <motion.h2 variants={fadeIn} className="text-2xl font-bold tracking-tight">
          Your Athletes
        </motion.h2>
        <Dialog>
          <DialogTrigger asChild>
            <motion.div variants={buttonHover} initial="rest" whileHover="hover" whileTap="tap">
              <Button>Generate Invite Link</Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Athlete</DialogTitle>
              <DialogDescription>Generate a unique invite link to share with your athletes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <AnimatePresence mode="wait">
                {inviteLink ? (
                  <motion.div
                    key="link"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2"
                  >
                    <Input value={inviteLink} readOnly />
                    <Button size="icon" variant="outline" onClick={copyInviteLink}>
                      {linkCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.p
                    key="prompt"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-muted-foreground"
                  >
                    Click the button below to generate a unique invite link.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <DialogFooter>
              <Button onClick={generateInviteLink}>{inviteLink ? "Generate New Link" : "Generate Link"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div
        ref={athletesRef}
        initial="hidden"
        animate={isAthletesInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <motion.div variants={fadeIn}>
                <CardTitle>Athletes</CardTitle>
                <CardDescription>Manage your athletes and their data</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Strava</TableHead>
                    <TableHead>Notion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {athletes.map((athlete, index) => (
                    <TableRow
                      key={athlete.id}
                      className="group transition-all duration-300 hover:bg-muted/50"
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.5s ease forwards ${index * 0.1 + 0.2}s`,
                      }}
                    >
                      <TableCell className="font-medium">{athlete.name}</TableCell>
                      <TableCell>{athlete.lastSync ? new Date(athlete.lastSync).toLocaleString() : "Never"}</TableCell>
                      <TableCell>
                        <div className="transition-transform duration-200 hover:scale-105">
                          {athlete.stravaConnected ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 transition-all duration-300 group-hover:bg-green-100"
                            >
                              Connected
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 transition-all duration-300 group-hover:bg-red-100"
                            >
                              Not Connected
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="transition-transform duration-200 hover:scale-105">
                          {athlete.notionConnected ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 transition-all duration-300 group-hover:bg-green-100"
                            >
                              Connected
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 transition-all duration-300 group-hover:bg-red-100"
                            >
                              Not Connected
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSync(athlete.id)}
                              disabled={
                                !athlete.stravaConnected || !athlete.notionConnected || syncingAthleteId === athlete.id
                              }
                            >
                              {syncingAthleteId === athlete.id ? (
                                <svg
                                  className="h-4 w-4 animate-spin"
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
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                              <span className="sr-only">Sync</span>
                            </Button>
                          </div>
                          <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemove(athlete.id)}
                              disabled={removingAthleteId === athlete.id}
                            >
                              {removingAthleteId === athlete.id ? (
                                <svg
                                  className="h-4 w-4 animate-spin"
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
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
