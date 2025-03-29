"use client";
import type {HttpTypes} from "@medusajs/types";

import {Cta} from "@/components/shared/button";
import PromotionForm from "@/components/shared/promotion-form";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {convertToLocale} from "@/utils/medusa/money";
import {Label, cn} from "@merchify/ui";
import {useState} from "react";

import LineItem from "./line-item";
import {ChevronDown, ChevronUp} from "lucide-react";

export default function CartDetails({cart}: {cart: HttpTypes.StoreCart}) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between lg:block">
        <Heading
          className="lg:sr-only"
          desktopSize="xl"
          font="serif"
          mobileSize="lg"
          tag="h3"
        >
          تفاصيل الطلب
        </Heading>
        <Cta
          className="lg:hidden"
          onClick={() => setShowDetails((prev) => !prev)}
          size="sm"
          variant="ghost"
        >
          {showDetails ? <ChevronUp /> : <ChevronDown />}
        </Cta>
      </div>

      <div
        data-state={showDetails ? "open" : "closed"}
        className={cn(
          "overflow-y-clip transition-all duration-300 ease-in-out",
          "data-[state=closed]:max-h-0 data-[state=open]:max-h-[1000px]",
          "lg:max-h-fit lg:overflow-visible",
        )}
      >
        <div className="flex flex-col gap-8">
          <div className="mt-2 flex flex-col gap-4">
            {cart.items?.map((item) => <LineItem key={item.id} {...item} />)}
          </div>
          <div className="flex flex-col gap-2">
            <Label>هل لديك كود خصم؟</Label>
            <PromotionForm cart={cart} />
          </div>
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </>
  );
}

export function CheckoutSummary({cart}: {cart: HttpTypes.StoreCart}) {
  const summaryItems = [
    {amount: cart.original_item_subtotal, label: "مجموع المنتجات"},
    {amount: cart.shipping_total, label: "الشحن"},
    {amount: -cart.discount_total, label: "الخصم"},
    {amount: cart.tax_total, label: "الضريبة"},
  ];

  const total = {amount: cart.total, label: "الاجمالي", type: "total"};

  return (
    <div className="flex flex-col gap-2">
      {summaryItems.map((item) => (
        <CheckoutSummaryItem
          amount={item.amount}
          currency_code={cart.currency_code}
          key={item.label}
          label={item.label}
        />
      ))}
      <CheckoutTotal {...total} currency_code={cart.currency_code} />
    </div>
  );
}

export function CheckoutSummaryItem({
  amount,
  currency_code,
  label,
}: {
  amount: number;
  currency_code: string;
  label: string;
}) {
  const display = convertToLocale({
    amount,
    currency_code: currency_code,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Body font="sans" mobileSize="base">
          {label}
        </Body>

        <Body font="sans" mobileSize="base">
          {display}
        </Body>
      </div>
    </>
  );
}

export function CheckoutTotal({
  amount,
  currency_code,
  label,
}: {
  amount: number;
  currency_code: string;
  label: string;
}) {
  const display = convertToLocale({
    amount,
    currency_code: currency_code,
  });

  return (
    <>
      <div className="bg-accent h-px w-full" />
      <div className="flex items-center justify-between">
        <Heading desktopSize="lg" font="sans" mobileSize="xl" tag="h3">
          {label}
        </Heading>

        <Heading desktopSize="lg" font="sans" mobileSize="xl" tag="h3">
          {display}
        </Heading>
      </div>
    </>
  );
}
