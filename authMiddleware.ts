import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isAdmin = req.cookies.get("isAdmin")?.value;

  // Redirect users to login if trying to access /dashboard without admin privileges
  if (req.nextUrl.pathname.startsWith("/dashboard") && isAdmin !== "true") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Specify the routes to apply middleware
export const config = {
  matcher: ["/dashboard/:path*"], 
};
