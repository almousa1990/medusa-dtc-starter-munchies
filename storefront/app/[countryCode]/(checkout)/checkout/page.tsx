import type {PageProps} from "@/types";
import type {HttpTypes} from "@medusajs/types";

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
import LocalizedLink from "@/components/shared/localized-link";
import Body from "@/components/shared/typography/body";

export default async function CheckoutPage(props: PageProps<"countryCode">) {
  const params = await props.params;

  const {countryCode} = params;

  const cart = await getCart();
  const customer = await getCustomer();

  if (!customer || !cart || (cart.items?.length || 0) === 0) {
    return redirect(`/${countryCode}/`);
  }

  if (cart?.items?.length) {
    cart.items = (await enrichLineItems(
      cart.items,
      cart.region_id,
    )) as HttpTypes.StoreCartLineItem[];
  }

  const shippingMethods = (await listCartShippingMethods(cart.id)) || [];
  const paymentMethods = (await listCartPaymentMethods(cart.region_id!)) || [];

  return (
    <>
      <div className="px-4 py-6 sm:px-6 lg:hidden">
        <div className="mx-auto flex max-w-lg justify-center">
          <LocalizedLink href="/" prefetch>
            <img
              alt="Mubchies logo"
              className="h-[22px] w-fit lg:h-8"
              src="/images/logo.svg"
            />
          </LocalizedLink>
        </div>
      </div>
      <section
        aria-labelledby="checkout-summary"
        className="bg-secondary mb-4 flex w-full flex-col p-4 lg:mb-0 lg:max-w-[420px]"
      >
        <CartDetails cart={cart} />
      </section>
      <section aria-labelledby="checkout-form" className="w-full px-4 lg:px-8">
        <div className="hidden py-8 lg:block">
          <LocalizedLink href="/" prefetch>
            <img
              alt="Mubchies logo"
              className="h-6 w-fit"
              src="/images/logo.svg"
            />
          </LocalizedLink>
        </div>
        <CheckoutForm
          cart={cart}
          customer={customer}
          paymentMethods={paymentMethods}
          shippingMethods={shippingMethods}
        />
      </section>
    </>
  );
}
