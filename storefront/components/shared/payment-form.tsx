"use client";

import {cn, Label, RadioGroup, RadioGroupItem} from "@merchify/ui";
import {ReactNode, useEffect, useState} from "react";
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
        className="divide-y border"
        value={paymentMethod}
        onValueChange={setPaymentMethod}
      >
        <PaymentOption
          selected={paymentMethod == "mada"}
          value="mada"
          label="مدى"
          icon="Mada"
        >
          <CreditCardForm
            customer={customer}
            onTokenCreated={(token) => onSubmit("token", token)}
          />
        </PaymentOption>
        <PaymentOption
          selected={paymentMethod == "creditcard"}
          value="creditcard"
          label="البطاقة الائتمانية"
          icon="CreditCard"
        >
          <CreditCardForm
            customer={customer}
            onTokenCreated={(token) => onSubmit("token", token)}
          />
        </PaymentOption>
        {/*<PaymentOption
          value="creditcard"
          label="البطاقة الائتمانية"
          icon="CreditCard"
        />
        {canUseApplePay && (
          <PaymentOption value="applepay" label="آبل باي" icon="ApplePay" />
        )}*/}
      </RadioGroup>

      {paymentMethod === "applepay" && (
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
  selected: boolean;
  label: string;
  icon: "Mada" | "ApplePay" | "CreditCard";
  children: ReactNode;
}

function PaymentOption({
  value,
  label,
  icon,
  selected,
  children,
}: PaymentOptionProps) {
  return (
    <div className="bg-transparent p-4">
      <RadioGroupItem value={value} id={value} aria-label={label} />
      <Label htmlFor={value} className="">
        <Icon name={icon} className="h-6" />
        <span className="sr-only">{label}</span>
      </Label>
      <div className={cn({hidden: !selected})}>{children}</div>
    </div>
  );
}
