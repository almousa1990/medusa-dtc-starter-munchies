"use client";

import {Label, RadioGroup, RadioGroupItem} from "@merchify/ui";
import {useEffect, useState} from "react";
import Icon from "./icon";
import {CreditCardForm} from "./credit-card-form";
import {ApplePayForm} from "./apple-pay-form";
import {StoreCustomer} from "@medusajs/types";

interface PaymentFormProps {
  customer: StoreCustomer;
  type?: "mada" | "applepay" | "creditcard";
  onSubmit: (source: "token" | "applepay", token: string) => void;
}

export function PaymentForm(props: PaymentFormProps) {
  const {customer, type, onSubmit} = props;
  const [paymentMethod, setPaymentMethod] = useState(
    (type as string) ?? "mada",
  );
  const [canUseApplePay, setCanUseApplePay] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ApplePaySession) {
      setCanUseApplePay(true);
    }
  }, []);
  return (
    <div className="grid gap-6">
      <RadioGroup
        defaultValue={type}
        dir="rtl"
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="grid grid-cols-3 gap-4"
      >
        <PaymentOption value="mada" label="مدى" icon="Mada" />
        <PaymentOption
          value="creditcard"
          label="البطاقة الائتمانية"
          icon="CreditCard"
        />
        {canUseApplePay && (
          <PaymentOption value="applepay" label="آبل باي" icon="ApplePay" />
        )}
      </RadioGroup>

      {["creditcard", "mada"].includes(paymentMethod) && (
        <CreditCardForm
          customer={customer}
          onTokenCreated={(token) => onSubmit("token", token)}
        />
      )}
      {paymentMethod === "apple" && (
        <ApplePayForm
          customer={customer}
          onTokenCreated={(token) => onSubmit("applepay", token)}
        />
      )}
    </div>
  );
}

interface PaymentOptionProps {
  value: string;
  label: string;
  icon: "Mada" | "ApplePay" | "CreditCard";
}

function PaymentOption({value, label, icon}: PaymentOptionProps) {
  return (
    <div>
      <RadioGroupItem
        value={value}
        id={value}
        className="peer sr-only"
        aria-label={label}
      />
      <Label
        htmlFor={value}
        className="border-muted peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex flex-col items-center justify-between rounded-md border-2 bg-transparent p-4"
      >
        <Icon name={icon} className="h-6" />
        <span className="sr-only">{label}</span>
      </Label>
    </div>
  );
}
