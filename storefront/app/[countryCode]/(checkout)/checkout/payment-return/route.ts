import {placeOrder} from "@/actions/medusa/order";
import {getCart} from "@/data/medusa/cart";
import {NextRequest, NextResponse} from "next/server";

type Params = Promise<{cartId: string}>;

export async function GET(req: NextRequest, {params}: {params: Params}) {
  const {origin, searchParams} = req.nextUrl;

  // Get parameters from your payment provider's redirect
  const paymentId = searchParams.get("id");
  const status = searchParams.get("status"); // Assuming your provider returns a status
  const countryCode = searchParams.get("country_code") || "";

  // Retrieve the cart
  const cart = await getCart();

  if (!cart) {
    return NextResponse.redirect(`${origin}/${countryCode}`);
  }

  // Validate the payment session
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (payment) => payment.data.id === paymentId,
  );

  // Check if payment was successful based on your provider's response
  if (!paymentSession || !["success", "completed"].includes(status)) {
    return NextResponse.redirect(
      `${origin}/${countryCode}/checkout?step=payment&error=payment_failed`,
    );
  }

  // Complete the cart to create an order
  try {
    await placeOrder();
  } catch (err: any) {
    console.log(err);
  }
}
