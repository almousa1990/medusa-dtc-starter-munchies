"use client";
import {OpenDialog} from "@/components/shared/side-dialog";
import Body from "@/components/shared/typography/body";

import {useCart} from "../../../context/cart-context";
import {ShoppingBag} from "lucide-react";
import {usePathname} from "next/navigation";
import {cn} from "@merchify/ui";

export default function OpenCart() {
  const {cart} = useCart();
  const pathname = usePathname();

  const count = (cart?.items?.length || 0).toFixed();
  const isCartPage = pathname === "/cart";

  return (
    <OpenDialog disabled={isCartPage}>
      <div
        className={cn("relative h-10 w-10 p-2", {
          "cursor-pointer": !isCartPage,
        })}
      >
        <ShoppingBag />
        <Body
          className="bg-primary text-primary-foreground absolute top-0 left-0 flex h-5 w-5 items-center justify-center rounded-full"
          font="sans"
          mobileSize="sm"
        >
          {count}
        </Body>
      </div>
    </OpenDialog>
  );
}
