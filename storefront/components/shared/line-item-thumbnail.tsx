"use client";

import type {MerchifyCartLineItem} from "@/types";

import {fetchCartLineItem} from "@/actions/medusa/cart";
import clsx from "clsx";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {cn} from "@merchify/ui";
import {Loader2} from "lucide-react";

export default function LineItemThumbnail({
  item: initialItem,
  className,
  pollingInterval = 5000,
}: {
  item: MerchifyCartLineItem;
  pollingInterval?: number;
  className?: string;
}) {
  const [item, setItem] = useState<MerchifyCartLineItem>(initialItem);
  const [isLoading, setIsLoading] = useState(
    Boolean(item.metadata?.pending_mockup),
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading) return;

    intervalRef.current = setInterval(async () => {
      const updatedItem = await fetchCartLineItem(item.id);
      if (!updatedItem) return;

      const shouldStillLoad = Boolean(updatedItem.metadata?.pending_mockup);

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
    <div className={cn("relative size-24 sm:size-36", className)}>
      <Image
        alt={item.title}
        className={clsx(
          "aspect-square rounded-md object-cover transition-opacity duration-300",
          {"opacity-70": isLoading},
        )}
        height={144}
        key={item.thumbnail}
        src={item.thumbnail || "/placeholder.png"}
        width={144}
      />
      {isLoading && (
        <div className="bg-secondary absolute inset-0 flex items-center justify-center rounded-md backdrop-blur-sm">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
}
