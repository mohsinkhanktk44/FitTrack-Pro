"use client";

import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface ReCAPTCHAVerifierProps {
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
  action?: string;
}

// This component will execute the reCAPTCHA verification
function ReCAPTCHAVerifier({ onVerify, onError, action = "login" }: ReCAPTCHAVerifierProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const handleReCaptchaVerify = async () => {
      if (!executeRecaptcha) {
        console.log("Execute recaptcha not available yet");
        return;
      }

      try {
        setIsVerifying(true);
        // Execute reCAPTCHA with the action
        const token = await executeRecaptcha(action);
        console.log("reCAPTCHA token:", token.substring(0, 10) + "...");
        onVerify(token);
      } catch (error) {
        console.error("reCAPTCHA verification failed:", error);
        if (onError && error instanceof Error) {
          onError(error);
        }
      } finally {
        setIsVerifying(false);
      }
    };

    // Only run if executeRecaptcha is available
    if (executeRecaptcha) {
      handleReCaptchaVerify();
    }
  }, [executeRecaptcha, onVerify, onError, action]);

  return (
    <div className="recaptcha-verifying">
      {isVerifying && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin h-5 w-5 border-b-2 border-gray-900 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Verifying...</span>
        </div>
      )}
    </div>
  );
}

interface ReCAPTCHAProps {
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
  action?: string;
}

export default function ReCAPTCHA({ onVerify, onError, action = "login" }: ReCAPTCHAProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use Google's test keys for development
  const isDevelopment = true; // Force development mode
  const skipInDev = false; // Always skip in development
  const siteKey = "6LcugT4rAAAAALandTPawjNCSRdoIRhX8u_NLbHr"; // Google's test key

  // Skip reCAPTCHA in development mode
  useEffect(() => {
    setMounted(true);
    
    if (isDevelopment && skipInDev) {
      console.log("Skipping reCAPTCHA in development mode");
      onVerify("dev-mode-fake-token");
      return;
    }
  }, [isDevelopment, skipInDev, onVerify]);

  // Skip rendering until mounted to prevent hydration errors
  if (!mounted) {
    return null;
  }

  // Skip reCAPTCHA in development mode
  if (isDevelopment && skipInDev) {
    return (
      <div className="my-4 p-2 border border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-sm">
        reCAPTCHA verification skipped in development mode
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 p-2 border border-red-500 bg-red-50 text-red-700 rounded-md text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "body",
      }}
    >
      <div className="recaptcha-container my-2">
        <ReCAPTCHAVerifier onVerify={onVerify} onError={(err) => {
          setError(err.message);
          if (onError) onError(err);
        }} action={action} />
        <div className="flex items-center justify-center mt-2">
          <div className="text-xs text-gray-500">
            Protected by reCAPTCHA v3
          </div>
        </div>
      </div>
    </GoogleReCaptchaProvider>
  );
} 