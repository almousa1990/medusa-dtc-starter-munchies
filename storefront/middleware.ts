import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {getCustomer} from "./data/medusa/customer";

export async function middleware(request: NextRequest) {
  // Retrieve the `_medusa_jwt` token from cookies
  const customer = await getCustomer();

  // If no token is found, redirect to the login page
  if (
    !customer &&
    (request.nextUrl.pathname.startsWith("/account") ||
      request.nextUrl.pathname.startsWith("/checkout"))
  ) {
    // Redirect to auth page with intended destination as a search param
    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("redirectTo", request.nextUrl.pathname);

    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*"],
};
