"use client";

import ProtectedClerkAuth from "@/components/auth/protected-clerk-auth";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const userRole = searchParams.get('role');
  
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <ProtectedClerkAuth 
        mode="signIn" 
        redirectUrl="/dashboard" 
        signUpUrl={userRole ? `/sign-up?role=${userRole}` : "/sign-up"}
        userRole={userRole || undefined}
      />
    </div>
  );
} 