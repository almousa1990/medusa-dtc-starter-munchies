import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";
import Image from "next/image";
import Heading from "@/components/shared/typography/heading";
import {Badge, cn} from "@merchify/ui";
import PrintfileLineItemPreviewer from "@/components/shared/printfile-line-item-previewer";
import {MerchifyOrderLineItem} from "@/types";

export default function OrderItem({
  item,
  currencyCode,
  className,
}: {
  item: MerchifyOrderLineItem;
  currencyCode: string;
  className?: string;
}) {
  const {
    unit_price,
    quantity,
    thumbnail,
    title,
    subtitle,
    product_subtitle,
    printfile_line_items,
  } = item;
  const price = convertToLocale({
    amount: unit_price * quantity,
    currency_code: currencyCode,
  });

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
            <Heading tag="h4" className="font-medium">
              {subtitle}
            </Heading>
            <Badge variant="secondary">{title}</Badge>
          </div>
          <Body className="text-muted-foreground mt-2 text-sm" as="p">
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
