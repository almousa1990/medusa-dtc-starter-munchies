import type {NextRequest} from "next/server";

import {placeOrder} from "@/actions/medusa/order";
import {getCart} from "@/data/medusa/cart";
import {NextResponse} from "next/server";

type Params = Promise<{cart_id: string}>;

export async function GET(req: NextRequest, {params}: {params: Params}) {
  const {origin, searchParams} = req.nextUrl;
  const {cart_id} = await params;

  const id = searchParams.get("id");

  const redirectStatus = searchParams.get("status") || "";
  const redirectMessage = searchParams.get("message") || "";

  const countryCode = searchParams.get("country_code");

  const cart = await getCart(cart_id);

  if (!cart) {
    return NextResponse.redirect(`${origin}/${countryCode}`);
  }

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (payment) => payment.data.id === id,
  );

  if (
    !paymentSession ||
    !["authorized", "captured", "paid"].includes(redirectStatus) ||
    !["authorized", "captured", "pending"].includes(paymentSession.status)
  ) {
    console.log("redirect to failure");

    return NextResponse.redirect(
      `${origin}/checkout?status=${redirectStatus}&message=${redirectMessage}`,
    );
  }

  console.log("place order again");

  await placeOrder(cart_id);

  return NextResponse.redirect(`${origin}`);
}
