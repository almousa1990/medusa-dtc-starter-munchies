"use client";
import {cn} from "@merchify/ui";
import Image from "next/image";

export function CountryFlag({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const upperCode = code?.toUpperCase();
  const fallbackSrc = "/flags/placeholder.svg"; // Provide a default placeholder flag

  return (
    <Image
      src={`/flags/${upperCode}.svg`}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = fallbackSrc;
      }}
      alt={`Flag of ${upperCode}`}
      title={`Flag of ${upperCode}`}
      loading="lazy"
      width={20}
      height={20}
      className={cn("inline-block size-5", className)}
    />
  );
}
