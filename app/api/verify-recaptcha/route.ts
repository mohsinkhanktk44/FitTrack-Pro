import { NextRequest, NextResponse } from "next/server";

// reCAPTCHA verification API route
export async function POST(request: NextRequest) {
  try {
    // Use environment variables or fallback
    const skipInDev = process.env.NEXT_PUBLIC_SKIP_RECAPTCHA_IN_DEV === "true";
    const isDev = process.env.NODE_ENV === "development";
    
    // Skip verification in development mode if flag is set
    if (isDev && skipInDev) {
      console.log("Skipping reCAPTCHA verification in development mode");
      return NextResponse.json({
        success: true,
        score: 1.0,
        action: 'dev_mode',
        challenge_ts: new Date().toISOString(),
        hostname: 'localhost',
        passed: true
      });
    }
    
    // Get the reCAPTCHA token from the request body
    const body = await request.json().catch(err => {
      console.error("Failed to parse request body:", err);
      return {};
    });
    
    const { token } = body;

    if (!token) {
      console.error("Missing reCAPTCHA token in request");
      return NextResponse.json(
        { success: false, error: "Missing reCAPTCHA token" },
        { status: 400 }
      );
    }

    // Get the secret key from environment variables with fallback
    const secretKey = process.env.RECAPTCHA_SECRET_KEY || "6LcugT4rAAAAAOOwEfpc67IBx8qc_NshZfyQtcyI";

    console.log("Verifying reCAPTCHA token with Google...");

    // Send request to Google reCAPTCHA verification API
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify";
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    // Add user's IP if available
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip");
    if (ip) {
      formData.append("remoteip", ip);
    }

    // Make the verification request to Google
    const verificationResponse = await fetch(verificationURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    }).catch(error => {
      console.error("Failed to contact Google's reCAPTCHA API:", error);
      throw new Error("reCAPTCHA service unavailable");
    });
    
    if (!verificationResponse.ok) {
      console.error(`Google reCAPTCHA API error: ${verificationResponse.status} ${verificationResponse.statusText}`);
      throw new Error(`Google reCAPTCHA API error: ${verificationResponse.status}`);
    }

    // Parse the response from Google
    const verificationResult = await verificationResponse.json().catch(error => {
      console.error("Failed to parse Google's reCAPTCHA response:", error);
      throw new Error("Invalid response from reCAPTCHA service");
    });
    
    console.log("Google reCAPTCHA response:", JSON.stringify(verificationResult));

    // For reCAPTCHA v3, we also check the score
    // You can adjust the threshold based on your requirements
    if (verificationResult.success && verificationResult.score !== undefined) {
      const score = verificationResult.score;
      console.log(`reCAPTCHA score: ${score}`);
      
      // Return the result with the score, action, and timestamp
      return NextResponse.json({
        success: verificationResult.success,
        score: score,
        action: verificationResult.action || 'unknown',
        challenge_ts: verificationResult.challenge_ts,
        hostname: verificationResult.hostname,
        // We set a threshold of 0.5, but you can adjust this
        // Lower scores indicate more suspicious activity
        passed: score >= 0.5
      });
    }

    // Return the verification result for other cases
    return NextResponse.json(verificationResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("reCAPTCHA verification failed:", errorMessage);
    
    return NextResponse.json(
      { success: false, error: errorMessage || "Verification failed" },
      { status: 500 }
    );
  }
} 