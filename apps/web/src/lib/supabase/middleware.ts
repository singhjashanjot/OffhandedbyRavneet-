/* ========================================
   SUPABASE MIDDLEWARE HELPER
   Refreshes auth tokens on every request
   + Protected route enforcement
======================================== */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/checkout", "/bookings", "/profile", "/orders", "/admin"];

// Routes that should redirect TO home if user IS authenticated
const AUTH_ROUTES = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — important for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protected routes: redirect unauthenticated users to login
  if (!user && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Auth routes: redirect authenticated users to home
  if (user && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
