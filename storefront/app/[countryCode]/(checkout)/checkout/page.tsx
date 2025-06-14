import type {
  CheckoutStep} from "@/components/context/checkout-context";
import type {MerchifyCartLineItem, PageProps} from "@/types";

import {
  CheckoutProvider
} from "@/components/context/checkout-context";
import {getCart} from "@/data/medusa/cart";
import {getCustomer} from "@/data/medusa/customer";
import {
  listCartPaymentMethods,
  listCartShippingMethods,
} from "@/data/medusa/fullfilment";
import {enrichLineItems} from "@/data/medusa/line-items";
import {redirect} from "next/navigation";

import CartDetails from "./_parts/cart-details";
import CheckoutForm from "./_parts/checkout-form";

export default async function CheckoutPage(
  props: PageProps<"countryCode", "message" | "status" | "step">,
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const step = searchParams.step as CheckoutStep;

  const status = searchParams.status as string;
  const message = searchParams.message as string;

  const {countryCode} = params;

  const cart = await getCart();
  const customer = await getCustomer();

  console.log("customer", customer);

  if (!customer || !cart || (cart.items?.length || 0) === 0) {
    return redirect(`/${countryCode}/`);
  }

  if (cart?.items?.length) {
    cart.items = (await enrichLineItems(
      cart.items,
      cart.region_id,
    )) as MerchifyCartLineItem[];
  }

  const shippingMethods = (await listCartShippingMethods(cart.id)) || [];
  const paymentMethods = (await listCartPaymentMethods(cart.region_id!)) || [];

  const callbackPayload = status ? {message, status} : undefined;
  return (
    <CheckoutProvider
      value={{
        callbackPayload,
        cart,
        customer,
        initialStep: step,
        paymentMethods,
        shippingMethods,
      }}
    >
      <section
        aria-labelledby="checkout-summary"
        className="bg-accent border-b px-4 py-4 lg:col-start-2 lg:row-start-1 lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-6 lg:pt-16 lg:pb-16"
      >
        <CartDetails cart={cart} />
      </section>
      <section
        aria-labelledby="checkout-form"
        className="px-4 pt-16 pb-36 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16"
      >
        <CheckoutForm />
      </section>
    </CheckoutProvider>
  );
}
