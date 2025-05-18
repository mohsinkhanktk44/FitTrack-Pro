import { NextRequest, NextResponse } from "next/server";

// Development-only reCAPTCHA verification API route
export async function POST(request: NextRequest) {
  // Simply return success for development testing
  return NextResponse.json({
    success: true,
    score: 1.0,
    action: 'dev_mode',
    challenge_ts: new Date().toISOString(),
    hostname: 'localhost',
    passed: true
  });
} 