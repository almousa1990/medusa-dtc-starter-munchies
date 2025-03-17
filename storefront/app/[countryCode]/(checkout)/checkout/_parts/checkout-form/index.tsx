"use client";
import type {
  StoreCart,
  StoreCartShippingOption,
  StoreCustomer,
  StorePaymentProvider,
} from "@medusajs/types";

import Heading from "@/components/shared/typography/heading";
import {useState} from "react";

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

  return (
    <div className="w-full">
      <Heading desktopSize="2xl" font="serif" mobileSize="xl" tag="h3">
        Checkout
      </Heading>
      <Address
        customer={customer}
        active={step === "addresses"}
        cart={cart}
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
    </div>
  );
}
