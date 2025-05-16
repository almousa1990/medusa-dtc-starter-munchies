import type {MerchifyOrder} from "@/types";
import type {HttpTypes} from "@medusajs/types";

import {convertToLocale} from "@/utils/medusa/money";
import {cn} from "@merchify/ui";

import Body from "./typography/body";

export function TotalsBreakdown({
  className,
  data,
  variant,
}: {
  className?: string;
  data: HttpTypes.StoreCart | MerchifyOrder;
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
          amount={item.amount}
          currency_code={data.currency_code}
          key={item.label}
          label={item.label}
          size={variant == "small" ? "sm" : "base"}
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
      <Body className="font-medium" desktopSize={size} font="sans">
        {label}
      </Body>
      <Body className="font-medium" font="sans" mobileSize={size}>
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
      <Body className="text-muted-foreground" font="sans" mobileSize={size}>
        {label}
      </Body>
      <Body font="sans" mobileSize={size}>
        {display}
      </Body>
    </div>
  );
}
