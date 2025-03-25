import type {HttpTypes} from "@medusajs/types";

import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {convertToLocale} from "@/utils/medusa/money";

export function CartSummary({cart}: {cart: HttpTypes.StoreCart}) {
  console.log(cart);
  const summaryItems = [
    {amount: cart.original_item_subtotal, label: "مجموع المنتجات"},
    {amount: cart.shipping_total, label: "الشحن"},
    {amount: -cart.discount_total, label: "الخصم"},
    {amount: cart.tax_total, label: "الضريبة"},
  ];

  const total = {amount: cart.total, label: "الاجمالي", type: "total"};

  return (
    <>
      {summaryItems.map((item) => (
        <CartSummaryItem
          amount={item.amount}
          currency_code={cart.currency_code}
          key={item.label}
          label={item.label}
        />
      ))}
      <CartTotal {...total} currency_code={cart.currency_code} />
    </>
  );
}

export function CartSummaryItem({
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

export function CartTotal({
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
