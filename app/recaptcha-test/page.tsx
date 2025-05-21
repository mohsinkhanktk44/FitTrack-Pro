"use client";

import { useState, useEffect } from "react";
import ReCAPTCHA from "@/components/recaptcha/recaptcha";
import { logRecaptchaState, detectRecaptchaIssues } from "@/lib/recaptcha-debug";
import Link from "next/link";

export default function RecaptchaTestPage() {
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [issues, setIssues] = useState<string[]>([]);

  // Run diagnostics on mount
  useEffect(() => {
    setTimeout(() => {
      // Check for issues
      const detectedIssues = detectRecaptchaIssues();
      setIssues(detectedIssues);
      
      // Add diagnostic log
      addLog("Page mounted, running diagnostics...");
      
      // Log to console
      logRecaptchaState();
    }, 2000);
  }, []);

  const handleVerify = (token: string) => {
    addLog(`Verification successful. Token: ${token.substring(0, 10)}...`);
    setToken(token);
    setVerificationStatus("success");
  };

  const handleError = (error: Error) => {
    addLog(`Verification error: ${error.message}`);
    setVerificationStatus("error");
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].slice(0, 8)}: ${message}`]);
  };

  const runVerificationTest = async () => {
    if (!token) {
      addLog("No token available to verify");
      return;
    }

    addLog("Sending token to verification API...");
    
    try {
      const response = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      addLog(`Verification result: ${JSON.stringify(result)}`);
    } catch (error) {
      addLog(`API test error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">reCAPTCHA Test Page</h1>
      
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Diagnostics</h2>
        {issues.length > 0 ? (
          <div className="text-red-600 mb-2">
            <p className="font-semibold">Issues detected:</p>
            <ul className="list-disc pl-5">
              {issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-green-600">No issues detected</p>
        )}
        
        <div className="mt-4">
          <h3 className="font-semibold">Environment:</h3>
          <ul className="text-sm">
            <li>NODE_ENV: {process.env.NODE_ENV || "not set"}</li>
            <li>NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV: {process.env.NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV || "not set"}</li>
            <li>NEXT_PUBLIC_RECAPTCHA_SITE_KEY: {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? "set" : "not set"}</li>
          </ul>
        </div>
      </div>
      
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">reCAPTCHA Verification Test</h2>
        <div className="mb-4">
          <ReCAPTCHA 
            onVerify={handleVerify} 
            onError={handleError} 
            action="test_page"
          />
        </div>
        
        <div className="mt-2">
          <p className="mb-2">
            Status: <span className={
              verificationStatus === "success" ? "text-green-600 font-semibold" :
              verificationStatus === "error" ? "text-red-600 font-semibold" :
              "text-gray-600"
            }>
              {verificationStatus === "success" ? "Verification Successful ✓" : 
               verificationStatus === "error" ? "Verification Failed ✗" : 
               "Awaiting Verification..."}
            </span>
          </p>
          
          {token && (
            <div className="mb-4">
              <p className="text-sm mb-1 font-semibold">Token:</p>
              <div className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {token}
              </div>
              <button 
                onClick={runVerificationTest}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Test Verification API
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Logs</h2>
        <div className="bg-gray-100 p-2 rounded h-40 overflow-y-auto text-xs font-mono">
          {logs.map((log, idx) => (
            <div key={idx} className="mb-1">{log}</div>
          ))}
          {logs.length === 0 && <p className="text-gray-500">No logs yet</p>}
        </div>
        <div className="mt-2 flex justify-end">
          <button 
            onClick={() => setLogs([])}
            className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs hover:bg-gray-300"
          >
            Clear Logs
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
        <span className="mx-2">|</span>
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          Test Sign In
        </Link>
        <span className="mx-2">|</span>
        <Link href="/sign-up" className="text-blue-600 hover:underline">
          Test Sign Up
        </Link>
      </div>
    </div>
  );
} 