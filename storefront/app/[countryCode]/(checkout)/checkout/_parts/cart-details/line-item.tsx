"use client";

import type {MerchifyCartLineItem} from "@/types";

import LineItemThumbnail from "@/components/shared/line-item-thumbnail";
import PrintfileLineItemPreviewer from "@/components/shared/printfile-line-item-previewer";
import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";
import {Badge} from "@merchify/ui";
import {ExternalLink} from "lucide-react";
import Heading from "@/components/shared/typography/heading";

export default function LineItem(props: MerchifyCartLineItem) {
  const item = props;

  if (!((item?.quantity || 0) > 0)) return null;

  const unit_price = convertToLocale({
    amount: item?.unit_price || 0,
    currency_code: (item?.variant?.calculated_price?.currency_code || null)!,
  });

  const item_price = convertToLocale({
    amount: (item?.unit_price || 0) * (item?.quantity || 1),
    currency_code: (item?.variant?.calculated_price?.currency_code || null)!,
  });

  return (
    <div className="flex items-start justify-between space-x-4">
      <LineItemThumbnail item={item} />
      <div className="flex w-full flex-col items-start justify-start gap-4">
        <div className="flex w-full justify-between gap-3">
          <div>
            <Heading font="sans" mobileSize="base" tag="h3">
              {props.product?.title}
            </Heading>
            <Body
              className="text-muted-foreground mt-1"
              font="sans"
              mobileSize="sm"
            >
              {props.title}
            </Body>
          </div>
          <div className="flex min-w-[100px] flex-col items-end">
            <Body dir="ltr" font="sans" mobileSize="sm">
              {item.quantity} x {unit_price}
            </Body>
            <Body className="font-medium" font="sans" mobileSize="sm">
              {item_price}
            </Body>
          </div>
        </div>
        <div>
          <PrintfileLineItemPreviewer
            currencyCode={item?.variant?.calculated_price?.currency_code}
            items={item.printfile_line_items}
            key={item.id}
          />
        </div>
      </div>
    </div>
  );
}
