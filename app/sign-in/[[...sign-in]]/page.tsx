import ProtectedClerkAuth from "@/components/auth/protected-clerk-auth";
import { useSearchParams } from "next/navigation";

export default function Page() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12 w-full">
      <ProtectedClerkAuth mode="signIn" redirectUrl="/dashboard" />
    </div>
  );
} 