"use client";

import type {MerchifyCartLineItem} from "@/types";

import LineItemThumbnail from "@/components/shared/line-item-thumbnail";
import PrintfileLineItemPreviewer from "@/components/shared/printfile-line-item-previewer";
import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";

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
            <Body className="leading-[130%]" font="sans" mobileSize="lg">
              {props.product?.title}
            </Body>
            <Body className="mt-1" font="sans" mobileSize="sm">
              {props.title}
            </Body>
          </div>
          <div className="flex min-w-[100px] flex-col items-end">
            <Body
              className="font-semibold opacity-80"
              font="sans"
              mobileSize="base"
            >
              {item.quantity} x {unit_price}
            </Body>
            <Body className="font-semibold" font="sans" mobileSize="base">
              {item_price}
            </Body>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-2">
          {props.printfile_line_items.map((item) => (
            <PrintfileLineItemPreviewer
              currencyCode={item?.variant?.calculated_price?.currency_code}
              item={item}
              key={item.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
