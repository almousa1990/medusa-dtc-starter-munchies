"use client";
import Icon from "@/components/shared/icon";
import {OpenDialog} from "@/components/shared/side-dialog";
import Body from "@/components/shared/typography/body";

import {useCart} from "./cart-context";

export default function OpenCart() {
  const {cart} = useCart();

  const count = (cart?.items?.length || 0).toFixed();

  return (
    <OpenDialog>
      <div className="relative h-10 w-10 p-2">
        <Icon className="text-primary" name="Cart" />
        <Body
          className="bg-primary text-primary-foreground absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full"
          font="sans"
          mobileSize="sm"
        >
          {count}
        </Body>
      </div>
    </OpenDialog>
  );
}
