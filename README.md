
# NotionCoach

NotionCoach is a web application that seamlessly connects Strava workout data with Notion workspaces, providing athletes and coaches with powerful training insights and collaboration tools.

## Environment Configuration

### Required API Keys and Credentials

The application requires several API keys and credentials to function properly. Create a `.env` file in the root directory with the following structure:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Strava API
NEXT_PUBLIC_STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_secret
NEXT_PUBLIC_STRAVA_REDIRECT_URI=your_redirect_uri

# Environment Settings
NODE_ENV=development
NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV=false
```

### API Key Setup Instructions

1. **Clerk Authentication**
   - Sign up at [Clerk.dev](https://clerk.dev)
   - Create a new application
   - Copy the publishable key and secret key
   - Configure authentication settings in Clerk dashboard

2. **Google reCAPTCHA**
   - Visit [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
   - Register a new site
   - Choose reCAPTCHA v2
   - Add your domain
   - Copy site key and secret key

3. **Strava API**
   - Create account at [Strava Developers](https://developers.strava.com)
   - Create new application
   - Configure OAuth settings
   - Set proper redirect URI
   - Copy client ID and client secret

### Security Notes

⚠️ **Important:**
- Never commit `.env` file to version control
- Keep your secret keys secure
- Rotate keys periodically
- Use different keys for development and production
- Consider using a secrets management service for production

### Environment Variables Validation

The application validates required environment variables on startup. Missing or invalid variables will trigger appropriate warnings.

### Development vs Production

Different environment configurations might be needed for development and production:

```env
# Development
NODE_ENV=development
NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV=true
NEXT_PUBLIC_STRAVA_REDIRECT_URI=http://localhost:3000/api/strava/callback

# Production
NODE_ENV=production
NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV=false
NEXT_PUBLIC_STRAVA_REDIRECT_URI=https://your-domain.com/api/strava/callback
```

### Troubleshooting Environment Issues

1. **Clerk Authentication Issues**
   - Verify keys are correctly copied
   - Check Clerk dashboard for proper configuration
   - Ensure redirect URLs are properly set

2. **reCAPTCHA Problems**
   - Verify domain settings in Google reCAPTCHA admin
   - Check if keys match environment
   - Consider enabling debug mode in development

3. **Strava Integration Issues**
   - Confirm redirect URI matches Strava app settings
   - Verify API access scope settings
   - Check rate limiting status

## Current Status & Known Issues

### Backend Challenges
- **Authentication Mismatch**: Frontend uses Clerk while backend implements JWT, causing integration issues
- **CORS Configuration**: Cross-Origin Resource Sharing (CORS) issues preventing proper frontend-backend communication
- **API Integration**: Inconsistent API endpoint behavior
- **Security Concerns**: Need to standardize authentication approach across the stack

### Frontend Status
- Authentication working with Clerk
- UI components and layouts implemented
- Strava integration 
- Notion API integration in progress 
## Features

### For Athletes
- Automatic syncing of Strava activities to Notion
- Customizable workout data organization
- Training analytics and insights
- Progress tracking
- Secure data sharing with coaches

### For Coaches
- Centralized dashboard to monitor multiple athletes
- Data-driven feedback capabilities 
- Progress tracking for all athletes
- Custom training plan creation
- Organized athlete management

## Tech Stack

- **Frontend Framework**: Next.js 13+ with App Router
- **Authentication**: Clerk
- **UI Components**: Custom components with Radix UI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Security**: Google reCAPTCHA integration
- **Database**: (Not specified in current codebase)

## Core Components

### Authentication & Security
- Secure user authentication via Clerk
- Role-based access control (Athletes/Coaches/Admins)
- reCAPTCHA protection for auth endpoints

### Dashboard
- Activity tracking
- Profile management


### Admin Panel
- User management

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install