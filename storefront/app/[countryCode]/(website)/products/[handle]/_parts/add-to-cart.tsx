"use client";
import type {ButtonProps} from "@/components/shared/button";
import type {StoreProductVariant} from "@medusajs/types";

import {addToCartEventBus} from "@/utils/event-bus";
import {Cta} from "@/components/shared/button";
import {track} from "@vercel/analytics";
import {cx} from "cva";

import {useProductVariants} from "../../../../../../components/context/product-context";

export default function AddToCart({
  region_id,
  variant,
}: {
  region_id: string;
  variant: "PDP" | "sticky";
}) {
  const {activeVariant} = useProductVariants();
  return (
    <AddToCartButton
      label="Add to cart"
      productVariant={activeVariant}
      regionId={region_id}
      size={variant === "PDP" ? "xl" : "default"}
    />
  );
}

type AddToCartButtonProps = {
  label: string;
  productVariant: StoreProductVariant | undefined;
  regionId: string;
} & Omit<ButtonProps, "onClick">;

export function AddToCartButton({
  label,
  productVariant,
  regionId,
  ...buttonProps
}: AddToCartButtonProps) {
  const handleAddToCart = () => {
    if (!productVariant) return;

    addToCartEventBus.emitCartAdd({
      productVariant,
      regionId,
    });

    track("add-to-cart", {
      quantity: 1,
      region_id: regionId,
      variantId: productVariant.id,
    });
  };

  console.log(buttonProps);
  return (
    <Cta
      {...buttonProps}
      disabled={!addToCartEventBus.handler || !productVariant}
      onClick={(e) => {
        e.preventDefault();
        if (productVariant) {
          handleAddToCart();
        }
      }}
    >
      {label}
    </Cta>
  );
}
