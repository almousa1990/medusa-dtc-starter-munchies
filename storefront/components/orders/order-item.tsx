import type {MerchifyOrderLineItem} from "@/types";

import PrintfileLineItemPreviewer from "@/components/shared/printfile-line-item-previewer";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {convertToLocale} from "@/utils/medusa/money";
import {Badge, cn} from "@merchify/ui";
import Image from "next/image";

export default function OrderItem({
  className,
  currencyCode,
  item,
}: {
  className?: string;
  currencyCode: string;
  item: MerchifyOrderLineItem;
}) {
  const {
    printfile_line_items,
    product_subtitle,
    quantity,
    subtitle,
    thumbnail,
    title,
    unit_price,
  } = item;

  const unit_price_to_locale = convertToLocale({
    amount: unit_price,
    currency_code: currencyCode,
  });

  const image = thumbnail;
  const alt = title ?? subtitle;

  return (
    <div className={cn("flex-cols-2 flex gap-x-6", className)}>
      {image && (
        <Image
          alt={alt}
          className="bg-accent size-20 flex-none rounded-md object-cover sm:size-40"
          height={160}
          src={image}
          width={160}
        />
      )}
      <div className="flex flex-1 flex-col">
        <div>
          <div className="flex gap-2">
            <Heading className="font-medium" tag="h4">
              {subtitle}
            </Heading>
            <Badge variant="secondary">{title}</Badge>
          </div>
          <Body as="p" className="text-muted-foreground mt-2 text-sm">
            {product_subtitle}
          </Body>
        </div>
        <div className="mt-2">
          <PrintfileLineItemPreviewer
            currencyCode={currencyCode}
            items={printfile_line_items}
          />
        </div>
        <div className="mt-6 flex flex-1 items-end">
          <dl className="divide-border flex divide-x">
            <div className="flex pl-4 sm:pl-6">
              <Body as="dt" className="font-medium" mobileSize="sm">
                الكمية
              </Body>
              <Body as="dd" className="mr-2" mobileSize="sm">
                {quantity}
              </Body>
            </div>
            <div className="flex pr-4 sm:pr-6">
              <Body as="dt" className="font-medium" mobileSize="sm">
                سعر الوحدة
              </Body>

              <Body as="dd" className="mr-2" mobileSize="sm">
                {unit_price_to_locale}
              </Body>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
