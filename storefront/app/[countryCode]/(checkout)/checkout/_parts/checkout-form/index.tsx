"use client";
import type {
  StoreCart,
  StoreCartShippingOption,
  StoreCustomer,
  StorePaymentProvider,
} from "@medusajs/types";

import Heading from "@/components/shared/typography/heading";
import {useEffect, useState} from "react";

import Address from "./address";
import Delivery from "./delivery";
import Payment from "./payment";
import Review from "./review";

export default function CheckoutForm({
  cart,
  customer,
  paymentMethods,
  shippingMethods,
}: {
  cart: StoreCart;
  customer: StoreCustomer;
  paymentMethods: StorePaymentProvider[];
  shippingMethods: StoreCartShippingOption[];
}) {
  const [step, setStep] = useState<
    "addresses" | "delivery" | "payment" | "review"
  >("addresses");

  useEffect(() => {
    // Determine the correct current step
    if (cart.shipping_address?.address_1) {
      if (shippingMethods.length > 0) {
        if (cart.shipping_methods?.[0]) {
          setStep("payment");
        } else {
          setStep("delivery");
        }
      } else {
        setStep("payment");
      }
    } else {
      setStep("addresses");
    }
  }, [cart, shippingMethods]);

  return (
    <>
      <Heading className="sr-only" tag="h1">
        إتمام الطلب
      </Heading>
      <Address
        active={step === "addresses"}
        cart={cart}
        customer={customer}
        nextStep={shippingMethods.length > 0 ? "delivery" : "payment"}
        setStep={setStep}
      />
      {shippingMethods.length > 0 && (
        <Delivery
          active={step === "delivery"}
          cart={cart}
          currency_code={cart.currency_code}
          methods={shippingMethods}
          setStep={setStep}
        />
      )}
      <Payment
        active={step === "payment"}
        cart={cart}
        methods={paymentMethods}
        setStep={setStep}
      />
      <Review active={step === "review"} cart={cart} />
    </>
  );
}
