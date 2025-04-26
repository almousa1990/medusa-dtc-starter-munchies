"use client";
import {useCheckout} from "@/components/context/checkout-context";
import {Cta} from "@/components/shared/button";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {useState} from "react";

import {cn} from "@merchify/ui";
import {initiatePaymentSession} from "@/actions/medusa/payment";
import {PaymentForm} from "@/components/shared/payment-form";

export default function Payment({active}: {active: boolean}) {
  const {cart, customer, paymentMethods, setStep} = useCheckout();

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (session: any) => session.status === "pending",
  );

  const activeProvider = paymentMethods.find(
    ({id}) => id === activeSession?.provider_id,
  );

  const activeSessionSource = activeSession?.data.source as {
    type: "creditcard" | "applepay";
    company: "mada" | "visa" | "master" | "amex";
  };

  const activeType =
    activeSessionSource.type === "creditcard"
      ? activeSessionSource.company === "mada"
        ? "mada"
        : "creditcard"
      : activeSessionSource.type === "applepay"
        ? "applepay"
        : undefined;

  const handleSubmit = async (source: "token" | "applepay", token: string) => {
    const created = await initiatePaymentSession({
      cart,
      input: {
        provider_id: "pp_moyasar_moyasar",
        data: {
          source: {
            type: source,
            token: token,
          },
        },
      },
    });

    console.log(created);

    if (created.status === "success" && created.redirect_url) {
      window.location.href = created.redirect_url; // <- Manual redirect
    } else {
      console.error("Payment initiation failed", created.error);
    }
  };

  return (
    <div
      onClick={() => (paymentMethods.length ? setStep("payment") : {})}
      className={cn({"cursor-pointer": !active})}
    >
      <div className="flex w-full flex-col gap-2 border-t py-4">
        <div className="flex h-10 items-center justify-between">
          <Heading
            desktopSize="xl"
            font="serif"
            mobileSize="xl"
            tag="h3"
            className={cn({"text-muted-foreground": !active})}
          >
            الدفع
          </Heading>
        </div>

        {active && (
          <PaymentForm
            type={activeType}
            customer={customer}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

function getMethodInfo(id?: string) {
  switch (id) {
    case "pp_system_default":
      return {id, name: "Testing method"};
    case "pp_stripe_stripe":
      return {id, name: "Stripe"};
    default:
      return {id, name: "Unknown"};
  }
}
