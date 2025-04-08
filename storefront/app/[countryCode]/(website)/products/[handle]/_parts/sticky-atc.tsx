"use client";

import type {StoreProduct} from "@medusajs/types";

import {cx} from "cva";
import {useEffect, useState} from "react";

import {ProductVariantsProvider} from "../../../../../../components/context/product-context";
import InitiateEditor from "./initiate-editor-button";

export default function StickyAtc({
  region_id,
  ...product
}: {region_id: string} & StoreProduct) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setIsVisible(rect.top > window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ProductVariantsProvider product={product}>
      <div
        className={cx(
          "border-accent bg-background fixed right-0 bottom-0 left-0 z-80 w-screen min-w-[320px] border-t p-5 transition-transform duration-300 lg:hidden",
          {
            "translate-y-0": isVisible,
            "translate-y-full": !isVisible,
          },
        )}
      >
        <div className="flex items-center justify-center gap-3">
          <InitiateEditor regionId={region_id} variant="sticky" />
        </div>
      </div>
    </ProductVariantsProvider>
  );
}
