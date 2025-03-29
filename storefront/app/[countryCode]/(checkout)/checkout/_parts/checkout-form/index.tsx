"use client";
import Heading from "@/components/shared/typography/heading";

import Address from "./address";
import Delivery from "./delivery";
import Payment from "./payment";
import Review from "./review";
import {useCheckout} from "@/components/context/checkout-context";

export default function CheckoutForm() {
  const {step, shippingMethods} = useCheckout();

  return (
    <>
      <Heading className="sr-only" tag="h1">
        إتمام الطلب
      </Heading>

      <Address active={step === "addresses"} />

      {shippingMethods.length > 0 && <Delivery active={step === "delivery"} />}

      <Payment active={step === "payment"} />
      <Review active={step === "review"} />
    </>
  );
}
