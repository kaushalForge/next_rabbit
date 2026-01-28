import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("cUser")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/404", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
