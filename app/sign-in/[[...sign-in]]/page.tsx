import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
} 