"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart2, Calendar, Home, Settings, Users, Activity, CreditCard, FileText, Menu, User } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps {
  userRole?: "athlete" | "coach"
}

export function Sidebar({ userRole = "athlete" }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Common navigation items for all roles
  const commonItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    // {
    //   title: "Profile",
    //   href: "/dashboard/profile",
    //   icon: User,
    // },
    // {
    //   title: "Settings",
    //   href: "/dashboard/settings",
    //   icon: Settings,
    // },
  ]

  // Role-specific navigation items
  const roleItems = {
    athlete: [
      // {
      //   title: "Activities",
      //   href: "/dashboard/activities",
      //   icon: Activity,
      // },
      // {
      //   title: "Calendar",
      //   href: "/dashboard/calendar",
      //   icon: Calendar,
      // },
      // {
      //   title: "Analytics",
      //   href: "/dashboard/analytics",
      //   icon: BarChart2,
      // },
    ],
    coach: [
      {
        title: "Athletes",
        href: "/dashboard/athletes",
        icon: Users,
      },
      {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart2,
      },
    ],
    admin: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart2,
      },
      {
        title: "Billing",
        href: "/dashboard/billing",
        icon: CreditCard,
      },
      {
        title: "Logs",
        href: "/dashboard/logs",
        icon: FileText,
      },
    ],
  }

  const items = [...commonItems, ...(roleItems[userRole] || [])]

  const SidebarContent = () => (
    <div className="flex h-full flex-col px-3 py-4">
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <div className="rounded-md bg-muted px-3 py-2">
          <div className="text-sm font-medium">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
          <p className="text-xs text-muted-foreground">
            {userRole === "athlete" ? "Personal account" : userRole === "coach" ? "Coach account" : "Admin account"}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="block md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-gray-50/40 dark:bg-gray-900/40 md:block md:w-64">
        <SidebarContent />
      </div>
    </>
  )
}
