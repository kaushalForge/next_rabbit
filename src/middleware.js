import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookie/get-user`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        },
      );

      if (!res.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const data = await res.json();

      // 🔐 Admin-only guard
      if (pathname.startsWith("/admin") && data.user.role !== "admin") {
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
