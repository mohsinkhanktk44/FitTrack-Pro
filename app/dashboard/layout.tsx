import type React from "react"
import { Sidebar } from "@/components/dashboard-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen overflow-hidden">
        {/* Sticky Sidebar with full height */}
        <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:z-50">
          <Sidebar userRole="athlete" />
        </div>
        
        {/* Main content area */}
        <div className="flex flex-col flex-1 md:ml-64">
          <DashboardHeader />
          <main className="flex-1 overflow-auto bg-gray-50/40 dark:bg-gray-900/40">
            <div className="container mx-auto p-4 md:p-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
