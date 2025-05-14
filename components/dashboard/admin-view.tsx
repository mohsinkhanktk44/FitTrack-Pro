"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { fadeIn, staggerContainer, cardHover } from "@/lib/animations"

// Mock data for admin views
const usersData = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "athlete",
    lastActive: "2023-05-09T14:30:00Z",
  },
  {
    id: "2",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "athlete",
    lastActive: "2023-05-08T10:15:00Z",
  },
  {
    id: "3",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "coach",
    lastActive: "2023-05-07T16:45:00Z",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    role: "athlete",
    lastActive: "2023-05-06T09:20:00Z",
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "coach",
    lastActive: "2023-05-05T11:10:00Z",
  },
]

const subscriptionsData = [
  {
    id: "1",
    user: "Jane Smith",
    plan: "Pro",
    startDate: "2023-01-15",
    endDate: "2023-12-31",
    status: "active",
  },
  {
    id: "2",
    user: "Mike Johnson",
    plan: "Basic",
    startDate: "2023-02-10",
    endDate: "2023-08-10",
    status: "active",
  },
  {
    id: "3",
    user: "Sarah Williams",
    plan: "Pro",
    startDate: "2023-03-05",
    endDate: "2023-09-05",
    status: "active",
  },
  {
    id: "4",
    user: "David Brown",
    plan: "Basic",
    startDate: "2023-01-20",
    endDate: "2023-07-20",
    status: "expiring",
  },
]

const logsData = [
  {
    id: "1",
    user: "Jane Smith",
    timestamp: "2023-05-09T14:30:00Z",
    action: "Sync",
    status: "success",
    details: "Synced 3 activities",
  },
  {
    id: "2",
    user: "Mike Johnson",
    timestamp: "2023-05-08T10:15:00Z",
    action: "Sync",
    status: "failed",
    details: "Notion API error",
  },
  {
    id: "3",
    user: "Sarah Williams",
    timestamp: "2023-05-07T16:45:00Z",
    action: "Sync",
    status: "success",
    details: "Synced 5 activities",
  },
  {
    id: "4",
    user: "David Brown",
    timestamp: "2023-05-06T09:20:00Z",
    action: "Sync",
    status: "failed",
    details: "Strava token expired",
  },
]

// Animated counter component
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0)
  const counterRef = useRef(null)
  const isInView = useInView(counterRef, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = Number.parseInt(value.toString().replace(/,/g, ""))
      const incrementTime = Math.floor((duration * 1000) / end)

      const timer = setInterval(() => {
        start += 1
        setCount(start)
        if (start >= end) clearInterval(timer)
      }, incrementTime)

      return () => clearInterval(timer)
    }
  }, [isInView, value, duration])

  return <span ref={counterRef}>{count}</span>
}

interface AdminViewProps {
  activeTab: "metrics" | "users" | "subscriptions" | "logs"
}

export function AdminView({ activeTab }: AdminViewProps) {
  const contentRef = useRef(null)
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={contentRef}
      initial="hidden"
      animate={isContentInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="space-y-6"
    >
      {activeTab === "metrics" && (
        <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl font-bold"
                >
                  <AnimatedCounter value={127} />
                </motion.div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3, delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl font-bold"
                >
                  <AnimatedCounter value={86} />
                </motion.div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3, delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Syncs</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-2xl font-bold"
                >
                  <AnimatedCounter value={1284} />
                </motion.div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3, delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sync Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-2xl font-bold"
                >
                  <AnimatedCounter value={94.2} />%
                </motion.div>
                <p className="text-xs text-muted-foreground">+1.2% from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {activeTab === "users" && (
        <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <motion.div variants={fadeIn}>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage all users on the platform</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className="group transition-all duration-300 hover:bg-muted/50"
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.5s ease forwards ${index * 0.1 + 0.2}s`,
                      }}
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="transition-transform duration-200 hover:scale-105">
                          <Badge variant="outline">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(user.lastActive).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "subscriptions" && (
        <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <motion.div variants={fadeIn}>
                <CardTitle>Subscriptions</CardTitle>
                <CardDescription>Manage user subscriptions</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionsData.map((subscription, index) => (
                    <TableRow
                      key={subscription.id}
                      className="group transition-all duration-300 hover:bg-muted/50"
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.5s ease forwards ${index * 0.1 + 0.2}s`,
                      }}
                    >
                      <TableCell className="font-medium">{subscription.user}</TableCell>
                      <TableCell>{subscription.plan}</TableCell>
                      <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(subscription.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="transition-transform duration-200 hover:scale-105">
                          <Badge
                            variant="outline"
                            className={
                              subscription.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200 transition-all duration-300 group-hover:bg-green-100"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200 transition-all duration-300 group-hover:bg-yellow-100"
                            }
                          >
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "logs" && (
        <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <motion.div variants={fadeIn}>
                <CardTitle>Sync Logs</CardTitle>
                <CardDescription>History of sync operations</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logsData.map((log, index) => (
                    <TableRow
                      key={log.id}
                      className="group transition-all duration-300 hover:bg-muted/50"
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.5s ease forwards ${index * 0.1 + 0.2}s`,
                      }}
                    >
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <div className="transition-transform duration-200 hover:scale-105">
                          <Badge
                            variant="outline"
                            className={
                              log.status === "success"
                                ? "bg-green-50 text-green-700 border-green-200 transition-all duration-300 group-hover:bg-green-100"
                                : "bg-red-50 text-red-700 border-red-200 transition-all duration-300 group-hover:bg-red-100"
                            }
                          >
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
