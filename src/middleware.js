import { NextResponse } from "next/server";
export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const token = request.cookies.get("cUser")?.value;
  if (!token) return NextResponse.redirect(new URL("/404", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
