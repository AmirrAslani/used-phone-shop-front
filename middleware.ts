import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const role = req.cookies.get("role")?.value;

  // admin routes
  if (req.nextUrl.pathname.startsWith("/shop/admin")) {
    if (!token || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  
  // user routes
  if (req.nextUrl.pathname.startsWith("/shop/user")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // login route
  if (req.nextUrl.pathname.startsWith("/shop/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
