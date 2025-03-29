"use client";
import type {StoreOrderLineItem} from "@medusajs/types";

import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";
import Image from "next/image";
import {Skeleton} from "@merchify/ui";

export default function LineItem(props: StoreOrderLineItem) {
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
      <Image
        alt={props.title}
        className="size-20 rounded-md border object-cover"
        height={100}
        src={props.product?.thumbnail || ""}
        width={100}
      />
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
      </div>
    </div>
  );
}

export const LineItemSkeleton = () => {
  return (
    <div className="flex items-start justify-between space-x-4">
      <Skeleton className="size-20 rounded-md" />

      <div className="flex w-full flex-col items-start justify-start gap-4">
        <div className="flex w-full justify-between gap-3">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex min-w-[100px] flex-col items-end gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};
