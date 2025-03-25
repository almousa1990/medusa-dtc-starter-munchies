"use client";

import type {Header} from "@/types/sanity.generated";

import Icon from "@/components/shared/icon";
import {CloseDialog, Dialog, SideDialog} from "@/components/shared/side-dialog";
import Body from "@/components/shared/typography/body";

import {useCart} from "../../../context/cart-context";
import CartFooter from "./cart-footer";
import CartHeading from "./cart-heading";
import LineItem from "./line-item";
import OpenCart from "./open-cart-button";

type Props = Pick<Header, "cartAddons">;

export default function CartUI({
  addons,
}: {addons: React.ReactElement | null} & Props) {
  const {cart} = useCart();
  const isEmptyCart = !cart?.items || cart.items.length === 0;

  return (
    <Dialog>
      <OpenCart />
      <SideDialog>
        <div className="bg-background relative flex h-full w-full flex-col lg:border-r">
          <div className="relative flex items-center justify-between">
            <CartHeading />
            <CloseDialog aria-label="Close" className="mr-auto ml-4">
              <Icon className="h-9 w-9" name="Close" />
            </CloseDialog>
          </div>
          <div className="bg-border h-px w-full" />

          <div className="flex flex-1 flex-col justify-between overflow-y-scroll">
            <div className="flex flex-col gap-4 p-4">
              {isEmptyCart ? (
                <Body font="sans" mobileSize="base">
                  السلة فارغة.
                </Body>
              ) : (
                cart.items?.map((item) => <LineItem key={item.id} {...item} />)
              )}
            </div>
            {addons}
          </div>
          {!isEmptyCart && <CartFooter />}
        </div>
      </SideDialog>
    </Dialog>
  );
}
