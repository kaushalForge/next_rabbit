"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookie/get-user`,
        {
          method: "GET",
          headers: {
            Cookie: `cUser=${token}`,
          },
          cache: "no-store",
        },
      );
      const result = await res.json();
      if (pathname.startsWith("/admin") && result?.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout"],
};
