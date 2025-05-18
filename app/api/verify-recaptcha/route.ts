import { NextRequest, NextResponse } from "next/server";

// reCAPTCHA verification API route
export async function POST(request: NextRequest) {
  try {
    // Set to false to actually verify with Google
    const skipInDev = false;
    const isDev = true;
    
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
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing reCAPTCHA token" },
        { status: 400 }
      );
    }

    // Get the secret key from environment variables or use hardcoded test key for development
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
    });

    // Parse the response from Google
    const verificationResult = await verificationResponse.json();
    
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
    console.error("reCAPTCHA verification failed:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
} 