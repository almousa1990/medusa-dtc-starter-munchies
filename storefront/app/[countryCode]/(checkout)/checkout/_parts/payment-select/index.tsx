"use client";

import type {ReactNode} from "react";

import {CreditCardForm} from "@/components/shared/credit-card-form";
import Icon from "@/components/shared/icon";
import {PaymentSourceType} from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  Label,
  RadioGroup,
  RadioGroupItem,
  cn,
} from "@merchify/ui";
import {useEffect, useState} from "react";

interface PaymentSelectProps {
  onValueChange: (value: string) => void;
  value?: PaymentSourceType;
}

export default function PaymentSelect(props: PaymentSelectProps) {
  const {onValueChange, value} = props;

  const [canUseApplePay, setCanUseApplePay] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ApplePaySession) {
      setCanUseApplePay(true);
    }
  }, []);
  console.log("value", value);

  return (
    <Accordion className="grid gap-6" collapsible type="single" value={value}>
      <RadioGroup
        className="gap-0"
        defaultValue={value}
        dir="rtl"
        onValueChange={onValueChange}
        value={value}
      >
        <PaymentOption
          icons={["Mada", "Visa", "Mastercard", "Amex"]}
          label="الدفع بالبطاقة الإئتمانية أو مدى"
          selected={value == PaymentSourceType.CreditCard}
          value={PaymentSourceType.CreditCard}
        >
          <CreditCardForm className="py-2" />
        </PaymentOption>

        {canUseApplePay && (
          <PaymentOption
            icons={["ApplePay"]}
            label="الدفع باستخدام Apple Pay"
            selected={value == PaymentSourceType.ApplePay}
            value={PaymentSourceType.ApplePay}
          />
        )}
      </RadioGroup>
    </Accordion>
  );
}

interface PaymentOptionProps {
  children?: ReactNode;
  icons: ("Amex" | "ApplePay" | "Mada" | "Mastercard" | "Visa")[];
  label: string;
  selected: boolean;
  value: string;
}

function PaymentOption({
  children,
  icons,
  label,
  selected,
  value,
}: PaymentOptionProps) {
  return (
    <AccordionItem
      className={cn(
        "-mt-px overflow-hidden border first:rounded-t-md last:rounded-b-md",
        {
          "bg-muted border-primary relative z-10": selected,
        },
      )}
      value={value}
    >
      <div className="flex w-full items-center gap-3 p-4">
        <RadioGroupItem aria-label={label} id={value} value={value} />
        <Label className="flex-1" htmlFor={value}>
          {label}
        </Label>
        <div className="flex gap-2">
          {icons.map((icon, index) => (
            <Icon className="h-4" key={index} name={icon} />
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
