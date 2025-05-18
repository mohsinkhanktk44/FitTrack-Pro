import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
} 