import type {StoreOrderLineItem} from "@medusajs/types";

import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";
import Image from "next/image";
import Heading from "@/components/shared/typography/heading";
import {Badge} from "@merchify/ui";
import PrintfileLineItemPreviewer from "@/components/shared/printfile-line-item-previewer";

export default function OrderItem({
  currency_code,
  product,
  product_title,
  quantity,
  thumbnail,
  unit_price,
  variant,
  variant_title,
  printfile_line_items,
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
    <div className="flex-cols-2 flex gap-x-6 border-b py-10">
      {image && (
        <Image
          alt={alt}
          className="bg-secondary size-20 flex-none rounded-md object-cover sm:size-40"
          height={160}
          src={image}
          width={160}
        />
      )}
      <div className="flex flex-1 flex-col">
        <div>
          <div className="flex gap-2">
            <Heading tag="h4" className="font-medium">
              {product?.title}
            </Heading>
            <Badge variant="secondary">{variant?.title}</Badge>
          </div>
          <Body className="text-muted-foreground mt-2 text-sm" as="p">
            {product?.subtitle}
          </Body>
        </div>
        <div className="mt-2">
          <PrintfileLineItemPreviewer
            currencyCode={currency_code}
            items={printfile_line_items}
          />
        </div>
        <div className="mt-6 flex flex-1 items-end">
          <dl className="divide-border flex divide-x">
            <div className="flex pl-4 sm:pl-6">
              <Body className="font-medium" mobileSize="sm" as="dt">
                الكمية
              </Body>
              <Body className="mr-2" mobileSize="sm" as="dd">
                {quantity}
              </Body>
            </div>
            <div className="flex pr-4 sm:pr-6">
              <Body className="font-medium" mobileSize="sm" as="dt">
                سعر الوحدة
              </Body>

              <Body className="mr-2" mobileSize="sm" as="dd">
                {unit_price_to_locale}
              </Body>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
