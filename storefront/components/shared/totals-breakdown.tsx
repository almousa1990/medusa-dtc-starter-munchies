import type {HttpTypes} from "@medusajs/types";

import {convertToLocale} from "@/utils/medusa/money";

import Body from "./typography/body";
import Heading from "./typography/heading";

export function TotalsBreakdown({
  data,
}: {
  data: HttpTypes.StoreCart | HttpTypes.StoreOrder;
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
    <div className="flex flex-col gap-2">
      {summaryItems.map((item) => (
        <TotalsItem
          amount={item.amount}
          currency_code={data.currency_code}
          key={item.label}
          label={item.label}
        />
      ))}
      <GrandTotal {...total} currency_code={data.currency_code} />
    </div>
  );
}
function GrandTotal({
  amount,
  currency_code,
  label,
}: {
  amount: number;
  currency_code: string;
  label: string;
}) {
  const display = convertToLocale({amount, currency_code});

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

function TotalsItem({
  amount,
  currency_code,
  label,
}: {
  amount: number;
  currency_code: string;
  label: string;
}) {
  const display = convertToLocale({amount, currency_code});

  return (
    <div className="flex items-center justify-between">
      <Body font="sans" mobileSize="base">
        {label}
      </Body>
      <Body font="sans" mobileSize="base">
        {display}
      </Body>
    </div>
  );
}
