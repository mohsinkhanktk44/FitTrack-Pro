"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"

// Mock data for calendar events
const events = [
  {
    id: "1",
    title: "Morning Run",
    date: new Date(2023, 4, 9),
    type: "Run",
    distance: "8.2 km",
    duration: "42:15",
  },
  {
    id: "2",
    title: "Cycling Session",
    date: new Date(2023, 4, 7),
    type: "Ride",
    distance: "25.4 km",
    duration: "1:12:30",
  },
  {
    id: "3",
    title: "Swim Training",
    date: new Date(2023, 4, 5),
    type: "Swim",
    distance: "1.5 km",
    duration: "32:45",
  },
  {
    id: "4",
    title: "Recovery Run",
    date: new Date(2023, 4, 3),
    type: "Run",
    distance: "5.0 km",
    duration: "25:30",
  },
  {
    id: "5",
    title: "Long Ride",
    date: new Date(2023, 4, 1),
    type: "Ride",
    distance: "40.2 km",
    duration: "1:45:20",
  },
]

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [month, setMonth] = useState<Date>(new Date())

  // Get events for the selected date
  const selectedDateEvents = events.filter((event) => date && event.date.toDateString() === date.toDateString())

  // Get upcoming events (next 7 days)
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  const upcomingEvents = events
    .filter((event) => event.date >= today && event.date <= nextWeek)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const handlePreviousMonth = () => {
    const prevMonth = new Date(month)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setMonth(prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(month)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setMonth(nextMonth)
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-in-out]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Training Calendar</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                  className="transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="text-center py-2 font-medium border-b">
                {month.toLocaleString("default", { month: "long" })} {month.getFullYear()}
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={month}
                onMonthChange={setMonth}
                className="rounded-md"
                components={{
                  DayContent: (props) => {
                    const date = props.date
                    const hasEvent = events.some((event) => event.date.toDateString() === date.toDateString())

                    return (
                      <div className="relative h-9 w-9 p-0 flex items-center justify-center">
                        <span>{props.date.getDate()}</span>
                        {hasEvent && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                        )}
                      </div>
                    )
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Selected Day</CardTitle>
              <CardDescription>
                {date ? date.toLocaleDateString("en-US", { dateStyle: "full" }) : "No date selected"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="rounded-lg border p-3 transition-all duration-300 hover:shadow-md"
                      style={{
                        animation: `fadeIn 0.5s ease-in-out forwards`,
                        animationDelay: `${index * 0.1}s`,
                        opacity: 0,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{event.title}</div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <div>Distance: {event.distance}</div>
                        <div>Duration: {event.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <CalendarIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No activities for this day</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Upcoming Activities</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className="rounded-lg border p-3 transition-all duration-300 hover:shadow-md"
                      style={{
                        animation: `fadeIn 0.5s ease-in-out forwards`,
                        animationDelay: `${index * 0.1}s`,
                        opacity: 0,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{event.title}</div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <CalendarIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No upcoming activities</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
