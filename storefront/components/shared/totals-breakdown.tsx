import type {HttpTypes} from "@medusajs/types";

import {convertToLocale} from "@/utils/medusa/money";

import Body from "./typography/body";
import {cn} from "@merchify/ui";
import {MerchifyOrder} from "@/types";

export function TotalsBreakdown({
  data,
  className,
  variant,
}: {
  data: HttpTypes.StoreCart | MerchifyOrder;
  className?: string;
  variant?: "default" | "small";
}) {
  const summaryItems = [
    {amount: data.original_item_subtotal, label: "مجموع المنتجات"},
    {amount: data.shipping_total, label: "الشحن"},
    ...(data.discount_total !== 0
      ? [{amount: -data.discount_total, label: "الخصم"}]
      : []),
    {amount: data.tax_total, label: "الضريبة"},
  ];

  const total = {amount: data.total, label: "الاجمالي"};

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {summaryItems.map((item) => (
        <TotalsItem
          size={variant == "small" ? "sm" : "base"}
          amount={item.amount}
          currency_code={data.currency_code}
          key={item.label}
          label={item.label}
        />
      ))}
      <GrandTotal
        size={variant == "small" ? "base" : "lg"}
        {...total}
        currency_code={data.currency_code}
      />
    </div>
  );
}
function GrandTotal({
  amount,
  currency_code,
  label,
  size,
}: {
  amount: number;
  currency_code: string;
  label: string;
  size: "base" | "lg";
}) {
  const display = convertToLocale({amount, currency_code});

  return (
    <div className="flex items-center justify-between">
      <Body desktopSize={size} className="font-medium" font="sans">
        {label}
      </Body>
      <Body mobileSize={size} className="font-medium" font="sans">
        {display}
      </Body>
    </div>
  );
}

function TotalsItem({
  amount,
  currency_code,
  label,
  size,
}: {
  amount: number;
  currency_code: string;
  label: string;
  size: "base" | "sm";
}) {
  const display = convertToLocale({amount, currency_code});

  return (
    <div className="flex items-center justify-between">
      <Body font="sans" mobileSize={size} className="text-muted-foreground">
        {label}
      </Body>
      <Body font="sans" mobileSize={size}>
        {display}
      </Body>
    </div>
  );
}
