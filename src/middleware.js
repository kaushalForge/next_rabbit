"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin and /checkout
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/checkout")) {
    return NextResponse.next();
  }

  try {
    // ✅ Await cookie store
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    if (!token) {
      // No token → redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Forward cookie to backend
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookie/get-user`,
      {
        method: "GET",
        headers: {
          Cookie: `cUser=${token}`, // send token
        },
        cache: "no-store", // always get fresh data
      },
    );

    if (!backendRes.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const data = await backendRes.json();

    if (!data.isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Admin-only protection
    if (pathname.startsWith("/admin") && data.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Checkout protection: any logged-in user
    if (pathname.startsWith("/checkout") && !data.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // ✅ All checks passed
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware auth error:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/checkout"],
};
