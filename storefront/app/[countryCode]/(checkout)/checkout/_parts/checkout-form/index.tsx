"use client";
import {useCheckout} from "@/components/context/checkout-context";
import Heading from "@/components/shared/typography/heading";

import Address from "./address";
import Delivery from "./delivery";
import Payment from "./payment";

export default function CheckoutForm() {
  const {shippingMethods, step} = useCheckout();

  return (
    <div className="mx-auto max-w-lg lg:max-w-none">
      <Heading className="sr-only" tag="h1">
        إتمام الطلب
      </Heading>

      <Address active={step === "address"} />

      {shippingMethods.length > 0 && <Delivery active={step === "delivery"} />}

      <Payment active={step === "payment"} />
    </div>
  );
}
