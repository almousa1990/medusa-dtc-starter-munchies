"use client";
import {cn} from "@merchify/ui";
import Image from "next/image";

export function CountryFlag({
  className,
  code,
}: {
  className?: string;
  code: string;
}) {
  const upperCode = code?.toUpperCase();
  const fallbackSrc = "/flags/placeholder.svg"; // Provide a default placeholder flag

  return (
    <Image
      alt={`Flag of ${upperCode}`}
      className={cn("inline-block size-5", className)}
      height={20}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = fallbackSrc;
      }}
      src={`/flags/${upperCode}.svg`}
      title={`Flag of ${upperCode}`}
      width={20}
    />
  );
}
