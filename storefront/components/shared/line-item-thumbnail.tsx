"use client";

import type {MerchifyCartLineItem} from "@/types";

import {fetchCartLineItem} from "@/actions/medusa/cart";
import clsx from "clsx";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";

export default function LineItemThumbnail({
  item: initialItem,
  pollingInterval = 5000,
}: {
  item: MerchifyCartLineItem;
  pollingInterval?: number;
}) {
  const [item, setItem] = useState<MerchifyCartLineItem>(initialItem);
  const [isLoading, setIsLoading] = useState(
    Boolean(
      item.metadata?.mockup_rendition_id &&
        !item.metadata?.mockup_thumbnail_generated,
    ),
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading) return;

    intervalRef.current = setInterval(async () => {
      const updatedItem = await fetchCartLineItem(item.id);
      if (!updatedItem) return;

      const shouldStillLoad = Boolean(
        updatedItem.metadata?.mockup_rendition_id &&
          !updatedItem.metadata?.mockup_thumbnail_generated,
      );

      setItem(updatedItem);

      if (!shouldStillLoad) {
        clearInterval(intervalRef.current!);
        setIsLoading(false);
      }
    }, pollingInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading, item.id, pollingInterval]);

  return (
    <div className="relative h-[100px] w-[100px]">
      <Image
        alt={item.title}
        className={clsx(
          "border-accent h-full w-full rounded-md border-[1.5px] object-cover transition-opacity duration-300",
          {"opacity-70": isLoading},
        )}
        height={100}
        key={item.thumbnail}
        src={item.thumbnail || "/placeholder.png"}
        width={100}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/50 backdrop-blur-sm">
          <div className="border-accent h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
