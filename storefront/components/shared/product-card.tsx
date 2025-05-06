import type {StoreProduct} from "@medusajs/types";

import {getProductPrice} from "@/utils/medusa/get-product-price";
import {cx} from "cva";
import Image from "next/image";

import LocalizedLink from "./localized-link";
import Tag from "./tag";
import Body from "./typography/body";
import Heading from "./typography/heading";

export default function ProductCard({
  index,
  product,
  size = "default",
}: {
  index?: number;
  product: StoreProduct | undefined;
  size?: "PLP" | "default";
}) {
  if (!product) return null;

  const {cheapestPrice} = getProductPrice({product});

  const thumbnail = product.thumbnail || product.images?.[0]?.url;

  const colors = product.options
    ?.find((o) => o.metadata?.type == "color")
    ?.values?.map((v) => ({hex: v.metadata?.hex as string, name: v.value}));

  return (
    <LocalizedLink
      className={cx("inline-flex w-64 flex-col text-center lg:w-auto")}
      href={`/products/${product?.handle}`}
      prefetch
    >
      <div className="relative w-full">
        {thumbnail && (
          <Image
            alt={product.title}
            className="aspect-square w-full rounded-md"
            height={300}
            priority={index !== undefined && index <= 2}
            src={thumbnail}
            width={300}
          />
        )}
        {product.type?.value && (
          <Tag
            className="absolute top-3 right-4"
            text={product.type.value || ""}
          />
        )}
      </div>

      <div className="pointer-events-none flex flex-1 flex-col items-center justify-center gap-1 px-6 pt-6">
        <Heading className="text-center" font="sans" tag="h3">
          {product.title}
        </Heading>
        <Body
          className="text-center"
          desktopSize="base"
          font="sans"
          mobileSize="sm"
        >
          من {cheapestPrice?.calculated_price || "NA"}
        </Body>
      </div>

      <h4 className="sr-only">Available colors</h4>
      <ul
        className="mt-auto flex items-center justify-center space-x-3 pt-4"
        role="list"
      >
        {colors?.map((color) => (
          <li
            className="size-4 rounded-full border border-black/10"
            key={color.name}
            style={{backgroundColor: color.hex}}
          >
            <span className="sr-only">{color.name}</span>
          </li>
        ))}
      </ul>
    </LocalizedLink>
  );
}
