"use client";

import { useState, useEffect } from "react";
import { SignIn, SignUp, useUser, useClerk } from "@clerk/nextjs";
import ReCAPTCHA from "../recaptcha/recaptcha";
import { useRouter } from "next/navigation";

interface ProtectedClerkAuthProps {
  mode: "signIn" | "signUp";
  redirectUrl?: string;
  signInUrl?: string;
  signUpUrl?: string;
  userRole?: string;
}

export default function ProtectedClerkAuth({
  mode,
  redirectUrl,
  signInUrl,
  signUpUrl,
  userRole,
}: ProtectedClerkAuthProps) {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const isDevelopment = process.env.NODE_ENV === "development";
  const skipCaptchaInDev = process.env.NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV === "true";
  const router = useRouter();
  
  // Clerk hooks
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // Handle component mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // In development, we can skip the captcha verification if configured
  useEffect(() => {
    if (isDevelopment && skipCaptchaInDev) {
      setCaptchaVerified(true);
    }
  }, [isDevelopment, skipCaptchaInDev]);

  // Handle user role setting
  useEffect(() => {
    const updateUserRoleMetadata = async () => {
      if (isSignedIn && user) {
        let role = user.unsafeMetadata?.role;
        if (!role && userRole) {
          try {
            await user.update({
              unsafeMetadata: {
                ...user.unsafeMetadata,
                role: userRole,
              },
            });
            console.log("User role set to:", userRole);
          } catch (error) {
            console.error("Error updating user role metadata:", error);
            // Store in localStorage as fallback
            localStorage.setItem("userRole", userRole);
          }
        } else if (!role) {
          // Try to get from localStorage
          const storedRole = localStorage.getItem("userRole");
          if (storedRole) {
            try {
              await user.update({
                unsafeMetadata: {
                  ...user.unsafeMetadata,
                  role: storedRole,
                },
              });
              localStorage.removeItem("userRole");
            } catch (error) {
              console.error("Error updating user role from localStorage:", error);
            }
          }
        }
      }
    };
    updateUserRoleMetadata();
  }, [isSignedIn, user, userRole]);

  const handleCaptchaVerify = async (token: string) => {
    setCaptchaToken(token);
    setIsVerifying(true);
    setVerificationError(null);

    try {
      // Skip backend verification in development mode if enabled
      if (isDevelopment && skipCaptchaInDev) {
        setCaptchaVerified(true);
        setIsVerifying(false);
        return;
      }

      // Verify the token with our backend
      const response = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`Verification API error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Verification result:", result);

      if (result.success) {
        // For reCAPTCHA v3, we check the score and passed flag
        if (result.score !== undefined) {
          if (result.passed) {
            // Score is acceptable
            console.log(`reCAPTCHA score ${result.score} passed threshold`);
            setCaptchaVerified(true);
          } else {
            // Score is too low (suspicious activity)
            console.warn(`reCAPTCHA score ${result.score} below threshold`);
            setVerificationError(
              "Security verification failed. Please try again or contact support if the issue persists."
            );
          }
        } else {
          // Legacy response without score (shouldn't happen with v3)
          setCaptchaVerified(true);
        }
      } else {
        // Verification failed
        setVerificationError(
          result.error || "reCAPTCHA verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error verifying reCAPTCHA:", error);
      setVerificationError(
        error instanceof Error 
          ? `Verification error: ${error.message}` 
          : "An error occurred during verification. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCaptchaError = (error: Error) => {
    console.error("reCAPTCHA error:", error);
    setVerificationError(
      "reCAPTCHA error: " + error.message
    );
  };

  const handleRetry = () => {
    setVerificationError(null);
    setCaptchaToken(null);
    setCaptchaVerified(false);
  };

  // Handle client-side navigation back
  const handleBack = () => {
    router.back();
  };

  // Only show content after component has mounted to prevent hydration errors
  if (!mounted) {
    return null;
  }

  // Only render Clerk auth components after captcha is verified
  return (
    <div className="w-full flex justify-center items-center max-w-md mx-auto">
      {!captchaVerified ? (
        <div className="p-4 border rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {mode === "signIn" ? "Sign In" : "Sign Up"}
          </h2>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Please complete security verification
          </p>
          {verificationError && (
            <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {verificationError}
              <button 
                onClick={handleRetry}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Retry
              </button>
            </div>
          )}
          {isVerifying ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <span className="ml-2 text-sm">Verifying...</span>
            </div>
          ) : (
            <ReCAPTCHA 
              onVerify={handleCaptchaVerify} 
              onError={handleCaptchaError}
              action={mode === "signIn" ? "login" : "signup"}
            />
          )}
          <div className="mt-4 text-center">
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to home
            </button>
          </div>
        </div>
      ) : (
        <>
          {mode === "signIn" ? (
            <div className="flex justify-center items-center w-full mx-auto">
            <SignIn
              fallbackRedirectUrl={redirectUrl}
              signUpUrl={signUpUrl}
              afterSignInUrl={redirectUrl}
            />
            </div>
           
          ) : (
            <div className="flex justify-center items-center w-full">
            <SignUp
              fallbackRedirectUrl={redirectUrl}
              signInUrl={signInUrl}
              afterSignUpUrl={redirectUrl}
            />
             </div>

          )}
        </>
      )}
    </div>
  );
} 