"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function CoachDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If the user is not signed in and the clerk data is loaded, redirect to home
    if (isLoaded && !isSignedIn) {
      router.push('/');
      return;
    }

    // Get user role from metadata
    if (user) {
      const role = user.unsafeMetadata?.role as string | undefined;
      // If user doesn't have the coach role, redirect to main dashboard
      if (role !== 'coach') {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Render loading state while user data is loading
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header with user button */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">Coach Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Main Dashboard
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Coach Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Manage Athletes</h3>
              <p className="text-gray-600 mb-4">View and manage your connected athletes' accounts and data.</p>
              <Button variant="outline">View Athletes</Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Training Plans</h3>
              <p className="text-gray-600 mb-4">Create and assign training plans to your athletes.</p>
              <Button variant="outline">Manage Plans</Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600 mb-4">View advanced analytics and insights for your athletes.</p>
              <Button variant="outline">Open Analytics</Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <p className="text-gray-600 mb-4">Configure notification settings for athlete activity.</p>
              <Button variant="outline">Settings</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 