/* eslint-disable @typescript-eslint/no-unused-vars */
import type {StoreProduct} from "@medusajs/types";

import {getProductPrice} from "@/utils/medusa/get-product-price";
import Image from "next/image";

import LocalizedLink from "./localized-link";
import Body from "./typography/body";

type Props = {
  region_id: string;
  variant?: "PDP" | "cart";
} & StoreProduct;

export function AddonsItem({region_id, variant = "PDP", ...product}: Props) {
  const {cheapestPrice} = getProductPrice({
    product,
  });

  const default_variant = product.variants?.[0];
  const variantWithProduct = !default_variant
    ? default_variant
    : {...default_variant, product};

  return (
    <LocalizedLink
      className="flex w-full gap-2"
      href={`/products/${product.handle}`}
      prefetch
    >
      {product.images?.[0].url && (
        <Image
          alt={product.title}
          className="border-accent aspect-square h-[100px] w-[100px] rounded-lg border-[1.5px]"
          height={100}
          src={product.images?.[0].url}
          width={100}
        />
      )}
      <div className="flex w-full flex-col justify-between">
        <div className="flex flex-col gap-2">
          <Body
            className="font-semibold"
            desktopSize="lg"
            font="sans"
            mobileSize="base"
          >
            {product.title}
          </Body>
          <Body desktopSize="base" font="sans" mobileSize="sm">
            {default_variant?.title} / {cheapestPrice?.calculated_price}
          </Body>
        </div>
      </div>
    </LocalizedLink>
  );
}
