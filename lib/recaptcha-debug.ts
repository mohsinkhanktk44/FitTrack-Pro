/**
 * reCAPTCHA Debug Utilities
 * 
 * This file contains utility functions for debugging reCAPTCHA issues.
 */

/**
 * Logs the global state of reCAPTCHA related objects
 * Useful for debugging "undefined is not an object" errors
 */
export function logRecaptchaState(): void {
  // Check if running in browser
  if (typeof window === 'undefined') {
    console.log('[RecaptchaDebug] Not running in browser environment');
    return;
  }

  // Log global grecaptcha object
  console.log('[RecaptchaDebug] window.grecaptcha:', 
    window.grecaptcha ? 'Defined' : 'Undefined');
  
  // Check if grecaptcha enterprise exists
  console.log('[RecaptchaDebug] window.grecaptcha.enterprise:', 
    window.grecaptcha?.enterprise ? 'Defined' : 'Undefined');
  
  // Check reCAPTCHA execution keys
  console.log('[RecaptchaDebug] Environment variables:');
  console.log('- NEXT_PUBLIC_RECAPTCHA_SITE_KEY:', 
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'Not set');
  console.log('- NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV:', 
    process.env.NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV || 'Not set');
  
  // Check if script is loaded
  const recaptchaScript = document.querySelector('script[src*="recaptcha"]');
  console.log('[RecaptchaDebug] reCAPTCHA script loaded:', recaptchaScript ? 'Yes' : 'No');
  
  if (recaptchaScript) {
    console.log('- Script src:', recaptchaScript.getAttribute('src'));
  }
}

/**
 * Checks for common reCAPTCHA implementation issues
 * Returns array of detected issues
 */
export function detectRecaptchaIssues(): string[] {
  const issues: string[] = [];
  
  // Only run in browser
  if (typeof window === 'undefined') {
    return ['Not running in browser environment'];
  }
  
  // Check if grecaptcha is defined
  if (!window.grecaptcha) {
    issues.push('window.grecaptcha is undefined - script may not be loaded correctly');
  }
  
  // Check for site key
  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    issues.push('NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable is not set');
  }
  
  // Look for script loading issues
  const recaptchaScript = document.querySelector('script[src*="recaptcha"]');
  if (!recaptchaScript) {
    issues.push('reCAPTCHA script is not loaded in the document');
  }
  
  // Check if there are multiple instances of the script
  const recaptchaScripts = document.querySelectorAll('script[src*="recaptcha"]');
  if (recaptchaScripts.length > 1) {
    issues.push(`Multiple reCAPTCHA scripts detected (${recaptchaScripts.length})`);
  }
  
  return issues;
}

// For TypeScript to recognize the grecaptcha global variable
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      enterprise?: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
} 