// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Calendar, Filter, RefreshCw, Search } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // Mock data for activities
// const activities = [
//   {
//     id: "1",
//     type: "Run",
//     date: "2023-05-09",
//     distance: "8.2 km",
//     duration: "42:15",
//     pace: "5:09 /km",
//     elevation: "124 m",
//     heartRate: "156 bpm",
//     status: "synced",
//   },
//   {
//     id: "2",
//     type: "Ride",
//     date: "2023-05-07",
//     distance: "25.4 km",
//     duration: "1:12:30",
//     pace: "21.0 km/h",
//     elevation: "320 m",
//     heartRate: "142 bpm",
//     status: "synced",
//   },
//   {
//     id: "3",
//     type: "Swim",
//     date: "2023-05-05",
//     distance: "1.5 km",
//     duration: "32:45",
//     pace: "2:11 /100m",
//     elevation: "0 m",
//     heartRate: "135 bpm",
//     status: "synced",
//   },
//   {
//     id: "4",
//     type: "Run",
//     date: "2023-05-03",
//     distance: "5.0 km",
//     duration: "25:30",
//     pace: "5:06 /km",
//     elevation: "45 m",
//     heartRate: "162 bpm",
//     status: "synced",
//   },
//   {
//     id: "5",
//     type: "Ride",
//     date: "2023-05-01",
//     distance: "40.2 km",
//     duration: "1:45:20",
//     pace: "22.9 km/h",
//     elevation: "550 m",
//     heartRate: "148 bpm",
//     status: "synced",
//   },
//   {
//     id: "6",
//     type: "Run",
//     date: "2023-04-28",
//     distance: "10.0 km",
//     duration: "52:45",
//     pace: "5:16 /km",
//     elevation: "110 m",
//     heartRate: "158 bpm",
//     status: "synced",
//   },
//   {
//     id: "7",
//     type: "Swim",
//     date: "2023-04-26",
//     distance: "2.0 km",
//     duration: "42:30",
//     pace: "2:07 /100m",
//     elevation: "0 m",
//     heartRate: "130 bpm",
//     status: "synced",
//   },
// ]

// // Mock data for weekly summary
// const weeklySummary = {
//   totalActivities: 3,
//   totalDistance: "34.6 km",
//   totalDuration: "2:40:35",
//   totalElevation: "444 m",
// }

// // Animated counter component
// const AnimatedCounter = ({ value, suffix = "", duration = 2 }) => {
//   const [count, setCount] = useState(0)

//   useEffect(() => {
//     let start = 0
//     const end = Number.parseInt(value)
//     const incrementTime = Math.floor((duration * 1000) / end)

//     if (end === 0) return

//     const timer = setInterval(() => {
//       start += 1
//       setCount(start)
//       if (start >= end) clearInterval(timer)
//     }, incrementTime)

//     return () => clearInterval(timer)
//   }, [value, duration])

//   return (
//     <span>
//       {count}
//       {suffix}
//     </span>
//   )
// }

// export default function ActivitiesPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [activityType, setActivityType] = useState("all")
//   const [isSyncing, setIsSyncing] = useState(false)
//   const [activeTab, setActiveTab] = useState("list")

//   // Filter activities based on search term and activity type
//   const filteredActivities = activities.filter((activity) => {
//     const matchesSearch =
//       activity.type.toLowerCase().includes(searchTerm.toLowerCase()) || activity.date.includes(searchTerm)

//     const matchesType = activityType === "all" || activity.type.toLowerCase() === activityType.toLowerCase()

//     return matchesSearch && matchesType
//   })

//   const handleSync = () => {
//     setIsSyncing(true)
//     setTimeout(() => {
//       setIsSyncing(false)
//     }, 2000)
//   }

//   return (
//     <div className="space-y-6 animate-[fadeIn_0.5s_ease-in-out]">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
//         <Button
//           onClick={handleSync}
//           disabled={isSyncing}
//           className="transition-all duration-300 hover:scale-105 active:scale-95"
//         >
//           {isSyncing ? (
//             <>
//               <svg
//                 className="mr-2 h-4 w-4 animate-spin"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Syncing...
//             </>
//           ) : (
//             <>
//               <RefreshCw className="mr-2 h-4 w-4" />
//               Sync Now
//             </>
//           )}
//         </Button>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         <Card className="transition-all duration-300 hover:shadow-md">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               <AnimatedCounter value={weeklySummary.totalActivities} />
//             </div>
//             <p className="text-xs text-muted-foreground">This week</p>
//           </CardContent>
//         </Card>

