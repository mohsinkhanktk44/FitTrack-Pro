"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="quarter">Last 90 days</SelectItem>
            <SelectItem value="year">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeRange === "week"
                ? "34.6 km"
                : timeRange === "month"
                  ? "142.8 km"
                  : timeRange === "quarter"
                    ? "423.5 km"
                    : "1,845.2 km"}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeRange === "week"
                ? "+12% from last week"
                : timeRange === "month"
                  ? "+8% from last month"
                  : timeRange === "quarter"
                    ? "+15% from last quarter"
                    : "+22% from last year"}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeRange === "week"
                ? "2:40:35"
                : timeRange === "month"
                  ? "12:15:40"
                  : timeRange === "quarter"
                    ? "36:42:15"
                    : "156:30:45"}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeRange === "week"
                ? "+5% from last week"
                : timeRange === "month"
                  ? "+10% from last month"
                  : timeRange === "quarter"
                    ? "+7% from last quarter"
                    : "+18% from last year"}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Pace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeRange === "week"
                ? "5:12 /km"
                : timeRange === "month"
                  ? "5:08 /km"
                  : timeRange === "quarter"
                    ? "5:15 /km"
                    : "5:20 /km"}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeRange === "week"
                ? "-2% from last week"
                : timeRange === "month"
                  ? "-3% from last month"
                  : timeRange === "quarter"
                    ? "-1% from last quarter"
                    : "-4% from last year"}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeRange === "week" ? "3" : timeRange === "month" ? "14" : timeRange === "quarter" ? "42" : "168"}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeRange === "week"
                ? "Same as last week"
                : timeRange === "month"
                  ? "+2 from last month"
                  : timeRange === "quarter"
                    ? "+5 from last quarter"
                    : "+24 from last year"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Distance Over Time</CardTitle>
                <CardDescription>
                  Your total distance covered over{" "}
                  {timeRange === "week"
                    ? "the last 7 days"
                    : timeRange === "month"
                      ? "the last 30 days"
                      : timeRange === "quarter"
                        ? "the last 90 days"
                        : "the last 12 months"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="animate-[pulse_2s_ease-in-out_infinite]">
                    <LineChart className="mx-auto h-16 w-16 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interactive charts coming soon</p>
                    <p className="text-xs text-muted-foreground">This feature is under development</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Activity Distribution</CardTitle>
                  <CardDescription>Breakdown by activity type</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="animate-[pulse_2s_ease-in-out_infinite]">
                      <PieChart className="mx-auto h-16 w-16 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interactive charts coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Weekly Volume</CardTitle>
                  <CardDescription>Distance by week</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="animate-[pulse_2s_ease-in-out_infinite]">
                      <BarChart className="mx-auto h-16 w-16 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interactive charts coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
                <CardDescription>Analysis by activity type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="animate-[pulse_2s_ease-in-out_infinite]">
                    <BarChart className="mx-auto h-16 w-16 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interactive charts coming soon</p>
                    <p className="text-xs text-muted-foreground">This feature is under development</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Running</CardTitle>
                  <CardDescription>Performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Distance</span>
                      <span className="text-sm font-medium">
                        {timeRange === "week" ? "23.2 km" : timeRange === "month" ? "98.5 km" : "285.7 km"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Pace</span>
                      <span className="text-sm font-medium">5:12 /km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Elevation</span>
                      <span className="text-sm font-medium">
                        {timeRange === "week" ? "279 m" : timeRange === "month" ? "1,245 m" : "3,567 m"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Cycling</CardTitle>
                  <CardDescription>Performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Distance</span>
                      <span className="text-sm font-medium">
                        {timeRange === "week" ? "65.6 km" : timeRange === "month" ? "287.3 km" : "845.2 km"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Speed</span>
                      <span className="text-sm font-medium">22.4 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Elevation</span>
                      <span className="text-sm font-medium">
                        {timeRange === "week" ? "870 m" : timeRange === "month" ? "3,560 m" : "10,245 m"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Swimming</CardTitle>
                  <CardDescription>Performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Distance</span>
                      <span className="text-sm font-medium">
                        {timeRange === "week" ? "3.5 km" : timeRange === "month" ? "12.8 km" : "42.5 km"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Pace</span>
                      <span className="text-sm font-medium">2:05 /100m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">SWOLF</span>
                      <span className="text-sm font-medium">
                        {timeRange === "week" ? "42" : timeRange === "month" ? "40" : "38"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
                <CardDescription>Your improvement over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="animate-[pulse_2s_ease-in-out_infinite]">
                    <LineChart className="mx-auto h-16 w-16 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interactive charts coming soon</p>
                    <p className="text-xs text-muted-foreground">This feature is under development</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Personal Records</CardTitle>
                  <CardDescription>Your best performances</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-3">
                      <div className="font-medium">5K Run</div>
                      <div className="mt-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time</span>
                          <span>22:45</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span>Apr 15, 2023</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="font-medium">10K Run</div>
                      <div className="mt-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time</span>
                          <span>48:32</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span>Mar 12, 2023</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="font-medium">Half Marathon</div>
                      <div className="mt-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time</span>
                          <span>1:52:18</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span>Feb 5, 2023</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Training Zones</CardTitle>
                  <CardDescription>Time spent in each zone</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="animate-[pulse_2s_ease-in-out_infinite]">
                      <PieChart className="mx-auto h-16 w-16 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interactive charts coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
