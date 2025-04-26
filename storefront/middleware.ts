import {NextResponse, type NextRequest} from "next/server";
import {getCustomer} from "./data/medusa/customer";

export async function middleware(request: NextRequest) {
  const customer = await getCustomer();
  const response = NextResponse.next();

  const {pathname} = request.nextUrl;

  const isAccountOrCheckout =
    pathname.startsWith("/account") ||
    (pathname.startsWith("/checkout") &&
      pathname !== "/checkout/payment-return");

  if (!customer && isAccountOrCheckout) {
    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(authUrl);
  }

  return response;
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/editor/:path*"],
};
