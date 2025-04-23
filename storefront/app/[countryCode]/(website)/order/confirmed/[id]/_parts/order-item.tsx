import type {StoreOrderLineItem} from "@medusajs/types";

import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";
import Image from "next/image";

export default function OrderItem({
  currency_code,
  product,
  product_title,
  quantity,
  thumbnail,
  unit_price,
  variant,
  variant_title,
}: {currency_code: string} & StoreOrderLineItem) {
  const price = convertToLocale({
    amount: unit_price * quantity,
    currency_code: currency_code,
  });

  const unit_price_to_locale = convertToLocale({
    amount: unit_price,
    currency_code: currency_code,
  });

  const image = thumbnail ?? product?.images?.[0]?.url;
  const alt = product_title ?? "" + variant_title ?? "";

  return (
    <div className="flex w-full gap-2">
      {image && (
        <Image
          alt={alt}
          className="border-accent aspect-square h-[100px] w-[100px] rounded-lg border-[1.5px]"
          height={100}
          src={image}
          width={100}
        />
      )}
      <div className="flex w-full flex-col justify-between">
        <div className="flex justify-between gap-8">
          <div className="flex flex-col items-start justify-start gap-1">
            <Body className="font-semibold" font="sans" mobileSize="lg">
              {product?.title}
            </Body>
            <Body className="font-medium" font="sans" mobileSize="sm">
              {variant?.title}
            </Body>
          </div>
          <div className="flex flex-col items-end justify-end gap-1">
            <Body
              className="opacity-80"
              dir="ltr"
              font="sans"
              mobileSize="base"
            >
              {quantity} x {unit_price_to_locale}
            </Body>
            <Body font="sans" mobileSize="base">
              {price}
            </Body>
          </div>
        </div>
      </div>
    </div>
  );
}
