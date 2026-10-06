import { NextResponse } from "next/server";
import { isDemoAdminToken } from "@/lib/demoAdmin";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/checkout") &&
    !pathname.startsWith("/profile")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("cUser")?.value;

  if (!token && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  // Demo admin is read-only: every admin write (server actions call these routes too) is refused.
  if (pathname.startsWith("/api/admin") && request.method !== "GET" && isDemoAdminToken(token)) {
    return NextResponse.json(
      { success: false, message: "Demo mode is read-only. Buy the template to unlock full admin access." },
      { status: 403 },
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/checkout", "/profile"],
};
