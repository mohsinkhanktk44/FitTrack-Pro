"use client";

import ProtectedClerkAuth from "@/components/auth/protected-clerk-auth";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const userRole = searchParams.get('role');
  
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <ProtectedClerkAuth 
        mode="signUp" 
        redirectUrl="/dashboard" 
        signInUrl={userRole ? `/sign-in?role=${userRole}` : "/sign-in"}
        userRole={userRole || undefined}
      />
    </div>
  );
} 