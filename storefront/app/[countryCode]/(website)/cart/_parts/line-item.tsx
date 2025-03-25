"use client";
import type {StoreCartLineItem} from "@medusajs/types";

import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";
import Image from "next/image";
import {InputQuantity} from "@/components/shared/input-quantity";
import {isOptimisticItemId, useCart} from "@/components/context/cart-context";

export default function LineItem(props: StoreCartLineItem) {
  const {cart, handleDeleteItem, handleUpdateCartQuantity, isUpdating} =
    useCart();
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

  const isOptimisticLine = isOptimisticItemId(props.id);

  return (
    <div key={item.id} className="flex py-6 sm:py-10">
      <div className="shrink-0">
        <Image
          alt={props.title}
          className="border-accent h-[100px] w-[100px] rounded-md border-[1.5px] object-cover"
          height={100}
          src={props.product?.thumbnail || ""}
          width={100}
        />
      </div>

      <div className="mr-4 flex flex-1 flex-col justify-between sm:mr-6">
        <div className="relative pl-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pl-0">
          <div>
            <div className="flex justify-between">
              <Body className="leading-[130%]" font="sans" mobileSize="lg">
                {item.product?.title}
              </Body>
            </div>
            <Body className="mt-1" font="sans" mobileSize="sm">
              {item.title}
            </Body>
            <Body className="font-semibold" font="sans" mobileSize="base">
              {item_price}
            </Body>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <div className="inline-grid w-full max-w-16 grid-cols-1">
              <InputQuantity
                quantity={item?.quantity || 0}
                disabled={isOptimisticLine || isUpdating}
                onChange={(newQty) =>
                  handleUpdateCartQuantity(props.id, newQty)
                }
              />
            </div>

            <div className="absolute top-0 left-0">
              <button
                type="button"
                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Remove</span>x
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 flex space-x-2 text-sm text-gray-700">stock</p>
      </div>
    </div>
  );
}

/*<div className="flex items-start justify-between gap-2 space-x-4">
      <Image
        alt={props.title}
        className="border-accent h-[100px] w-[100px] rounded-md border-[1.5px] object-cover"
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
    </div>*/
