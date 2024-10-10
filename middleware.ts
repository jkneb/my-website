import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Optionally, check for additional conditions in the decodedToken
  // For example, checking if the user has the required role

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/users/:path*", "/api/projects/:path*"],
};
