# reCAPTCHA Troubleshooting Guide

This document provides guidance on resolving common issues with reCAPTCHA integration in your Next.js application.

## Common reCAPTCHA Errors

### 1. "undefined is not an object (evaluating 'window[cQ][Fr()][z]')"

This error typically occurs when:
- The reCAPTCHA script hasn't loaded properly
- There's a race condition between script loading and execution
- Environment variables are missing or malformed

### 2. "Cannot read properties of undefined (reading '6LcugT4rAAAAALandTPawjNCSRdoIRhX8u_NLbHr')"

This error occurs when:
- The reCAPTCHA script loaded but the grecaptcha object is not fully initialized
- There's an issue with the site key
- The script is trying to access grecaptcha before it's ready

## Solutions Implemented

The following solutions have been implemented to address these issues:

1. **Improved Script Loading**:
   - Changed script loading to `async: false` to ensure proper loading sequence
   - Added `useRecaptchaNet: true` for better global accessibility
   - Moved script to head instead of body
   - Added callback mechanism for better script load detection

2. **Error Handling**:
   - Added retry mechanism with fallbacks
   - Implemented detailed logging and error reporting
   - Created diagnostic utilities for troubleshooting

3. **Environment Variables**:
   - Added proper environment variable handling with fallbacks
   - Added development mode option to bypass reCAPTCHA for testing

4. **Test Page**:
   - Created `/recaptcha-test` route to test reCAPTCHA in isolation

## How to Test Your Implementation

1. Visit `/recaptcha-test` to check if reCAPTCHA works properly in isolation
2. Try both `/sign-in` and `/sign-up` to ensure the reCAPTCHA verification works in both cases
3. Check browser console for any errors related to reCAPTCHA

## Setup Guide

1. Create a `.env.local` file with the following variables:

```
# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Development options
NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV=false

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

2. Restart your development server with a clean cache:

```bash
# Clear next.js cache
rm -rf .next
# Start the server
npm run dev
```

## Still Having Issues?

If you're still experiencing problems:

1. Check if you're using the latest version of the reCAPTCHA and Clerk packages
2. Ensure you have valid reCAPTCHA keys (use test keys for development)
3. Use the browser console to look for any errors
4. Try the `/recaptcha-test` page to isolate reCAPTCHA issues from Clerk
5. Check if the issue occurs in both development and production

## Using Google's Test Keys

For development, you can use Google's test keys:

- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

These keys always return successful verification, regardless of user interaction.

## Debugging Utilities

Use the debugging utilities in `lib/recaptcha-debug.ts`:

```javascript
import { logRecaptchaState, detectRecaptchaIssues } from "@/lib/recaptcha-debug";

// Log the current state of reCAPTCHA objects
logRecaptchaState();

// Check for common issues
const issues = detectRecaptchaIssues();
if (issues.length > 0) {
  console.warn("reCAPTCHA issues detected:", issues);
}
``` 