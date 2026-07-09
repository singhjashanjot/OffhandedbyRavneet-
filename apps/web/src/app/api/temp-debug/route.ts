import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";
import Razorpay from "razorpay";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  let razorpayStatus: any = null;
  try {
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_dummy_key_for_build";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret_for_build";
    
    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });
    
    // Attempt a dummy order of 1 INR (100 paise)
    const dummyOrder = await razorpay.orders.create({
      amount: 100,
      currency: "INR",
      notes: {
        debug: "true",
      },
    });
    
    razorpayStatus = {
      success: true,
      orderId: dummyOrder.id,
      keyIdPrefix: key_id.substring(0, 8) + "...",
      keyIdLength: key_id.length,
      keySecretLength: key_secret.length,
    };
  } catch (error: any) {
    razorpayStatus = {
      success: false,
      error: error.message || String(error),
      code: error.code,
      statusCode: error.statusCode,
      keyIdPrefix: (process.env.RAZORPAY_KEY_ID || "none").substring(0, 8) + "...",
      keyIdLength: (process.env.RAZORPAY_KEY_ID || "").length,
      keySecretLength: (process.env.RAZORPAY_KEY_SECRET || "").length,
    };
  }

  if (!email) {
    return NextResponse.json({
      message: "Razorpay check completed. To check email as well, pass ?email=...",
      razorpayStatus,
      env: {
        NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID 
          ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.substring(0, 8) + "..." 
          : "undefined",
      }
    });
  }

  try {
    const result = await sendWelcomeEmail(email, "Debug Creative Friend");
    
    return NextResponse.json({
      success: !result.error,
      razorpayStatus,
      env: {
        FROM_EMAIL: process.env.FROM_EMAIL || "not defined (onboarding@resend.dev fallback)",
        FROM_NAME: process.env.FROM_NAME || "not defined",
        OWNER_EMAIL: process.env.OWNER_EMAIL || "not defined",
        HAS_RESEND_KEY: !!process.env.RESEND_API_KEY,
        RESEND_KEY_PREFIX: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.slice(0, 7) + "..." : "none",
        NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID 
          ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.substring(0, 8) + "..." 
          : "undefined",
      },
      resendResult: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      razorpayStatus,
      error: error.message || "Unknown error occurred",
      stack: error.stack,
    });
  }
}
