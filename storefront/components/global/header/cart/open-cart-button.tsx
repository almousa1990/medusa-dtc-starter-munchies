"use client";
import {OpenDialog} from "@/components/shared/side-dialog";
import Body from "@/components/shared/typography/body";

import {useCart} from "../../../context/cart-context";
import {ShoppingBag} from "lucide-react";
import {usePathname} from "next/navigation";
import {cn} from "@merchify/ui";
import Icon from "@/components/shared/icon";

export default function OpenCart() {
  const {cart} = useCart();
  const pathname = usePathname();

  const count = (cart?.items?.length || 0).toFixed();
  const isCartPage = pathname === "/cart";

  return (
    <OpenDialog disabled={isCartPage}>
      <div
        className={cn("flex items-center", {
          "cursor-pointer": !isCartPage,
        })}
      >
        <Icon name="Cart" className="size-6" />
        <Body font="sans" mobileSize="sm" className="mr-1">
          {count}
        </Body>
      </div>
    </OpenDialog>
  );
}
