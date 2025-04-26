"use client";
import type {MerchifyCartLineItem} from "@/types";

import {isOptimisticItemId, useCart} from "@/components/context/cart-context";
import {Cta} from "@/components/shared/button";
import {InputQuantity} from "@/components/shared/input-quantity";
import LineItemThumbnail from "@/components/shared/line-item-thumbnail";
import PrintfileLineItemPreviewer from "@/components/shared/printfile-line-item-previewer";
import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";
import {Edit2, PencilRuler, X} from "lucide-react";
import {useRouter} from "next/navigation";

export default function LineItem(props: MerchifyCartLineItem) {
  const {cart, handleDeleteItem, handleUpdateItem, isUpdating} = useCart();
  const item = props;
  const router = useRouter();

  if (!((item?.quantity || 0) > 0)) return null;

  const unit_price = convertToLocale({
    amount: item?.unit_price || 0,
    currency_code: (item?.variant?.calculated_price?.currency_code || null)!,
  });

  const item_price = convertToLocale({
    amount: (item?.unit_price || 0) * (item?.quantity || 1),
    currency_code: (cart?.currency_code || null)!,
  });

  const isOptimisticLine = isOptimisticItemId(props.id);

  return (
    <div className="flex py-6 sm:py-10" key={item.id}>
      <div className="shrink-0">
        <LineItemThumbnail item={item} />
      </div>

      <div className="mr-4 flex flex-1 flex-col justify-between gap-2 sm:mr-6">
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

          <div className="mt-4 sm:mt-0">
            <div className="inline-grid w-full max-w-24 grid-cols-1">
              <InputQuantity
                disabled={isOptimisticLine || isUpdating}
                onChange={(newQty) =>
                  handleUpdateItem(props.id, {quantity: newQty})
                }
                quantity={item?.quantity || 0}
              />
            </div>

            <div className="absolute top-0 left-0 flex gap-2">
              <Cta
                className="px-2"
                disabled={isOptimisticLine || isUpdating}
                onClick={() =>
                  router.push(
                    `/editor/${props.product_handle}?lineItem=${props.id}`,
                  )
                }
                type="button"
                variant="secondary"
              >
                <span className="sr-only">تعديل</span>
                <PencilRuler className="size-3" />
              </Cta>
              <Cta
                className="px-2"
                disabled={isOptimisticLine || isUpdating}
                onClick={() => handleDeleteItem(props.id)}
                type="button"
                variant="secondary"
              >
                <span className="sr-only">حذف</span>
                <X className="size-3" />
              </Cta>
            </div>
          </div>
        </div>

        <PrintfileLineItemPreviewer
          currencyCode={cart?.currency_code}
          items={props.printfile_line_items}
        />
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
