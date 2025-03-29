"use client";
import type {StoreCartLineItem} from "@medusajs/types";

import Icon from "@/components/shared/icon";
import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";
import Image from "next/image";

import {isOptimisticItemId, useCart} from "@/components/context/cart-context";
import {InputQuantity} from "@/components/shared/input-quantity";
import {X} from "lucide-react";

export default function LineItem(props: StoreCartLineItem) {
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
      <Image
        alt={props.title}
        className="border-accent h-[100px] w-[100px] rounded-lg border-[1.5px] object-cover"
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
          <Body className="font-semibold" font="sans" mobileSize="base">
            {item_price}
          </Body>
        </div>
        <div className="flex w-full items-center justify-between gap-4">
          <InputQuantity
            quantity={item?.quantity || 0}
            disabled={isOptimisticLine || isUpdating}
            onChange={(newQty) => handleUpdateCartQuantity(props.id, newQty)}
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
