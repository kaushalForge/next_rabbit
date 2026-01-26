import { NextResponse } from "next/server";

export function middleware(req) {
  const cookie = req.cookies.get("cUser")?.value;

  if (!cookie && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
