"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart2, Calendar, Home, Settings, Users, Activity, CreditCard, FileText, Menu, User } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useUser } from "@clerk/nextjs"

interface SidebarProps {
  userRole?: "athlete" | "coach"
}

export function Sidebar({ userRole = "athlete" }: SidebarProps) {
  const { user } = useUser()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Common navigation items for all roles
  const commonItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
  
  ]

  // Role-specific navigation items
  const roleItems = {
    athlete: [
 
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

  console.log(user,'user--------->')

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo/Brand */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">NotionCoach</h2>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
              pathname === item.href
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.title}</span>
          </Link>
        ))}
      </nav>

      {/* User Info Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
            {String(user?.unsafeMetadata.role).charAt(0).toUpperCase() + String(user?.unsafeMetadata.role).slice(1)} Account
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
            {user?.firstName || 'User'}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-lg shadow-lg bg-white dark:bg-gray-900">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col h-full w-64">
        <SidebarContent />
      </div>
    </>
  )
}
