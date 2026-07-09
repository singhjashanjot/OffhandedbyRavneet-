import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Please provide an email address, e.g. /api/temp-debug?email=your-email@example.com" },
      { status: 400 }
    );
  }

  try {
    const result = await sendWelcomeEmail(email, "Debug Creative Friend");
    
    return NextResponse.json({
      success: !result.error,
      env: {
        FROM_EMAIL: process.env.FROM_EMAIL || "not defined (onboarding@resend.dev fallback)",
        FROM_NAME: process.env.FROM_NAME || "not defined",
        OWNER_EMAIL: process.env.OWNER_EMAIL || "not defined",
        HAS_RESEND_KEY: !!process.env.RESEND_API_KEY,
        RESEND_KEY_PREFIX: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.slice(0, 7) + "..." : "none",
      },
      resendResult: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error occurred",
      stack: error.stack,
    });
  }
}
