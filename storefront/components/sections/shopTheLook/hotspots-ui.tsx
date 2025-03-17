"use client";
import type {StoreProduct} from "@medusajs/types";

import {Link} from "@/components/shared/button";
import LocalizedLink from "@/components/shared/localized-link";
import {SanityImage} from "@/components/shared/sanity-image";
import Tag from "@/components/shared/tag";
import Body from "@/components/shared/typography/body";
import {getProductPrice} from "@/utils/medusa/get-product-price";
import {cx} from "cva";
import Image from "next/image";
import {useState} from "react";

import type {ModularPageSection} from "../types";

export default function HotspotsUi({
  image,
  productHotSpots,
  products,
}: {
  products: StoreProduct[];
} & Pick<
  ModularPageSection<"section.shopTheLook">,
  "image" | "productHotSpots"
>) {
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(
    productHotSpots?.[0]?.product?._ref,
  );
  const referencedProducts = products.filter((product) =>
    productHotSpots?.some((hotspot) => hotspot.product?._ref === product.id),
  );

  const product = referencedProducts.find(
    (product) => product.id === selectedProduct,
  );
  if (!product) return null;
  const {cheapestPrice} = getProductPrice({product});

  const thumbnailUrl = product?.thumbnail || product?.images?.[0].url;

  return (
    <div className="gap-xs lg:gap-s flex w-full flex-col items-stretch justify-start lg:flex-row">
      {image ? (
        <div className="relative w-full min-w-[63%] rounded-lg">
          <SanityImage className="w-full rounded-lg" data={image} />
          {productHotSpots?.map((hotSpot) => {
            return (
              <div
                className={cx(
                  "group bg-accent hover:bg-secondary relative h-6 w-6 cursor-pointer rounded-full transition-all duration-300 lg:h-8 lg:w-8",
                  {
                    "bg-secondary": selectedProduct === hotSpot.product?._ref,
                  },
                )}
                key={hotSpot._key}
                onClick={() =>
                  setSelectedProduct(hotSpot.product?._ref ?? undefined)
                }
                style={{
                  left: `${hotSpot.x}%`,
                  position: "absolute",
                  top: `${hotSpot.y}%`,
                }}
              >
                <span
                  className={cx(
                    "group-hover:bg-accent absolute top-1/2 left-1/2 z-10 h-[1.5px] w-2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 lg:w-[13px]",
                    {
                      "bg-accent": selectedProduct === hotSpot.product?._ref,
                      "bg-background":
                        selectedProduct !== hotSpot.product?._ref,
                    },
                  )}
                />
                <span
                  className={cx(
                    "group-hover:bg-accent absolute top-1/2 left-1/2 h-2 w-[1.5px] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:rotate-90 lg:h-[13px]",
                    {
                      "bg-background":
                        selectedProduct !== hotSpot.product?._ref,
                      "bg-accent rotate-90":
                        selectedProduct === hotSpot.product?._ref,
                    },
                  )}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-secondary w-full min-w-[63%] rounded-lg" />
      )}
      <LocalizedLink
        className="gap-2xl hidden w-full max-w-[450px] flex-col justify-between rounded-lg lg:flex"
        href={`/products/${product?.handle}`}
        prefetch
      >
        <div className="flex w-full max-w-[450px] flex-1 flex-col items-center justify-center rounded-lg">
          <div className="relative w-full">
            {thumbnailUrl ? (
              <Image
                alt={product.title}
                className="aspect-square w-full rounded-lg"
                height={450}
                src={thumbnailUrl}
                width={450}
              />
            ) : null}
            {product.type?.value && (
              <Tag
                className="absolute top-3 right-4"
                text={product.type.value || ""}
              />
            )}
          </div>
          <div className="px-lg py-sm flex flex-1 flex-col items-center justify-center gap-1">
            <Body
              className="text-center"
              desktopSize="xl"
              font="sans"
              mobileSize="lg"
            >
              {product.title}
            </Body>
            <Body
              className="text-center"
              desktopSize="base"
              font="sans"
              mobileSize="sm"
            >
              from {cheapestPrice?.calculated_price || "NA"}
            </Body>
          </div>
        </div>
        <Link
          className="w-full"
          href={`/products/${product?.handle}`}
          renderAsChild
          size="xl"
          variant="outline"
        >
          Shop now
        </Link>
      </LocalizedLink>
      <div className="gap-xs flex flex-col lg:hidden">
        {referencedProducts.map((product) => {
          const {cheapestPrice} = getProductPrice({product});
          const thumbnailUrl = product?.thumbnail || product?.images?.[0].url;
          return (
            <LocalizedLink
              className={cx("p-xs flex w-full gap-[10px] rounded-2xl", {
                "bg-secondary": selectedProduct === product.id,
              })}
              href={`/products/${product?.handle}`}
              key={product.id}
              prefetch
            >
              {thumbnailUrl ? (
                <Image
                  alt={product?.title}
                  className="border-accent aspect-square w-full max-w-[100px] rounded-lg border"
                  height={100}
                  src={thumbnailUrl}
                  width={100}
                />
              ) : null}
              <div className="py-xs flex flex-col items-start justify-start gap-1">
                <Body className="text-pretty" font="sans" mobileSize="lg">
                  {product?.title}
                </Body>
                <Body font="sans" mobileSize="sm">
                  from {cheapestPrice?.calculated_price || "NA"}
                </Body>
              </div>
            </LocalizedLink>
          );
        })}
        <Link
          className="w-full"
          href={"/products"}
          prefetch
          size="xl"
          variant="outline"
        >
          Shop now
        </Link>
      </div>
    </div>
  );
}
