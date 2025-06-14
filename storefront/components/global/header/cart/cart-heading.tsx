"use client";

import Heading from "@/components/shared/typography/heading";
import {Title} from "@radix-ui/react-dialog";

import {useCart} from "../../../context/cart-context";

export default function CartHeading() {
  const {cart} = useCart();

  const count = (cart?.items?.length ?? 0).toString();

  return (
    <div className="flex min-h-[calc(var(--header-height))] items-center justify-start px-4">
      <Title asChild>
        <Heading desktopSize="xl" font="serif" mobileSize="lg" tag="h2">
          سلة التسوق ({count})
        </Heading>
      </Title>
    </div>
  );
}
