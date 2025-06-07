"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserCircle2 } from "lucide-react";
import { isAdminEmail } from "@/lib/admin";

export default function SetRolePage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin and redirect to admin page
    if (user) {
      const userEmail = user.emailAddresses[0]?.emailAddress;
      if (userEmail && isAdminEmail(userEmail)) {
        router.push('/admin');
        return;
      }
    }
  }, [user, router]);

  if (!isSignedIn) return <div>Loading...</div>;

  // Check if user is admin (will redirect in useEffect)
  const userEmail = user.emailAddresses[0]?.emailAddress;
  if (userEmail && isAdminEmail(userEmail)) {
    return null; // Will redirect to admin page
  }

  const handleSetRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    await user?.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        role,
      },
    });
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center border border-blue-100">
          <div className="bg-blue-100 rounded-full p-4 mb-4">
            <UserCircle2 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center">Welcome to NotionCoach!</h2>
          <p className="text-gray-500 mb-6 text-center">Please select your role to continue</p>
          <form onSubmit={handleSetRole} className="w-full flex flex-col gap-4">
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-white text-black dark:bg-white dark:text-black border-2 border-blue-200 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              >
                <option value="">Select a role</option>
                <option value="athlete">Athlete</option>
                <option value="coach">Coach</option>
              </select>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white text-lg font-semibold py-3 rounded-lg shadow-md disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Role & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 