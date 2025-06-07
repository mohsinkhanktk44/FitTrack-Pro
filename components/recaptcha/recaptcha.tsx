"use client";

import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { logRecaptchaState, detectRecaptchaIssues } from "@/lib/recaptcha-debug";

interface ReCAPTCHAVerifierProps {
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
  action?: string;
}

// This component will execute the reCAPTCHA verification
function ReCAPTCHAVerifier({ onVerify, onError, action = "login" }: ReCAPTCHAVerifierProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;
  const [initialized, setInitialized] = useState(false);

  // Initialize and ensure grecaptcha is ready
  useEffect(() => {
    if (!executeRecaptcha) return;
    
    // Use the grecaptcha.ready method to ensure the API is fully loaded
    if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
      window.grecaptcha.ready(() => {
        console.log("grecaptcha is ready");
        setInitialized(true);
      });
    } else {
      // Fallback if ready method isn't available
      console.log("Using fallback initialization check");
      setInitialized(true);
    }
  }, [executeRecaptcha]);

  useEffect(() => {
    // Only run verification if executeRecaptcha is available, initialized, and we haven't exceeded attempts
    if (!executeRecaptcha || !initialized || verificationAttempts >= MAX_ATTEMPTS) return;

    const handleReCaptchaVerify = async () => {
      try {
        setIsVerifying(true);
        
        // Log recaptcha state for debugging
        if (verificationAttempts > 0) {
          console.log(`Retry attempt ${verificationAttempts + 1}/${MAX_ATTEMPTS}`);
          const issues = detectRecaptchaIssues();
          if (issues.length > 0) {
            console.warn("reCAPTCHA issues detected:", issues);
          }
        }
        
        // Wait a moment to ensure grecaptcha is fully initialized
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Execute reCAPTCHA with the action
        const token = await executeRecaptcha(action);
        console.log("reCAPTCHA token:", token.substring(0, 10) + "...");
        onVerify(token);
      } catch (error) {
        console.error("reCAPTCHA verification failed:", error);
        
        // Log detailed state on error
        logRecaptchaState();
        
        setVerificationAttempts(prev => prev + 1);
        
        if (onError && error instanceof Error) {
          onError(error);
        }
      } finally {
        setIsVerifying(false);
      }
    };

    // Slight delay before verification to ensure everything is loaded
    const timeoutId = setTimeout(() => {
      handleReCaptchaVerify();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [executeRecaptcha, onVerify, onError, action, verificationAttempts, initialized]);

  return (
    <div className="recaptcha-verifying">
      {isVerifying && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin h-5 w-5 border-b-2 border-gray-900 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Verifying...</span>
        </div>
      )}
      {verificationAttempts >= MAX_ATTEMPTS && (
        <div className="text-sm text-red-600 mt-2">
          Verification failed after multiple attempts. Please try again later or refresh the page.
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

// Define a global function for the script callback
declare global {
  interface Window {
    recaptchaLoaded: () => void;
  }
}

export default function ReCAPTCHA({ onVerify, onError, action = "login" }: ReCAPTCHAProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const MAX_LOAD_ATTEMPTS = 3;
  
  // Use environment variables or fallback to test keys
  const isDevelopment = process.env.NODE_ENV === "development";
  const skipInDev = process.env.NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV === "true";
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LcugT4rAAAAALandTPawjNCSRdoIRhX8u_NLbHr";

  // Setup callback for reCAPTCHA script loading
  useEffect(() => {
    // Define the callback function that will be called when the script loads
    window.recaptchaLoaded = () => {
      console.log("reCAPTCHA script loaded successfully");
      setScriptReady(true);
    };
    
    // Also check if grecaptcha is already available (might happen on reload)
    if (typeof window !== 'undefined' && window.grecaptcha) {
      console.log("grecaptcha already available");
      setScriptReady(true);
    }
    
    return () => {
      // Clean up
      window.recaptchaLoaded = () => {};
    };
  }, []);
  
  // Retry script loading if it fails
  useEffect(() => {
    if (scriptReady || loadAttempts >= MAX_LOAD_ATTEMPTS || !mounted) return;
    
    // Only start retry attempts if component is mounted and script isn't ready
    const checkScriptLoaded = () => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        console.log(`Script loaded on attempt ${loadAttempts + 1}`);
        setScriptReady(true);
        return true;
      }
      return false;
    };
    
    // If already tried a few times and still not loaded, try to force reload the script
    if (loadAttempts > 0 && !checkScriptLoaded()) {
      console.log(`Retrying script load: attempt ${loadAttempts + 1}/${MAX_LOAD_ATTEMPTS}`);
      
      // Force script reload for subsequent attempts
      if (loadAttempts >= 1) {
        const existingScript = document.querySelector('script[src*="recaptcha"]');
        if (existingScript && existingScript.parentNode) {
          existingScript.parentNode.removeChild(existingScript);
        }
      }
    }
    
    // Increase attempt counter
    const timeoutId = setTimeout(() => {
      setLoadAttempts(prev => prev + 1);
    }, 1500);
    
    return () => clearTimeout(timeoutId);
  }, [loadAttempts, scriptReady, mounted]);

  // Skip reCAPTCHA in development mode if configured
  useEffect(() => {
    setMounted(true);
    
    if (isDevelopment && skipInDev) {
      console.log("Skipping reCAPTCHA in development mode");
      onVerify("dev-mode-fake-token");
    }
    
    // Check if the script is already in the document
    const recaptchaScript = document.querySelector('script[src*="recaptcha"]');
    if (recaptchaScript) {
      const isLoaded = window.grecaptcha !== undefined;
      console.log("reCAPTCHA script found in document:", isLoaded ? "loaded" : "loading");
      if (isLoaded) {
        setScriptReady(true);
      }
    }
    
    return () => {
      // Clean up any listeners if needed
    };
  }, [isDevelopment, skipInDev, onVerify]);

  // Skip rendering until mounted to prevent hydration errors
  if (!mounted) {
    return null;
  }

  // Skip reCAPTCHA in development mode if configured
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
        <button 
          onClick={() => {
            setError(null);
            setScriptReady(false);
            setTimeout(() => setScriptReady(true), 500);
          }}
          className="ml-2 text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className=" flex justify-center items-center recaptcha-container my-2 mx-0 w-full">
      {!scriptReady && loadAttempts > 0 && loadAttempts < MAX_LOAD_ATTEMPTS && (
        <div className="mb-4 flex items-center justify-center py-2">
          <div className="animate-spin h-5 w-5 border-b-2 border-gray-900 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Loading reCAPTCHA...</span>
        </div>
      )}
      
      {!scriptReady && loadAttempts >= MAX_LOAD_ATTEMPTS && (
        <div className=" mb-4 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          Failed to load reCAPTCHA. Please refresh the page and try again.
          <button 
            onClick={() => window.location.reload()}
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Refresh
          </button>
        </div>
      )}
      
      <GoogleReCaptchaProvider
        reCaptchaKey={siteKey}
        scriptProps={{
          async: false, // Changed to false to ensure script is loaded before used
          defer: true,
          appendTo: "head", // Changed to head for better loading sequence
          nonce: undefined,
          onLoadCallbackName: "recaptchaLoaded", // Use this for script load callback
        }}
        useEnterprise={false}
        language="en"
        useRecaptchaNet={true} // Use recaptcha.net for better global accessibility
      >
        {scriptReady && (
          <ReCAPTCHAVerifier 
            onVerify={onVerify} 
            onError={(err) => {
              setError(err.message);
              if (onError) onError(err);
            }} 
            action={action} 
          />
        )}
        <div className="flex items-center justify-center mt-2">
          <div className="text-xs text-gray-500">
            Protected by reCAPTCHA v3
          </div>
        </div>
      </GoogleReCaptchaProvider>
    </div>
  );
} 