# reCAPTCHA Integration with Clerk Authentication

This project integrates Google reCAPTCHA with Clerk authentication to enhance security and prevent bot activity.

## Setup

1. Register for a [Google reCAPTCHA](https://www.google.com/recaptcha/admin) account and get your site key and secret key.

2. Add the following environment variables to your `.env.local` file:

```
# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Development options
# Set to "true" to skip reCAPTCHA verification in development mode
NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV=true

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## How It Works

1. When a user navigates to `/sign-in` or `/sign-up`, they will first see a reCAPTCHA challenge.
2. Once the user completes the reCAPTCHA challenge, the token is sent to our backend API for verification.
3. The backend API sends the token to Google's reCAPTCHA verification API to confirm its validity.
4. If the token is valid, the Clerk authentication form is displayed.
5. The user can then complete the authentication process with Clerk.

## Backend Verification

The reCAPTCHA token verification process follows these steps:

1. The frontend collects the reCAPTCHA token and sends it to our `/api/verify-recaptcha` endpoint.
2. The API endpoint verifies the token with Google's reCAPTCHA API by sending:
   - `secret`: Your reCAPTCHA secret key
   - `response`: The token from the frontend
   - `remoteip`: (Optional) The user's IP address
3. Google's API returns a JSON response with:
   ```json
   {
     "success": true|false,
     "challenge_ts": "timestamp",
     "hostname": "site-hostname",
     "error-codes": [...]  // optional
   }
   ```
4. Our API validates the response and only allows authentication if `success` is `true`.

## Development Mode

For convenience during development, you can set `NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV=true` to bypass the reCAPTCHA verification in development mode. This setting will only affect the application when `NODE_ENV` is set to `"development"`.

## Components

- `components/recaptcha/recaptcha.tsx`: A reusable reCAPTCHA component.
- `components/auth/protected-clerk-auth.tsx`: A component that wraps Clerk's `SignIn` and `SignUp` components with reCAPTCHA verification.
- `app/sign-in/page.tsx` and `app/sign-up/page.tsx`: Pages that use the protected auth component.
- `app/api/verify-recaptcha/route.ts`: API route that verifies reCAPTCHA tokens with Google's verification API.

## Limitations

- If there are issues with the reCAPTCHA verification, the user will see an error message and can retry.
- The system assumes that the Google reCAPTCHA service is available and responsive.

## Future Improvements

1. Implement rate limiting for failed authentication attempts.
2. Add support for reCAPTCHA v3 invisible mode for a smoother user experience.
3. Add logging and monitoring for suspicious verification attempts. 