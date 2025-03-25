"use client";

import {Cta, Link} from "@/components/shared/button";
import Body from "@/components/shared/typography/body";
import {convertToLocale} from "@/utils/medusa/money";

import {useCart} from "../../../context/cart-context";

export default function CartFooter() {
  const {cart, isUpdating} = useCart();

  const item_total = cart
    ? convertToLocale({
        amount: cart.item_total,
        currency_code: cart.currency_code,
      })
    : null;

  const cartIsEmpty = cart?.items?.length === 0;

  if (cartIsEmpty) return null;

  return (
    <>
      <div className="bg-accent h-px w-full" />
      <div className="flex w-full flex-col justify-between gap-4 p-4">
        <div className="flex w-full justify-between gap-4">
          <div>
            <Body className="font-semibold" font="sans" mobileSize="base">
              الإجمالي
            </Body>
            <Body font="sans" mobileSize="sm">
              الضرائب وتكاليف الشحن تُحسب عند إتمام الطلب.
            </Body>
          </div>
          {item_total && (
            <Body font="sans" mobileSize="base">
              {item_total}
            </Body>
          )}
        </div>
        {!cartIsEmpty && !isUpdating ? (
          <Link className="w-full" href="/cart" size="lg" variant="default">
            عرض السلة
          </Link>
        ) : (
          <Cta className="w-full" disabled size="lg" variant="default">
            عرض السلة
          </Cta>
        )}
      </div>
    </>
  );
}
