"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fadeIn, staggerContainer, buttonHover, cardHover } from "@/lib/animations"

// Mock data for recent activities
const recentActivities = [
  {
    id: "1",
    type: "Run",
    date: "2023-05-09",
    distance: "8.2 km",
    duration: "42:15",
    pace: "5:09 /km",
  },
  {
    id: "2",
    type: "Ride",
    date: "2023-05-07",
    distance: "25.4 km",
    duration: "1:12:30",
    pace: "21.0 km/h",
  },
  {
    id: "3",
    type: "Swim",
    date: "2023-05-05",
    distance: "1.5 km",
    duration: "32:45",
    pace: "2:11 /100m",
  },
  {
    id: "4",
    type: "Run",
    date: "2023-05-03",
    distance: "5.0 km",
    duration: "25:30",
    pace: "5:06 /km",
  },
]

export function AthleteView() {
  const activitiesRef = useRef(null)
  const templateRef = useRef(null)
  const isActivitiesInView = useInView(activitiesRef, { once: true, margin: "-100px" })
  const isTemplateInView = useInView(templateRef, { once: true, margin: "-100px" })

  return (
    <div className="space-y-6 mt-6">
      <motion.div
        ref={activitiesRef}
        initial="hidden"
        animate={isActivitiesInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <motion.div variants={fadeIn}>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your latest workouts from Strava</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Pace</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity, index) => (
                    <TableRow
                      key={activity.id}
                      className="group transition-all duration-300 hover:bg-muted/50"
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.5s ease forwards ${index * 0.1 + 0.2}s`,
                      }}
                    >
                      <TableCell className="font-medium">{activity.type}</TableCell>
                      <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                      <TableCell>{activity.distance}</TableCell>
                      <TableCell>{activity.duration}</TableCell>
                      <TableCell>{activity.pace}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 transition-all duration-300 group-hover:bg-green-100"
                        >
                          Synced
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        ref={templateRef}
        initial="hidden"
        animate={isTemplateInView ? "visible" : "hidden"}
        variants={staggerContainer}
        transition={{ delay: 0.2 }}
      >
        <motion.div variants={cardHover} initial="rest" whileHover="hover" transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <motion.div variants={fadeIn}>
                <CardTitle>Notion Template</CardTitle>
                <CardDescription>Configure your workout tracking template</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.p variants={fadeIn} className="text-sm text-muted-foreground">
                Customize how your workout data is organized in Notion
              </motion.p>
              <motion.div variants={buttonHover} initial="rest" whileHover="hover" whileTap="tap">
                <Button variant="outline">Configure Notion Template</Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
