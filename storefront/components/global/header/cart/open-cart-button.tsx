"use client";
import {useCart} from "@/components/context/cart-context";
import Icon from "@/components/shared/icon";
import {OpenDialog} from "@/components/shared/side-dialog";
import Body from "@/components/shared/typography/body";
import {cn} from "@merchify/ui";
import {usePathname} from "next/navigation";

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
        <Icon className="size-6" name="Cart" />
        <Body className="mr-1" font="sans" mobileSize="sm">
          {count}
        </Body>
      </div>
    </OpenDialog>
  );
}
