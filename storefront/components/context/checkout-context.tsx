"use client";
import type {
  StoreCart,
  StoreCartShippingOption,
  StoreCustomer,
  StorePaymentProvider,
} from "@medusajs/types";

import {createContext, useContext, useState} from "react";

interface CheckoutContextType {
  cart: StoreCart;
  customer: StoreCustomer;
  paymentMethods: StorePaymentProvider[];
  setStep: (step: CheckoutContextType["step"]) => void;
  shippingMethods: StoreCartShippingOption[];
  step: "addresses" | "delivery" | "payment" | "review";
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
    initialStep?: CheckoutContextType["step"];
  } & Omit<CheckoutContextType, "setStep" | "step">;
}) => {
  const initialStep: CheckoutContextType["step"] = (() => {
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

    return "addresses";
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