//         <Card className="transition-all duration-300 hover:shadow-md">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               <AnimatedCounter value={34} suffix=" km" />
//             </div>
//             <p className="text-xs text-muted-foreground">This week</p>
//           </CardContent>
//         </Card>

//         <Card className="transition-all duration-300 hover:shadow-md">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{weeklySummary.totalDuration}</div>
//             <p className="text-xs text-muted-foreground">This week</p>
//           </CardContent>
//         </Card>

//         <Card className="transition-all duration-300 hover:shadow-md">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Total Elevation</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               <AnimatedCounter value={444} suffix=" m" />
//             </div>
//             <p className="text-xs text-muted-foreground">This week</p>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
//           <TabsList>
//             <TabsTrigger value="list">List</TabsTrigger>
//             <TabsTrigger value="calendar">Calendar</TabsTrigger>
//           </TabsList>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//             <div className="relative w-full sm:w-auto">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search activities..."
//                 className="w-full sm:w-[200px] pl-8"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <Select value={activityType} onValueChange={setActivityType}>
//               <SelectTrigger className="w-full sm:w-[130px]">
//                 <Filter className="mr-2 h-4 w-4" />
//                 <SelectValue placeholder="Filter" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Types</SelectItem>
//                 <SelectItem value="run">Run</SelectItem>
//                 <SelectItem value="ride">Ride</SelectItem>
//                 <SelectItem value="swim">Swim</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <TabsContent value="list" className="space-y-4">
//           <Card className="transition-all duration-300 hover:shadow-md">
//             <CardContent className="p-0 overflow-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Distance</TableHead>
//                     <TableHead>Duration</TableHead>
//                     <TableHead>Pace</TableHead>
//                     <TableHead>Elevation</TableHead>
//                     <TableHead>Heart Rate</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredActivities.map((activity, index) => (
//                     <TableRow
//                       key={activity.id}
//                       className="group"
//                       style={{
//                         animation: `fadeIn 0.5s ease-in-out forwards`,
//                         animationDelay: `${index * 0.1}s`,
//                         opacity: 0,
//                       }}
//                     >
//                       <TableCell>{activity.type}</TableCell>
//                       <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
//                       <TableCell>{activity.distance}</TableCell>
//                       <TableCell>{activity.duration}</TableCell>
//                       <TableCell>{activity.pace}</TableCell>
//                       <TableCell>{activity.elevation}</TableCell>
//                       <TableCell>{activity.heartRate}</TableCell>
//                       <TableCell>
//                         <Badge
//                           variant="outline"
//                           className="bg-green-50 text-green-700 border-green-200 transition-all duration-300 group-hover:bg-green-100"
//                         >
//                           {activity.status === "synced" ? "Synced" : "Pending"}
//                         </Badge>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="calendar" className="space-y-4">
//           <Card className="transition-all duration-300 hover:shadow-md">
//             <CardHeader>
//               <CardTitle>Activity Calendar</CardTitle>
//               <CardDescription>View your activities in calendar format</CardDescription>
//             </CardHeader>
//             <CardContent className="flex items-center justify-center p-6">
//               <div className="text-center space-y-4">
//                 <div className="animate-[spin_10s_linear_infinite]">
//                   <Calendar className="mx-auto h-16 w-16 text-muted-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Calendar view coming soon</p>
//                   <p className="text-xs text-muted-foreground">This feature is under development</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


'use client';

import { useEffect, useState } from 'react';

export default function Activities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('strava_access_token');

    if (!token) {
      console.error('No access token found.');
      return;
    }

    fetch('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setActivities(data);
        setLoading(false);
        console.log('Fetchedactivities:', data);
      })
      .catch((err) => {
        console.error('Error fetching activities:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading activities...</p>;

  return (
    <div>
      <h2>Your Strava Activities</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            {activity.name} - {activity.distance / 1000} km
          </li>
        ))}
      </ul>
    </div>
  );
}
