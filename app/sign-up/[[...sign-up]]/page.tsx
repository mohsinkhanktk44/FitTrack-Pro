import ProtectedClerkAuth from "@/components/auth/protected-clerk-auth";
import { useSearchParams } from "next/navigation";

export default function Page() {
  // Get role from query if needed
  // const searchParams = useSearchParams();
  // const userRole = searchParams.get('role');
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <ProtectedClerkAuth mode="signUp" redirectUrl="/dashboard" />
    </div>
  );
} 