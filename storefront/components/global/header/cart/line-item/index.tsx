"use client";

import type {MerchifyCartLineItem} from "@/types";

import {isOptimisticItemId, useCart} from "@/components/context/cart-context";
import {InputQuantity} from "@/components/shared/input-quantity";
import LineItemThumbnail from "@/components/shared/line-item-thumbnail";
import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";
import {File, X} from "lucide-react";

export default function LineItem(props: MerchifyCartLineItem) {
  const {cart, handleDeleteItem, handleUpdateCartQuantity, isUpdating} =
    useCart();

  const item = cart?.items?.find(({id}) => id === props.id);

  if (!((item?.quantity || 0) > 0)) return null;

  const item_price = convertToLocale({
    amount: (item?.unit_price || 0) * (item?.quantity || 1),
    currency_code: (item?.variant?.calculated_price?.currency_code || null)!,
  });

  const isOptimisticLine = isOptimisticItemId(props.id);

  return (
    <div className="flex items-start justify-between gap-2 space-x-4">
      <LineItemThumbnail item={props} />
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
          <Body className="font-semibold" font="sans" mobileSize="base">
            {item_price}
          </Body>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start gap-2">
          {props.printfile_line_items.map((item) => (
            <div
              className="text-muted-foreground flex items-center gap-2 text-sm"
              key={item.id}
            >
              <File className="h-4 w-4" />
              <span>{item.title}</span>
            </div>
          ))}
        </div>
        <div className="flex w-full items-center justify-between gap-4">
          <InputQuantity
            disabled={isOptimisticLine || isUpdating}
            onChange={(newQty) => handleUpdateCartQuantity(props.id, newQty)}
            quantity={item?.quantity || 0}
          />
          <button
            className="bg-transparent disabled:pointer-events-none disabled:opacity-50"
            disabled={isOptimisticLine || isUpdating}
            onClick={() => handleDeleteItem(props.id)}
          >
            <X className="size-5" name="حذف" />
          </button>
        </div>
      </div>
    </div>
  );
}
