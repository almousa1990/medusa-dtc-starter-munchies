"use client";
import {useEffect, useState, useTransition} from "react";

import {initiatePaymentSession} from "@/actions/medusa/order";
import {Cta} from "@/components/shared/button";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {useResetableActionState} from "@/hooks/use-resetable-action-state";
import {Indicator, Item, Root} from "@radix-ui/react-radio-group";

import PaymentButton from "./button";
import {isStripe as isStripeFunc} from "./utils";
import {useCheckout} from "@/components/context/checkout-context";

export default function Payment({active}: {active: boolean}) {
  const {cart, paymentMethods, setStep} = useCheckout();

  const [error, setError] = useState<null | string>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (session: any) => session.status === "pending",
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? paymentMethods[0].id,
  );

  const [, resetTransition] = useTransition();

  const isStripe = isStripeFunc(selectedPaymentMethod);
  const stripeReady = true;

  const [{status}, action, , reset] = useResetableActionState(
    initiatePaymentSession,
    {
      error: null,
      status: "idle",
    },
  );
  const [pending, startTransition] = useTransition();

  function initiatePayment() {
    startTransition(() => {
      action({
        cart,
        data: {
          provider_id: selectedPaymentMethod,
        },
      });
    });
  }

  useEffect(() => {
    if (status === "success") {
      setStep("review");
      resetTransition(() => reset());
    }
  }, [status, setStep, reset]);

  const activeMethod = paymentMethods.find(
    ({id}) => id === activeSession?.provider_id,
  );

  const isFilled = !!activeMethod && !active;
  const method = getMethodInfo(activeMethod?.id);

  return (
    <div className="flex w-full flex-col gap-2 border-t py-4">
      <div className="flex items-center justify-between">
        <Heading desktopSize="xl" font="serif" mobileSize="xl" tag="h3">
          طريقة الدفع
        </Heading>
        {isFilled && (
          <Cta onClick={() => setStep("payment")} size="sm" variant="outline">
            Edit
          </Cta>
        )}
      </div>

      {isFilled && (
        <div className="flex flex-1 flex-col gap-4">
          <Body className="font-semibold" font="sans">
            Method
          </Body>
          <Body font="sans">{method.name}</Body>
        </div>
      )}

      {active && (
        <Root
          className="flex w-full flex-col gap-4"
          defaultValue={selectedPaymentMethod}
          name="shippingMethodId"
          onValueChange={(v) => setSelectedPaymentMethod(v)}
        >
          {paymentMethods.map((item) => {
            return (
              <Item
                className="border-accent data-[state=checked]:bg-accent data-[state=checked]:text-background flex w-full items-center justify-between gap-[10px] rounded-lg border-[1.5px] px-[32px] py-[19px]"
                key={item.id}
                value={item.id}
              >
                <div className="border-accent size-4 rounded-full border">
                  <Indicator id={item.id}>
                    <div className="border-background size-4 rounded-full border-[4px]" />
                  </Indicator>
                </div>
                <div className="flex w-full items-center justify-between">
                  <Body font="sans">{getMethodInfo(item.id).name}</Body>
                </div>
              </Item>
            );
          })}

          {isStripe && stripeReady ? (
            <PaymentButton cart={cart} disabled={!cardComplete} />
          ) : (
            <Cta
              loading={pending}
              onClick={initiatePayment}
              size="sm"
              type="submit"
            >
              {isStripe ? "Add card details" : "Continue to review"}
            </Cta>
          )}
        </Root>
      )}
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
