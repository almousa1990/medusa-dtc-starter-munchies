"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  cn,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@merchify/ui";
import {ReactNode, useEffect, useState} from "react";
import {StoreCustomer} from "@medusajs/types";
import {CreditCardForm} from "@/components/shared/credit-card-form";
import Icon from "@/components/shared/icon";
import {PaymentSourceType} from "@/types";

interface PaymentSelectProps {
  customer: StoreCustomer;
  value?: PaymentSourceType;
  onValueChange: (value: string) => void;
}

export default function PaymentSelect(props: PaymentSelectProps) {
  const {customer, value, onValueChange} = props;

  const [canUseApplePay, setCanUseApplePay] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ApplePaySession) {
      setCanUseApplePay(true);
    }
  }, []);
  console.log("value", value);

  return (
    <Accordion type="single" value={value} collapsible className="grid gap-6">
      <RadioGroup
        defaultValue={value}
        dir="rtl"
        className="gap-0"
        value={value}
        onValueChange={onValueChange}
      >
        <PaymentOption
          selected={value == PaymentSourceType.CreditCard}
          value={PaymentSourceType.CreditCard}
          label="الدفع بالبطاقة الإئتمانية أو مدى"
          icons={["Mada", "Visa", "Mastercard", "Amex"]}
        >
          <CreditCardForm className="py-2" />
        </PaymentOption>

        {canUseApplePay && (
          <PaymentOption
            selected={value == PaymentSourceType.ApplePay}
            value={PaymentSourceType.ApplePay}
            label="الدفع باستخدام Apple Pay"
            icons={["ApplePay"]}
          />
        )}
      </RadioGroup>
    </Accordion>
  );
}

interface PaymentOptionProps {
  value: string;
  selected: boolean;
  label: string;
  icons: ("Mada" | "ApplePay" | "Visa" | "Amex" | "Mastercard")[];
  children?: ReactNode;
}

function PaymentOption({
  value,
  label,
  icons,
  selected,
  children,
}: PaymentOptionProps) {
  return (
    <AccordionItem
      value={value}
      className={cn(
        "-mt-px overflow-hidden border first:rounded-t-md last:rounded-b-md",
        {
          "bg-muted border-primary relative z-10": selected,
        },
      )}
    >
      <div className="flex w-full items-center gap-3 p-4">
        <RadioGroupItem value={value} id={value} aria-label={label} />
        <Label htmlFor={value} className="flex-1">
          {label}
        </Label>
        <div className="flex gap-2">
          {icons.map((icon, index) => (
            <Icon name={icon} key={index} className="h-4" />
          ))}
        </div>
      </div>
      {children && (
        <AccordionContent className="bg-background border-primary border-t p-4">
          {children}
        </AccordionContent>
      )}
    </AccordionItem>
  );
}
