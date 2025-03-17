import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

export function middleware(request: NextRequest) {
  // Retrieve the `_medusa_jwt` token from cookies
  const medusaToken = request.cookies.get("_medusa_jwt")?.value;

  // If no token is found, redirect to the login page
  if (!medusaToken && request.nextUrl.pathname.startsWith("/account")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

// Apply middleware only to `/account/*` routes
export const config = {
  matcher: ["/account/:path*"], // Protects all routes under `/account`
};
