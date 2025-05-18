"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function AthleteDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [lastSync, setLastSync] = useState("Never");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // If the user is not signed in and the clerk data is loaded, redirect to home
    if (isLoaded && !isSignedIn) {
      router.push('/');
      return;
    }

    // Get user role from metadata
    if (user) {
      const role = user.unsafeMetadata?.role as string | undefined;
      // If user doesn't have the athlete role, redirect to main dashboard
      if (role !== 'athlete') {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Simulate syncing with Strava
  const handleSync = () => {
    setIsSyncing(true);
    
    // Simulate API call
    setTimeout(() => {
      setLastSync(new Date().toLocaleString());
      setIsSyncing(false);
    }, 2000);
  };

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
            <h1 className="text-xl font-bold">Athlete Dashboard</h1>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Workouts</h2>
            <Button onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Syncing...
                </>
              ) : (
                "Sync with Strava"
              )}
            </Button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600">Last synced: {lastSync}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Recent Activities</h3>
              <p className="text-gray-600 mb-4">View your latest workouts and activities.</p>
              <Button variant="outline">View Activities</Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Training Plan</h3>
              <p className="text-gray-600 mb-4">View your assigned training plan and upcoming workouts.</p>
              <Button variant="outline">View Plan</Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600 mb-4">View your performance metrics and progress over time.</p>
              <Button variant="outline">View Stats</Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Connect Apps</h3>
              <p className="text-gray-600 mb-4">Connect with Strava, Notion, and other services.</p>
              <Button variant="outline">Connect</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 