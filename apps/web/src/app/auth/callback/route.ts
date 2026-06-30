/* ========================================
  AUTH CALLBACK ROUTE
  Handles OAuth callback (e.g., Google)
  by exchanging the code for a session
  Supports redirectTo parameter for post-login redirects
======================================== */

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Support both 'next' (from Supabase) and 'redirectTo' (our custom param)
  const redirectTo = searchParams.get("redirectTo") || searchParams.get("next") || "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
