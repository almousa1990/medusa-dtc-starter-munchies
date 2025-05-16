"use client";
import type {StoreProduct} from "@medusajs/types";

import Body from "@/components/shared/typography/body";
import {getProductPrice} from "@/utils/medusa/get-product-price";

import {useProductVariants} from "../../../../../../components/context/product-context";

export default function Price({
  product,
}: {
  product: Pick<StoreProduct, "id" | "variants">;
}) {
  const {activeVariant} = useProductVariants();

  const {cheapestPrice, variantPrice} = getProductPrice({
    product,
    variantId: activeVariant?.id,
  });

  return (
    (variantPrice?.calculated_price || cheapestPrice?.calculated_price) && (
      <div>
        <Body
          as="span"
          className="font-medium"
          desktopSize="xl"
          font="sans"
          mobileSize="lg"
        >
          {variantPrice?.calculated_price ? (
            variantPrice.calculated_price
          ) : (
            <>يبدأ من {cheapestPrice?.calculated_price}</>
          )}
        </Body>
        <Body className="text-muted-foreground" mobileSize="sm">
          شامل الضريبة. يتم احتساب الشحن عند إتمام الشراء.
        </Body>
      </div>
    )
  );
}
