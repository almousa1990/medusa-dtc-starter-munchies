"use client";
import type {
  StoreCart,
  StoreCartShippingOption,
  StoreCustomer,
  StorePaymentProvider,
} from "@medusajs/types";
import {useToast} from "@merchify/ui";

import {createContext, useContext, useEffect, useState} from "react";

export type CheckoutStep = "address" | "delivery" | "payment" | "review";

interface CheckoutContextType {
  cart: StoreCart;
  error: string;
  customer: StoreCustomer;
  paymentMethods: StorePaymentProvider[];
  setStep: (step: CheckoutContextType["step"]) => void;
  shippingMethods: StoreCartShippingOption[];
  step: CheckoutStep;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context)
    throw new Error("useCheckout must be used within a CheckoutProvider");
  return context;
};

export const CheckoutProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: {
    error?: string;
    initialStep?: CheckoutContextType["step"];
  } & Omit<CheckoutContextType, "setStep" | "step">;
}) => {
  const {toast} = useToast();

  useEffect(() => {
    if (!value.error) return;

    const timeout = setTimeout(() => {
      toast({
        description: value.error,
        variant: "destructive",
      });
    }, 0);

    return () => clearTimeout(timeout);
  }, [value.error, toast]);

  const initialStep: CheckoutContextType["step"] = (() => {
    if (value.initialStep) {
      return value.initialStep;
    }
    const shippingSet = !!value.cart.shipping_address?.address_1;
    const shippingMethodsAvailable = value.shippingMethods.length > 0;
    const shippingMethodSelected = !!value.cart.shipping_methods?.[0];

    if (shippingSet) {
      if (shippingMethodsAvailable) {
        return shippingMethodSelected ? "payment" : "delivery";
      } else {
        return "payment";
      }
    }

    return "address";
  })();

  const [step, setStep] = useState<CheckoutContextType["step"]>(initialStep);

  return (
    <CheckoutContext.Provider
      value={{
        ...value,
        setStep,
        step,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
